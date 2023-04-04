import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { generateSchema } from '@/validation/generate';

export const ideasRouter = createTRPCRouter({
  generate: publicProcedure.input(generateSchema).mutation(({ input }) => {
    return input;
  })
});
