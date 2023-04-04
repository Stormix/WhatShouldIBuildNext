import { componentRouter } from '@/server/api/routers/components';
import { createTRPCRouter } from '@/server/api/trpc';
import { ideasRouter } from './routers/ideas';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  components: componentRouter,
  ideas: ideasRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
