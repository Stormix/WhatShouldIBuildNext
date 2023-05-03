import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { z } from 'zod';

export const componentRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const components = await ctx.prisma.component.findMany();
    // Randomize the order of the components
    return components.sort(() => Math.random() - 0.5);
  }),
  getOne: publicProcedure.input(z.object({ value: z.string() })).query(async ({ ctx, input }) => {
    const component = await ctx.prisma.component.findUnique({
      where: {
        value: input.value
      }
    });

    if (!component) {
      return null;
    }

    return component;
  })
});
