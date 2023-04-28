import { env } from '@/env.mjs';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import CreditsService from '@/server/services/credits';
import { ideaToIdeaDto } from '@/utils/ideas';
import { generateInputSchema, generateOutputSchema } from '@/validation/generate';
import * as Sentry from '@sentry/node';
import { TRPCClientError } from '@trpc/client';
import { TRPCError } from '@trpc/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { z } from 'zod';
import IdeasService from '../../services/ideas';

interface OpenAIIdea {
  idea: string;
  difficulty: string;
  timeToComplete: string;
  description: string;
}

const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '1 m'),
  analytics: true
});

export const ideasRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        filter: z.string().nullish()
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const ideas = await ctx.prisma.idea.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        include: {
          author: true,
          components: {
            include: {
              component: true
            }
          },
          ratings: true
        },
        cursor: !!cursor ? { id: cursor } : undefined,
        orderBy: {
          id: 'desc'
        },
        ...(input.filter
          ? {
              where: {
                OR: [
                  {
                    description: {
                      search: input.filter
                    }
                  },
                  {
                    title: {
                      search: input.filter
                    }
                  }
                ]
              }
            }
          : {})
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (ideas.length > limit) {
        const nextItem = ideas.pop();
        nextCursor = nextItem!.id;
      }

      const savedUserIdeas = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session?.user.id
        },
        select: {
          savedIdeas: {
            select: {
              id: true
            }
          }
        }
      });

      return {
        ideas: ideas.map((idea) =>
          ideaToIdeaDto(
            idea,
            savedUserIdeas?.savedIdeas.some((savedIdea) => savedIdea.id === idea.id) ?? false,
            idea.ratings.some((rating) => rating.userId === ctx.session?.user.id)
          )
        ),
        nextCursor
      };
    }),

  leaderboard: publicProcedure.query(async ({ ctx }) => {
    const ideas = await ctx.prisma.idea.findMany({
      include: {
        author: true,
        components: {
          include: {
            component: true
          }
        },
        ratings: true,
        savedBy: true
      }
    });

    // Sort by average rating and then by number of saves
    ideas.sort((a, b) => {
      const aRating = (a.ratings?.reduce((acc, rating) => acc + rating.rating, 0) ?? 0) / (a.ratings.length || 1);
      const bRating = (b.ratings?.reduce((acc, rating) => acc + rating.rating, 0) ?? 0) / (b.ratings.length || 1);
      const aSaves = a.savedBy.length;
      const bSaves = b.savedBy.length;

      if (aRating > bRating) {
        return -1;
      }

      if (aRating < bRating) {
        return 1;
      }

      if (aSaves > bSaves) {
        return -1;
      }

      if (aSaves < bSaves) {
        return 1;
      }

      return 0;
    });

    return {
      ideas: ideas.slice(0, 100).map((idea) => ideaToIdeaDto(idea, false, false))
    };
  }),

  getOne: publicProcedure
    .input(
      z.object({
        id: z.string().nullish()
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input.id) {
        // skip
        return null;
      }

      const idea = await ctx.prisma.idea.findUnique({
        where: {
          id: input.id
        },
        include: {
          ratings: true,
          components: {
            include: {
              component: true
            }
          },
          author: true
        }
      });

      if (!idea) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Idea not found'
        });
      }
      let savedUserIdeas = null;
      if (ctx.session) {
        savedUserIdeas = await ctx.prisma.user.findUnique({
          where: {
            id: ctx.session?.user.id
          },
          select: {
            savedIdeas: {
              select: {
                id: true
              }
            }
          }
        });
      }
      return ideaToIdeaDto(
        idea,
        savedUserIdeas?.savedIdeas?.some((savedIdea) => savedIdea.id === idea.id) ?? false,
        idea.ratings.some((rating) => rating.userId === ctx.session?.user.id)
      );
    }),

  generate: protectedProcedure
    .input(generateInputSchema)
    .output(generateOutputSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const components = await ctx.prisma.component.findMany({
          where: {
            id: {
              in: Object.values(input)
            }
          }
        });

        const prompt = IdeasService.componentsToPrompt(components);

        if (!prompt) {
          throw new TRPCClientError('Invalid input');
        }

        const { success, reset } = await rateLimit.limit(ctx.session.user.id);
        const duration = Math.ceil((reset - Date.now()) / 1000);

        if (!success) {
          throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message: `You have exceeded the rate limit. Please try again in ${duration}s.`
          });
        }

        let rawResponse = '';

        if (env.ENABLE_OPENAI?.toLowerCase() === 'true') {
          rawResponse = await IdeasService.generate(prompt);
        } else {
          rawResponse = JSON.stringify({
            idea: 'Your idea here',
            description: 'Your description here',
            timeToComplete: '1 hour',
            difficulty: 'easy'
          });
        }

        await CreditsService.deduct(ctx.session.user.id, 1);

        let openAIResponse: OpenAIIdea | null = null;

        try {
          openAIResponse = JSON.parse(rawResponse) as OpenAIIdea;
        } catch (e) {
          Sentry.captureMessage('Failed to parse OpenAI response', {
            extra: {
              rawResponse,
              error: e
            }
          });
          throw new TRPCClientError("We couldn't parse the response from OpenAI. Generating again usually fixes this.");
        }

        const ideasCount = await ctx.prisma.idea.count({});

        const idea = await ctx.prisma.idea.create({
          data: {
            title: openAIResponse.idea,
            description: openAIResponse.description,
            timeToComplete: openAIResponse.timeToComplete,
            difficulty: openAIResponse.difficulty,
            components: {
              create: Object.values(input).map((id) => ({
                component: {
                  connect: {
                    id
                  }
                }
              }))
            },
            authorId: ctx.session.user.id,
            number: ideasCount + 1
          },
          include: {
            author: true,
            components: {
              include: {
                component: true
              }
            },
            ratings: true
          }
        });

        return ideaToIdeaDto(
          idea,
          false,
          idea.ratings.some((rating) => rating.userId === ctx.session?.user.id)
        );
      } catch (error) {
        console.error('Failed to generate idea:', error);
        Sentry.captureException(error, {
          extra: {
            input
          }
        });
        // Refund credits
        await CreditsService.reward(ctx.session.user.id, 2);
        throw new TRPCClientError('Something went wrong: ' + (error as Error).message);
      }
    }),

  save: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const idea = await ctx.prisma.idea.findUnique({
        where: {
          id: input.id
        }
      });

      if (!idea) {
        throw new TRPCClientError('Invalid idea');
      }

      // if (idea.authorId === ctx.session.user.id) {
      //   throw new TRPCClientError('You cannot save your own idea');
      // }

      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id
        },
        data: {
          savedIdeas: {
            connect: {
              id: idea.id
            }
          }
        },
        include: {
          savedIdeas: true
        }
      });

      return user.savedIdeas;
    }),

  rate: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        rating: z.number().min(1).max(5)
      })
    )
    .mutation(async ({ input, ctx }) => {
      const idea = await ctx.prisma.idea.findUnique({
        where: {
          id: input.id
        },
        include: {
          ratings: true
        }
      });

      if (!idea) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Idea not found' });
      }

      const rating = idea.ratings.find((rating) => rating.userId === ctx.session.user.id);

      if (rating) {
        throw new TRPCClientError("You've already rated this idea");
      }

      await ctx.prisma.rating.create({
        data: {
          rating: input.rating,
          ideaId: idea.id,
          userId: ctx.session.user.id
        }
      });
    })
});
