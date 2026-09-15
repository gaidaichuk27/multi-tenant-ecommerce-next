import { TRPCError } from '@trpc/server';
import { db } from '@repo/database';
import {
    GROUP_T_MESSAGES,
    createGroupInputSchema,
    getGroupBySlugInputSchema,
    groupSlugInputSchema,
    serializeGroup,
    serializeMembership,
} from '@repo/api';
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
    verifiedEmailProcedure,
} from '../init';

export const groupRouter = createTRPCRouter({
    create: verifiedEmailProcedure
        .input(createGroupInputSchema)
        .mutation(async ({ ctx, input }) => {
            const existingGroup = await db.group.findUnique({
                where: { slug: input.slug },
            });

            if (existingGroup) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: GROUP_T_MESSAGES.SLUG_TAKEN,
                });
            }

            const group = await db.$transaction(async (tx) => {
                const createdGroup = await tx.group.create({
                    data: {
                        slug: input.slug,
                        name: input.name,
                        description: input.description,
                        visibility: input.visibility ?? 'public',
                        ownerId: ctx.userId,
                    },
                });

                await tx.groupSettings.create({
                    data: { groupId: createdGroup.id },
                });

                await tx.groupMembership.create({
                    data: {
                        groupId: createdGroup.id,
                        userId: ctx.userId,
                        role: 'owner',
                        status: 'active',
                    },
                });

                return createdGroup;
            });

            return serializeGroup(group);
        }),

    getBySlug: publicProcedure
        .input(getGroupBySlugInputSchema)
        .query(async ({ input }) => {
            const group = await db.group.findUnique({
                where: { slug: input.slug },
            });

            if (!group) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: GROUP_T_MESSAGES.NOT_FOUND,
                });
            }

            if (group.visibility === 'hidden') {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: GROUP_T_MESSAGES.NOT_FOUND,
                });
            }

            return serializeGroup(group);
        }),

    /**
     * Public about-page payload: group metadata, active member count,
     * and the viewer's membership when a session is present.
     */
    getPublic: publicProcedure
        .input(groupSlugInputSchema)
        .query(async ({ ctx, input }) => {
            const group = await db.group.findUnique({
                where: { slug: input.slug },
            });

            if (!group) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: GROUP_T_MESSAGES.NOT_FOUND,
                });
            }

            if (group.visibility === 'hidden') {
                if (!ctx.userId) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: GROUP_T_MESSAGES.NOT_FOUND,
                    });
                }

                const viewer = await db.groupMembership.findUnique({
                    where: {
                        groupId_userId: {
                            groupId: group.id,
                            userId: ctx.userId,
                        },
                    },
                });

                if (!viewer || viewer.status !== 'active') {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: GROUP_T_MESSAGES.NOT_FOUND,
                    });
                }
            }

            const [memberCount, viewerMembership] = await Promise.all([
                db.groupMembership.count({
                    where: {
                        groupId: group.id,
                        status: 'active',
                    },
                }),
                ctx.userId
                    ? db.groupMembership.findUnique({
                          where: {
                              groupId_userId: {
                                  groupId: group.id,
                                  userId: ctx.userId,
                              },
                          },
                      })
                    : Promise.resolve(null),
            ]);

            return {
                group: serializeGroup(group),
                memberCount,
                viewerMembership: viewerMembership
                    ? serializeMembership(viewerMembership)
                    : null,
            };
        }),

    /**
     * Smoke / helper: viewer's membership for a group, or null.
     * Resolves group by slug (never by client groupId).
     */
    getMineMembership: protectedProcedure
        .input(groupSlugInputSchema)
        .query(async ({ ctx, input }) => {
            const group = await db.group.findUnique({
                where: { slug: input.slug },
            });

            if (!group) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: GROUP_T_MESSAGES.NOT_FOUND,
                });
            }

            if (group.visibility === 'hidden') {
                const membership = await db.groupMembership.findUnique({
                    where: {
                        groupId_userId: {
                            groupId: group.id,
                            userId: ctx.userId,
                        },
                    },
                });

                if (!membership || membership.status !== 'active') {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: GROUP_T_MESSAGES.NOT_FOUND,
                    });
                }

                return serializeMembership(membership);
            }

            const membership = await db.groupMembership.findUnique({
                where: {
                    groupId_userId: {
                        groupId: group.id,
                        userId: ctx.userId,
                    },
                },
            });

            return membership ? serializeMembership(membership) : null;
        }),

    listMine: protectedProcedure.query(async ({ ctx }) => {
        const memberships = await db.groupMembership.findMany({
            where: {
                userId: ctx.userId,
                status: 'active',
            },
            include: { group: true },
            orderBy: { joinedAt: 'desc' },
        });

        return memberships.map((membership) => ({
            ...serializeGroup(membership.group),
            role: membership.role,
        }));
    }),
});
