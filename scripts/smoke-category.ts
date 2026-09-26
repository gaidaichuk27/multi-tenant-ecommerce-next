/**
 * Focused category.* + post category filter smoke via createCaller
 * (avoids full appRouter → mail → SVG).
 *
 * Coverage:
 *   - admin can create categories (cap at 10)
 *   - member can list categories
 *   - case-insensitive duplicate name rejected
 *   - update rename + reorder (true permutation; dup ids rejected)
 *   - post.create with categoryId; post.update reassign/clear
 *   - post.list with/without categoryId
 *   - delete category → posts.categoryId SetNull
 *   - non-admin cannot create category
 *   - wrong-group categoryId rejected on create/list
 *
 * Usage (from repo root):
 *   pnpm smoke:feed:categories
 *
 * Requires an active plain member + admin|owner in the same group.
 */
import assert from 'node:assert/strict';
import { TRPCError } from '@trpc/server';
import { db } from '@repo/database';
import type { User } from '@entities/User';
import { createCallerFactory, createTRPCRouter } from '../src/TRPC/init';
import { categoryRouter } from '../src/TRPC/routers/category';
import { postRouter } from '../src/TRPC/routers/post';

const createCaller = createCallerFactory(
    createTRPCRouter({ category: categoryRouter, post: postRouter }),
);

const ADMIN_ROLES = ['admin', 'owner'] as const;

function toAppUser(row: {
    id: string;
    email: string;
    username: string;
    name: string | null;
    avatarUrl: string | null;
    roles: string[];
    isEmailConfirmed: boolean;
    createdAt: Date;
    updatedAt: Date;
}): User {
    return {
        id: row.id,
        email: row.email,
        username: row.username,
        name: row.name,
        avatarUrl: row.avatarUrl,
        roles: row.roles.map((role) =>
            role === 'super_admin' ? 'super-admin' : 'user',
        ),
        isEmailConfirmed: row.isEmailConfirmed,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    };
}

function callerFor(user: Parameters<typeof toAppUser>[0]) {
    return createCaller({
        userId: user.id,
        user: toAppUser(user),
        headers: new Headers(),
    });
}

async function assertCode(
    action: () => Promise<unknown>,
    code: TRPCError['code'],
) {
    await assert.rejects(action, (err: unknown) => {
        assert.ok(err instanceof TRPCError);
        assert.equal(err.code, code);
        return true;
    });
}

