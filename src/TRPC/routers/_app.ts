import { createTRPCRouter } from '../init';
import { authRouter } from './auth';
import { commentRouter } from './comment';
import { greetingRouter } from './greeting';
import { groupRouter } from './group';
import { membershipRouter } from './membership';
import { postRouter } from './post';
import { usersRouter } from './users';

export const appRouter = createTRPCRouter({
    auth: authRouter,
    comment: commentRouter,
    greeting: greetingRouter,
    group: groupRouter,
    membership: membershipRouter,
    post: postRouter,
    users: usersRouter,
});

export type AppRouter = typeof appRouter;
