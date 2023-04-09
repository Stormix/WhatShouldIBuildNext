import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const componentRouter = createTRPCRouter({
  // hello: publicProcedure.input(z.object({ text: z.string() })).query(({ input }) => {
  //   return {
  //     greeting: `Hello ${input.text}`
  //   };
  // }),

  // getAll: publicProcedure.query(({ ctx }) => {
  //   return ctx.prisma.example.findMany();
  // }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return 'you can now see this secret message!';
  // })

  getAll: publicProcedure.query(async ({ ctx }) => {
    const components = await ctx.prisma.component.findMany();
    // Randomize the order of the components
    return components.sort(() => Math.random() - 0.5);
  })
});
