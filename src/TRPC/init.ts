import { TRPCError, initTRPC } from '@trpc/server';
import type {
    Group,
    GroupMembership,
    GroupMembershipRole,
} from '@repo/database';
import { db } from '@repo/database';
import {
    GROUP_T_MESSAGES,
    MEMBERSHIP_T_MESSAGES,
    groupSlugInputSchema,
} from '@repo/api';
import type { User } from '@entities/User';
import { getAuthSession } from '@lib/auth/session';

export type TRPCContext = {
    userId: string | null;
    user: User | null;
    headers: Headers;
};

export type AuthenticatedTRPCContext = {
    userId: string;
    user: User;
    headers: Headers;
};

export type GroupTRPCContext = AuthenticatedTRPCContext & {
    group: Group;
    membership: GroupMembership | null;
};

export type GroupMemberTRPCContext = AuthenticatedTRPCContext & {
    group: Group;
    membership: GroupMembership;
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
    const { userId, user } = ctx;

    if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return next({
        ctx: {
            headers: ctx.headers,
            userId,
            user,
        },
    });
});

async function parseGroupSlugFromRawInput(getRawInput: () => Promise<unknown>) {
    const rawInput = await getRawInput();
    const parsed = groupSlugInputSchema.safeParse(rawInput);

    if (!parsed.success) {
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message: MEMBERSHIP_T_MESSAGES.SLUG_REQUIRED,
        });
    }

    return parsed.data.slug;
}

async function loadGroupAndMembership(userId: string, slug: string) {
    const group = await db.group.findUnique({
        where: { slug },
    });

    if (!group) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: GROUP_T_MESSAGES.NOT_FOUND,
        });
    }

    const membership = await db.groupMembership.findUnique({
        where: {
            groupId_userId: {
                groupId: group.id,
                userId,
            },
        },
    });

    if (group.visibility === 'hidden') {
        const isActiveMember = membership?.status === 'active';

        if (!isActiveMember) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: GROUP_T_MESSAGES.NOT_FOUND,
            });
        }
    }

    return { group, membership };
}

const enforceGroupContext = t.middleware(async ({ ctx, next, getRawInput }) => {
    const { userId, user } = ctx;

    if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const slug = await parseGroupSlugFromRawInput(getRawInput);
    const { group, membership } = await loadGroupAndMembership(userId, slug);

    return next({
        ctx: {
            headers: ctx.headers,
            userId,
            user,
            group,
            membership,
        },
    });
});

function hasMinRole(
    role: GroupMembershipRole,
    allowed: readonly GroupMembershipRole[],
) {
    return allowed.includes(role);
}

const MEMBER_ROLES = [
    'member',
    'moderator',
    'admin',
    'owner',
] as const satisfies readonly GroupMembershipRole[];

const MODERATOR_ROLES = [
    'moderator',
    'admin',
    'owner',
] as const satisfies readonly GroupMembershipRole[];

const ADMIN_ROLES = [
    'admin',
    'owner',
] as const satisfies readonly GroupMembershipRole[];

const OWNER_ROLES = ['owner'] as const satisfies readonly GroupMembershipRole[];
function enforceActiveMembershipWithRoles(
    allowedRoles: readonly GroupMembershipRole[],
) {
    return t.middleware(({ ctx, next }) => {
        const groupCtx = ctx as GroupTRPCContext;
        const { membership } = groupCtx;

        if (!membership || membership.status !== 'active') {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: MEMBERSHIP_T_MESSAGES.FORBIDDEN,
            });
        }

        if (!hasMinRole(membership.role, allowedRoles)) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: MEMBERSHIP_T_MESSAGES.FORBIDDEN,
            });
        }

        return next({
            ctx: {
                headers: groupCtx.headers,
                userId: groupCtx.userId,
                user: groupCtx.user,
                group: groupCtx.group,
                membership,
            },
        });
    });
}

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;
export const baseProcedure = publicProcedure;
export const protectedProcedure = publicProcedure.use(enforceUserIsAuthed);

export const verifiedEmailProcedure = protectedProcedure.use(
    ({ ctx, next }) => {
        if (!ctx.user.isEmailConfirmed) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'auth.email.not_confirmed',
            });
        }

        return next({ ctx });
    },
);

/** Authed + group resolved from input.slug. Hidden groups require active membership. */
export const groupProcedure = protectedProcedure.use(enforceGroupContext);

/** Active membership required. */
export const groupMemberProcedure = groupProcedure.use(
    enforceActiveMembershipWithRoles(MEMBER_ROLES),
);

export const groupModeratorProcedure = groupProcedure.use(
    enforceActiveMembershipWithRoles(MODERATOR_ROLES),
);

export const groupAdminProcedure = groupProcedure.use(
    enforceActiveMembershipWithRoles(ADMIN_ROLES),
);

export const groupOwnerProcedure = groupProcedure.use(
    enforceActiveMembershipWithRoles(OWNER_ROLES),
);
