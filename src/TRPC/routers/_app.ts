import { createTRPCRouter } from '../init';
import { greetingRouter } from './greeting';
import { usersRouter } from './users';

export const appRouter = createTRPCRouter({
    greeting: greetingRouter,
    users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
