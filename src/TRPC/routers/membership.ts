import { TRPCError } from '@trpc/server';
import { db } from '@repo/database';
import {
    GROUP_T_MESSAGES,
    MEMBERSHIP_T_MESSAGES,
    groupSlugInputSchema,
    membershipCursorInputSchema,
    membershipTargetInputSchema,
    membershipUpdateRoleInputSchema,
    serializeMembership,
} from '@repo/api';
import {
    createTRPCRouter,
    groupAdminProcedure,
    groupMemberProcedure,
    groupOwnerProcedure,
    verifiedEmailProcedure,
} from '../init';

const MEMBER_USER_SELECT = {
    id: true,
    username: true,
    name: true,
    avatarUrl: true,
} as const;

async function findGroupBySlugOrThrow(slug: string) {
    const group = await db.group.findUnique({ where: { slug } });

    if (!group) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: GROUP_T_MESSAGES.NOT_FOUND,
        });
    }

    return group;
}

async function listMembershipsByStatus(opts: {
    groupId: string;
    status: 'active' | 'pending';
    cursor?: string;
    limit: number;
}) {
    const limit = opts.limit;
    const rows = await db.groupMembership.findMany({
        where: {
            groupId: opts.groupId,
            status: opts.status,
        },
        include: { user: { select: MEMBER_USER_SELECT } },
        orderBy: [{ joinedAt: 'desc' }, { id: 'desc' }],
        take: limit + 1,
        ...(opts.cursor
            ? {
                  cursor: { id: opts.cursor },
                  skip: 1,
              }
            : {}),
    });

    let nextCursor: string | null = null;
    const page = rows.length > limit ? rows.slice(0, limit) : rows;

    if (rows.length > limit) {
        nextCursor = page[page.length - 1]?.id ?? null;
    }

    return {
        items: page.map((row) => serializeMembership(row)),
        nextCursor,
    };
}

