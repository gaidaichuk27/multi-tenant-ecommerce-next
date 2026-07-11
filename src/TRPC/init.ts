import { TRPCError, initTRPC } from '@trpc/server';
import type { User } from '@entities/User';
import { getAuthSession } from '@lib/auth/session';

export type TRPCContext = {
    userId: string | null;
    user: User | null;
    headers: Headers;
};

export async function createTRPCContext(opts: {
    headers: Headers;
}): Promise<TRPCContext> {
    const session = await getAuthSession(opts.headers);

    return {
        userId: session?.user.id ?? null,
        user: session?.user ?? null,
        headers: opts.headers,
    };
}

const t = initTRPC.context<TRPCContext>().create();

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.userId || !ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return next({
        ctx: {
            ...ctx,
            userId: ctx.userId,
            user: ctx.user,
        },
    });
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;
export const baseProcedure = publicProcedure;
export const protectedProcedure = publicProcedure.use(enforceUserIsAuthed);
