import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import CreditsService from '@/server/services/credits';
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
          }
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
        ideas: ideas.map((idea) => ({
          id: idea.id,
          title: idea.title,
          difficulty: idea.difficulty,
          timeToComplete: idea.timeToComplete,
          description: idea.description,
          number: idea.number,
          createdAt: idea.createdAt,
          updatedAt: idea.updatedAt,
          author: {
            id: idea.author.id,
            name: idea.author.name!
          },
          keywords: idea.components.map((component) => component.component.value),
          saved: savedUserIdeas?.savedIdeas.some((savedIdea) => savedIdea.id === idea.id) ?? false
        })),
        nextCursor
      };
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
            author: true
          }
        });

        return {
          id: idea.id,
          title: idea.title,
          difficulty: idea.difficulty,
          timeToComplete: idea.timeToComplete,
          description: idea.description,
          number: idea.number,
          createdAt: idea.createdAt,
          updatedAt: idea.updatedAt,
          author: {
            id: idea.author.id,
            name: idea.author.name!
          },
          keywords: components.map((component) => component.value),
          saved: false
        };
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
    })
});
