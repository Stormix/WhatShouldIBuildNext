import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { generateSchema } from '@/validation/generate';
import { z } from 'zod';
import IdeasService from '../services/ideas';

export const ideasRouter = createTRPCRouter({
  generate: publicProcedure
    .input(generateSchema)
    .output(
      z.object({
        idea: z.string(),
        difficulty: z.string(),
        timeToComplete: z.string(),
        description: z.string()
      })
    )
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

        const response = await ctx.openai.createCompletion({
          model: 'text-davinci-003',
          prompt: `Given the following prompt: ${prompt}, can you generate a development project Idea?
        Make sure to return only one idea and it must include all the requirements in the original prompt.
        Also make sure to proofread the idea and provide a description for it. You can use the following template in JSON:\n\n
        \`\`\`
        {
          "idea": "Your idea here",
          "description": "Your description here"
          "timeToComplete": "",
          "difficulty": ""
        }
        \`\`\`\n\n
        You can also use the following difficulty levels: easy, medium, hard, and advanced.
        The time to complete should be in hours.
        \n\n
        `,
          temperature: 0,
          max_tokens: 250
        });

        const rawResponse = response.data.choices[0]?.text;

        if (!rawResponse) {
          throw new Error('No response from OpenAI');
        }

        const responseJSON = JSON.parse(rawResponse);

        return responseJSON;
      } catch (error) {
        console.error((error as Error).message);
        return null;
      }
    })
});
