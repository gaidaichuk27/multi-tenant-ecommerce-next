import { TRPCError } from '@trpc/server';
import { db, isPrismaUniqueConstraintError, type Prisma } from '@repo/database';
import {
    CATEGORY_MAX_PER_GROUP,
    CATEGORY_PERMISSIONS_ALL_MEMBERS,
    CATEGORY_T_MESSAGES,
    categoryCreateInputSchema,
    categoryDeleteInputSchema,
    categoryListInputSchema,
    categoryReorderInputSchema,
    categoryUpdateInputSchema,
    normalizeCategoryName,
    serializeCategory,
} from '@repo/api';
import {
    createTRPCRouter,
    groupAdminProcedure,
    groupMemberProcedure,
} from '../init';

/** Serialize all category writes for a group (create / update / delete / reorder). */
async function lockGroupForCategoryWrite(
    tx: Prisma.TransactionClient,
    groupId: string,
) {
    await tx.$executeRaw`
        SELECT id FROM "groups" WHERE id = ${groupId} FOR UPDATE
    `;
}

async function findCategoryInGroupOrThrow(
    tx: Prisma.TransactionClient | typeof db,
    groupId: string,
    categoryId: string,
) {
    const category = await tx.category.findFirst({
        where: { id: categoryId, groupId },
    });

    if (!category) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: CATEGORY_T_MESSAGES.NOT_FOUND,
        });
    }

    return category;
}

/**
 * True when `orderedIds` is a permutation of `existingIds`
 * (same size, no duplicates, every existing id present).
 */
function isIdPermutation(orderedIds: string[], existingIds: Set<string>) {
    const orderedSet = new Set(orderedIds);

    return (
        orderedSet.size === orderedIds.length &&
        orderedSet.size === existingIds.size &&
        [...existingIds].every((id) => orderedSet.has(id))
    );
}

export const categoryRouter = createTRPCRouter({
    list: groupMemberProcedure
        .input(categoryListInputSchema)
        .query(async ({ ctx }) => {
            const rows = await db.category.findMany({
                where: { groupId: ctx.group.id },
                orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
            });

            return rows.map(serializeCategory);
        }),

    create: groupAdminProcedure
        .input(categoryCreateInputSchema)
        .mutation(async ({ ctx, input }) => {
            const nameNormalized = normalizeCategoryName(input.name);

            try {
                const category = await db.$transaction(async (tx) => {
                    await lockGroupForCategoryWrite(tx, ctx.group.id);

                    const count = await tx.category.count({
                        where: { groupId: ctx.group.id },
                    });

                    if (count >= CATEGORY_MAX_PER_GROUP) {
                        throw new TRPCError({
                            code: 'BAD_REQUEST',
                            message: CATEGORY_T_MESSAGES.MAX_REACHED,
                        });
                    }

                    const existing = await tx.category.findFirst({
                        where: {
                            groupId: ctx.group.id,
                            nameNormalized,
                        },
                        select: { id: true },
                    });

                    if (existing) {
                        throw new TRPCError({
                            code: 'CONFLICT',
                            message: CATEGORY_T_MESSAGES.NAME_TAKEN,
                        });
                    }

                    const maxSort = await tx.category.aggregate({
                        where: { groupId: ctx.group.id },
                        _max: { sortOrder: true },
                    });
                    const sortOrder = (maxSort._max.sortOrder ?? -1) + 1;

                    return tx.category.create({
                        data: {
                            groupId: ctx.group.id,
                            name: input.name,
                            nameNormalized,
                            sortOrder,
                            permissions: CATEGORY_PERMISSIONS_ALL_MEMBERS,
                        },
                    });
                });

                return serializeCategory(category);
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error;
                }

                if (isPrismaUniqueConstraintError(error)) {
                    throw new TRPCError({
                        code: 'CONFLICT',
                        message: CATEGORY_T_MESSAGES.NAME_TAKEN,
                    });
                }

                throw error;
            }
        }),

    update: groupAdminProcedure
        .input(categoryUpdateInputSchema)
        .mutation(async ({ ctx, input }) => {
            const nameNormalized = normalizeCategoryName(input.name);

            try {
                const category = await db.$transaction(async (tx) => {
                    await lockGroupForCategoryWrite(tx, ctx.group.id);
                    await findCategoryInGroupOrThrow(
                        tx,
                        ctx.group.id,
                        input.categoryId,
                    );

                    const duplicate = await tx.category.findFirst({
                        where: {
                            groupId: ctx.group.id,
                            nameNormalized,
                            id: { not: input.categoryId },
                        },
                        select: { id: true },
                    });

                    if (duplicate) {
                        throw new TRPCError({
                            code: 'CONFLICT',
                            message: CATEGORY_T_MESSAGES.NAME_TAKEN,
                        });
                    }

                    return tx.category.update({
                        where: { id: input.categoryId },
                        data: {
                            name: input.name,
                            nameNormalized,
                        },
                    });
                });

                return serializeCategory(category);
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error;
                }

                if (isPrismaUniqueConstraintError(error)) {
                    throw new TRPCError({
                        code: 'CONFLICT',
                        message: CATEGORY_T_MESSAGES.NAME_TAKEN,
                    });
                }

                throw error;
            }
        }),

    delete: groupAdminProcedure
        .input(categoryDeleteInputSchema)
        .mutation(async ({ ctx, input }) => {
            await db.$transaction(async (tx) => {
                await lockGroupForCategoryWrite(tx, ctx.group.id);
                await findCategoryInGroupOrThrow(
                    tx,
                    ctx.group.id,
                    input.categoryId,
                );

                await tx.category.delete({
                    where: { id: input.categoryId },
                });
            });

            return { success: true as const };
        }),

    reorder: groupAdminProcedure
        .input(categoryReorderInputSchema)
        .mutation(async ({ ctx, input }) => {
            const rows = await db.$transaction(async (tx) => {
                await lockGroupForCategoryWrite(tx, ctx.group.id);

                const existing = await tx.category.findMany({
                    where: { groupId: ctx.group.id },
                    select: { id: true },
                });
                const existingIds = new Set(existing.map((row) => row.id));

                if (!isIdPermutation(input.orderedIds, existingIds)) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: CATEGORY_T_MESSAGES.REORDER_INVALID,
                    });
                }

                for (const [index, id] of input.orderedIds.entries()) {
                    await tx.category.update({
                        where: { id },
                        data: { sortOrder: index },
                    });
                }

                return tx.category.findMany({
                    where: { groupId: ctx.group.id },
                    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
                });
            });

            return rows.map(serializeCategory);
        }),
});
