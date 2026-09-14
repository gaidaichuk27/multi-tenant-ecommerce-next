import { createTRPCRouter } from '../init';
import { authRouter } from './auth';
import { greetingRouter } from './greeting';
import { groupRouter } from './group';
import { membershipRouter } from './membership';
import { usersRouter } from './users';

export const appRouter = createTRPCRouter({
    auth: authRouter,
    greeting: greetingRouter,
    group: groupRouter,
    membership: membershipRouter,
    users: usersRouter,
});

export type AppRouter = typeof appRouter;
