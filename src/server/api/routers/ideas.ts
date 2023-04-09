import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import CreditsService from '@/server/services/credits';
import { ideaToIdeaDto } from '@/utils/ideas';
import { generateInputSchema, generateOutputSchema } from '@/validation/generate';
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

      return ideaToIdeaDto(
        idea,
        savedUserIdeas?.savedIdeas.some((savedIdea) => savedIdea.id === idea.id) ?? false,
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

        const DRY_RUN = true;
        let rawResponse = '';

        if (DRY_RUN) {
          rawResponse = JSON.stringify({
            idea: 'Your idea here',
            description: 'Your description here',
            timeToComplete: '1 hour',
            difficulty: 'easy'
          });
        } else {
          rawResponse = await IdeasService.generate(prompt);
        }

        await CreditsService.deduct(ctx.session.user.id, 1);

        const openAIResponse = JSON.parse(rawResponse) as OpenAIIdea;
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
        // Refund credits
        await CreditsService.reward(ctx.session.user.id, 1);
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