export const membershipRouter = createTRPCRouter({
    requestJoin: verifiedEmailProcedure
        .input(groupSlugInputSchema)
        .mutation(async ({ ctx, input }) => {
            const group = await findGroupBySlugOrThrow(input.slug);

            if (group.visibility === 'hidden') {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: GROUP_T_MESSAGES.NOT_FOUND,
                });
            }

            const existing = await db.groupMembership.findUnique({
                where: {
                    groupId_userId: {
                        groupId: group.id,
                        userId: ctx.userId,
                    },
                },
            });

            if (existing?.status === 'banned') {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: MEMBERSHIP_T_MESSAGES.BANNED,
                });
            }

            if (existing?.status === 'active') {
                return serializeMembership(existing);
            }

            if (existing?.status === 'pending') {
                return serializeMembership(existing);
            }

            const status =
                group.visibility === 'private' ? 'pending' : 'active';

            const membership = await db.groupMembership.create({
                data: {
                    groupId: group.id,
                    userId: ctx.userId,
                    role: 'member',
                    status,
                },
            });

            return serializeMembership(membership);
        }),

    leave: groupMemberProcedure
        .input(groupSlugInputSchema)
        .mutation(async ({ ctx }) => {
            if (ctx.membership.role === 'owner') {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: MEMBERSHIP_T_MESSAGES.OWNER_CANNOT_LEAVE,
                });
            }

            await db.groupMembership.delete({
                where: { id: ctx.membership.id },
            });

            return { success: true as const };
        }),

    listMembers: groupMemberProcedure
        .input(membershipCursorInputSchema)
        .query(async ({ ctx, input }) => {
            return listMembershipsByStatus({
                groupId: ctx.group.id,
                status: 'active',
                cursor: input.cursor,
                limit: input.limit,
            });
        }),

    listPending: groupAdminProcedure
        .input(membershipCursorInputSchema)
        .query(async ({ ctx, input }) => {
            return listMembershipsByStatus({
                groupId: ctx.group.id,
                status: 'pending',
                cursor: input.cursor,
                limit: input.limit,
            });
        }),

    approve: groupAdminProcedure
        .input(membershipTargetInputSchema)
        .mutation(async ({ ctx, input }) => {
            const membership = await db.groupMembership.findUnique({
                where: {
                    groupId_userId: {
                        groupId: ctx.group.id,
                        userId: input.userId,
                    },
                },
            });

            if (!membership || membership.status !== 'pending') {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: MEMBERSHIP_T_MESSAGES.NOT_FOUND,
                });
            }

            const updated = await db.groupMembership.update({
                where: { id: membership.id },
                data: {
                    status: 'active',
                    joinedAt: new Date(),
                },
                include: { user: { select: MEMBER_USER_SELECT } },
            });

            return serializeMembership(updated);
        }),

    decline: groupAdminProcedure
        .input(membershipTargetInputSchema)
        .mutation(async ({ ctx, input }) => {
            const membership = await db.groupMembership.findUnique({
                where: {
                    groupId_userId: {
                        groupId: ctx.group.id,
                        userId: input.userId,
                    },
                },
            });

            if (!membership || membership.status !== 'pending') {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: MEMBERSHIP_T_MESSAGES.NOT_FOUND,
                });
            }

            await db.groupMembership.delete({
                where: { id: membership.id },
            });

            return { success: true as const };
        }),

    updateRole: groupOwnerProcedure
        .input(membershipUpdateRoleInputSchema)
        .mutation(async ({ ctx, input }) => {
            if (input.userId === ctx.userId && input.role !== 'owner') {
                const ownerCount = await db.groupMembership.count({
                    where: {
                        groupId: ctx.group.id,
                        role: 'owner',
                        status: 'active',
                    },
                });

                if (ownerCount <= 1) {
                    throw new TRPCError({
                        code: 'FORBIDDEN',
                        message: MEMBERSHIP_T_MESSAGES.LAST_OWNER,
                    });
                }
            }

            const membership = await db.groupMembership.findUnique({
                where: {
                    groupId_userId: {
                        groupId: ctx.group.id,
                        userId: input.userId,
                    },
                },
            });

            if (!membership || membership.status !== 'active') {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: MEMBERSHIP_T_MESSAGES.NOT_FOUND,
                });
            }

            if (
                membership.role === 'owner' &&
                input.role !== 'owner' &&
                input.userId !== ctx.userId
            ) {
                const ownerCount = await db.groupMembership.count({
                    where: {
                        groupId: ctx.group.id,
                        role: 'owner',
                        status: 'active',
                    },
                });

                if (ownerCount <= 1) {
                    throw new TRPCError({
                        code: 'FORBIDDEN',
                        message: MEMBERSHIP_T_MESSAGES.LAST_OWNER,
                    });
                }
            }

            const updated = await db.groupMembership.update({
                where: { id: membership.id },
                data: { role: input.role },
                include: { user: { select: MEMBER_USER_SELECT } },
            });

            return serializeMembership(updated);
        }),

    ban: groupAdminProcedure
        .input(membershipTargetInputSchema)
        .mutation(async ({ ctx, input }) => {
            if (input.userId === ctx.userId) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: MEMBERSHIP_T_MESSAGES.FORBIDDEN,
                });
            }

            const membership = await db.groupMembership.findUnique({
                where: {
                    groupId_userId: {
                        groupId: ctx.group.id,
                        userId: input.userId,
                    },
                },
            });

            if (!membership) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: MEMBERSHIP_T_MESSAGES.NOT_FOUND,
                });
            }

            if (membership.role === 'owner') {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: MEMBERSHIP_T_MESSAGES.OWNER_CANNOT_BAN,
                });
            }

            const updated = await db.groupMembership.update({
                where: { id: membership.id },
                data: { status: 'banned', role: 'member' },
                include: { user: { select: MEMBER_USER_SELECT } },
            });

            return serializeMembership(updated);
        }),
});