async function main() {
    console.log('smoke: category.* + post category filter');

    const candidates = await db.groupMembership.findMany({
        where: { status: 'active', role: 'member' },
        include: {
            group: { select: { id: true, slug: true } },
            user: true,
        },
        orderBy: { joinedAt: 'asc' },
        take: 40,
    });
    assert.ok(candidates.length > 0, 'expected an active plain member');

    let member: (typeof candidates)[number] | null = null;
    let admin: {
        user: (typeof candidates)[number]['user'];
        userId: string;
    } | null = null;

    for (const candidate of candidates) {
        const adminMembership = await db.groupMembership.findFirst({
            where: {
                status: 'active',
                groupId: candidate.group.id,
                role: { in: [...ADMIN_ROLES] },
            },
            include: { user: true },
            orderBy: { joinedAt: 'asc' },
        });

        if (adminMembership) {
            member = candidate;
            admin = adminMembership;
            break;
        }
    }

    assert.ok(
        member && admin,
        'expected a group with an active plain member and admin|owner',
    );

    const { group } = member;
    const memberCaller = callerFor(member.user);
    const adminCaller = callerFor(admin.user);

    const categoryIds: string[] = [];
    const postIds: string[] = [];
    const stamp = Date.now();

    try {
        // --- non-admin cannot create ---
        await assertCode(
            () =>
                memberCaller.category.create({
                    slug: group.slug,
                    name: `[smoke] forbidden ${stamp}`,
                }),
            'FORBIDDEN',
        );

        // --- admin create ---
        const created = await adminCaller.category.create({
            slug: group.slug,
            name: `[smoke] Cat ${stamp}`,
        });
        categoryIds.push(created.id);
        assert.equal(created.name, `[smoke] Cat ${stamp}`);
        assert.equal(created.groupId, group.id);

        // --- case-insensitive duplicate ---
        await assertCode(
            () =>
                adminCaller.category.create({
                    slug: group.slug,
                    name: `[SMOKE] CAT ${stamp}`,
                }),
            'CONFLICT',
        );

        // --- second category for reorder ---
        const second = await adminCaller.category.create({
            slug: group.slug,
            name: `[smoke] other ${stamp}`,
        });
        categoryIds.push(second.id);

        // --- reorder: duplicate ids rejected ---
        await assertCode(
            () =>
                adminCaller.category.reorder({
                    slug: group.slug,
                    orderedIds: [created.id, created.id],
                }),
            'BAD_REQUEST',
        );

        // --- reorder: swap only smoke categories in place (don't reshuffle others) ---
        const beforeReorder = await adminCaller.category.list({
            slug: group.slug,
        });
        const ids = beforeReorder.map((c) => c.id);
        const iCreated = ids.indexOf(created.id);
        const iSecond = ids.indexOf(second.id);
        assert.ok(iCreated >= 0 && iSecond >= 0, 'smoke categories present');

        const swapped = [...ids];
        swapped[iCreated] = second.id;
        swapped[iSecond] = created.id;

        const reordered = await adminCaller.category.reorder({
            slug: group.slug,
            orderedIds: swapped,
        });
        const afterIds = reordered.map((c) => c.id);
        assert.equal(afterIds[iCreated], second.id);
        assert.equal(afterIds[iSecond], created.id);
        for (let i = 0; i < afterIds.length; i++) {
            if (i === iCreated || i === iSecond) continue;
            assert.equal(
                afterIds[i],
                ids[i],
                `non-smoke category at index ${i} must stay put`,
            );
        }

        // --- update rename ---
        const renamed = await adminCaller.category.update({
            slug: group.slug,
            categoryId: created.id,
            name: `[smoke] renamed ${stamp}`,
        });
        assert.equal(renamed.name, `[smoke] renamed ${stamp}`);

        // --- member list ---
        const listed = await memberCaller.category.list({ slug: group.slug });
        assert.ok(
            listed.some((item) => item.id === created.id),
            'member list should include the category',
        );

        // --- post.create with category ---
        const withCat = await memberCaller.post.create({
            slug: group.slug,
            body: '[smoke] categorized post',
            categoryId: created.id,
        });
        postIds.push(withCat.id);
        assert.equal(withCat.categoryId, created.id);

        // --- post.update reassign ---
        const reassigned = await memberCaller.post.update({
            slug: group.slug,
            postId: withCat.id,
            body: '[smoke] categorized post',
            categoryId: second.id,
        });
        assert.equal(reassigned.categoryId, second.id);

        // --- post.update clear ---
        const cleared = await memberCaller.post.update({
            slug: group.slug,
            postId: withCat.id,
            body: '[smoke] categorized post',
            categoryId: null,
        });
        assert.equal(cleared.categoryId, null);

        // re-attach for delete→SetNull check
        await memberCaller.post.update({
            slug: group.slug,
            postId: withCat.id,
            body: '[smoke] categorized post',
            categoryId: created.id,
        });

        const uncategorized = await memberCaller.post.create({
            slug: group.slug,
            body: '[smoke] uncategorized post',
        });
        postIds.push(uncategorized.id);
        assert.equal(uncategorized.categoryId, null);

        // --- post.list without filter includes both ---
        const allPage = await memberCaller.post.list({
            slug: group.slug,
            limit: 50,
        });
        assert.ok(allPage.items.some((p) => p.id === withCat.id));
        assert.ok(allPage.items.some((p) => p.id === uncategorized.id));

        // --- post.list with categoryId filters ---
        const filtered = await memberCaller.post.list({
            slug: group.slug,
            categoryId: created.id,
            limit: 50,
        });
        assert.ok(filtered.items.some((p) => p.id === withCat.id));
        assert.ok(!filtered.items.some((p) => p.id === uncategorized.id));

        // --- delete category → SetNull on posts ---
        await adminCaller.category.delete({
            slug: group.slug,
            categoryId: created.id,
        });
        categoryIds.splice(categoryIds.indexOf(created.id), 1);
        const afterDelete = await db.post.findUniqueOrThrow({
            where: { id: withCat.id },
        });
        assert.equal(afterDelete.categoryId, null);

        // --- wrong-group categoryId rejected ---
        const otherGroup = await db.group.findFirst({
            where: { id: { not: group.id } },
            select: { id: true },
        });
        if (otherGroup) {
            const foreign = await db.category.create({
                data: {
                    groupId: otherGroup.id,
                    name: `[smoke] foreign ${stamp}`,
                    nameNormalized: `[smoke] foreign ${stamp}`.toLowerCase(),
                    sortOrder: 0,
                },
            });
            categoryIds.push(foreign.id);

            await assertCode(
                () =>
                    memberCaller.post.create({
                        slug: group.slug,
                        body: '[smoke] wrong category',
                        categoryId: foreign.id,
                    }),
                'NOT_FOUND',
            );
            await assertCode(
                () =>
                    memberCaller.post.list({
                        slug: group.slug,
                        categoryId: foreign.id,
                    }),
                'NOT_FOUND',
            );
        }

        // --- cap at 10 ---
        const existingCount = await db.category.count({
            where: { groupId: group.id },
        });
        const toCreate = Math.max(0, 10 - existingCount);
        for (let i = 0; i < toCreate; i++) {
            const cat = await adminCaller.category.create({
                slug: group.slug,
                name: `[smoke] fill ${stamp}-${i}`,
            });
            categoryIds.push(cat.id);
        }
        await assertCode(
            () =>
                adminCaller.category.create({
                    slug: group.slug,
                    name: `[smoke] overflow ${stamp}`,
                }),
            'BAD_REQUEST',
        );

        console.log(
            `ok: group "${group.slug}" member=${member.user.email} admin=${admin.user.email}`,
        );
        console.log('\nPASS');
    } finally {
        for (const id of postIds) {
            await db.post.delete({ where: { id } }).catch(() => {});
        }
        for (const id of categoryIds) {
            await db.category.delete({ where: { id } }).catch(() => {});
        }
        await db.$disconnect();
    }
}

main().catch((err) => {
    console.error('\nFAIL', err);
    process.exitCode = 1;
    void db.$disconnect();
});
