import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import CreditsService from '@/server/services/credits';
import { generateInputSchema, generateOutputSchema } from '@/validation/generate';
import { TRPCClientError } from '@trpc/client';
import { TRPCError } from '@trpc/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
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

        const openAIResponse = JSON.parse(rawResponse) satisfies OpenAIIdea;
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
          keywords: components.map((component) => component.value)
        };
      } catch (error) {
        console.error('Failed to generate idea:', error);
        // Refund credits
        await CreditsService.reward(ctx.session.user.id, 1);
        throw new TRPCClientError('Something went wrong: ' + (error as Error).message);
      }
    })
});
