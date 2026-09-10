import { TRPCError } from '@trpc/server';
import { db } from '@repo/database';
import {
    GROUP_T_MESSAGES,
    createGroupInputSchema,
    getGroupBySlugInputSchema,
    serializeGroup,
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
