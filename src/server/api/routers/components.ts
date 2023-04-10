import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const componentRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const components = await ctx.prisma.component.findMany();
    // Randomize the order of the components
    return components.sort(() => Math.random() - 0.5);
  })
});
