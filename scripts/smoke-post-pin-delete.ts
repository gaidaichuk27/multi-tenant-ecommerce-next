/**
 * Focused post.pin / post.delete smoke via createCaller
 * (avoids full appRouter → mail → SVG).
 *
 * Coverage:
 *   - member cannot pin
 *   - mod can pin / unpin
 *   - author can delete own post
 *   - unrelated member cannot delete
 *   - mod can delete others' posts
 *
 * Usage (from repo root):
 *   pnpm smoke:feed:pin-delete
 *
 * Requires at least one active plain member AND one moderator|admin|owner
 * in the same group. Without a mod, pin/mod-delete cases are skipped with a note
 * (seed or promote a membership for full coverage in CI).
 */
import assert from 'node:assert/strict';
import { TRPCError } from '@trpc/server';
import { db } from '@repo/database';
import type { User } from '@entities/User';
import { createCallerFactory, createTRPCRouter } from '../src/TRPC/init';
import { postRouter } from '../src/TRPC/routers/post';

const createCaller = createCallerFactory(
    createTRPCRouter({ post: postRouter }),
);

const MOD_ROLES = ['moderator', 'admin', 'owner'] as const;

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

async function assertForbidden(action: () => Promise<unknown>) {
    await assert.rejects(action, (err: unknown) => {
        assert.ok(err instanceof TRPCError);
        assert.equal(err.code, 'FORBIDDEN');
        return true;
    });
}

async function main() {
    console.log('smoke: post.pin + post.delete');

    const member = await db.groupMembership.findFirst({
        where: { status: 'active', role: 'member' },
        include: {
            group: { select: { id: true, slug: true } },
            user: true,
        },
        orderBy: { joinedAt: 'asc' },
    });
    assert.ok(member, 'expected an active plain member');

    const { group } = member;
    const memberCaller = callerFor(member.user);

    const mod = await db.groupMembership.findFirst({
        where: {
            status: 'active',
            groupId: group.id,
            role: { in: [...MOD_ROLES] },
        },
        include: { user: true },
        orderBy: { joinedAt: 'asc' },
    });

    const otherMember = await db.groupMembership.findFirst({
        where: {
            status: 'active',
            groupId: group.id,
            userId: { not: member.userId },
            role: 'member',
        },
        include: { user: true },
        orderBy: { joinedAt: 'asc' },
    });

    const postIds: string[] = [];

    try {
        // --- member cannot pin ---
        const authored = await memberCaller.post.create({
            slug: group.slug,
            body: '[smoke] pin-delete authored',
        });
        postIds.push(authored.id);
        assert.equal(authored.pinned, false);

        await assertForbidden(() =>
            memberCaller.post.pin({
                slug: group.slug,
                postId: authored.id,
            }),
        );

        if (mod) {
            const modCaller = callerFor(mod.user);

            // --- mod can pin / unpin ---
            const pinned = await modCaller.post.pin({
                slug: group.slug,
                postId: authored.id,
            });
            assert.equal(pinned.pinned, true);

            const gotPinned = await memberCaller.post.get({
                slug: group.slug,
                postId: authored.id,
            });
            assert.equal(gotPinned.pinned, true);

            const unpinned = await modCaller.post.pin({
                slug: group.slug,
                postId: authored.id,
            });
            assert.equal(unpinned.pinned, false);

            // --- unrelated member cannot delete ---
            if (otherMember) {
                const otherCaller = callerFor(otherMember.user);
                await assertForbidden(() =>
                    otherCaller.post.delete({
                        slug: group.slug,
                        postId: authored.id,
                    }),
                );
            } else {
                console.log(
                    '(skip unrelated-member delete forbid: no second plain member)',
                );
            }

            // --- author can delete own ---
            await memberCaller.post.delete({
                slug: group.slug,
                postId: authored.id,
            });
            postIds.pop();

            // --- mod can delete others' posts ---
            const others = await memberCaller.post.create({
                slug: group.slug,
                body: '[smoke] pin-delete mod-delete',
            });
            postIds.push(others.id);

            await modCaller.post.delete({
                slug: group.slug,
                postId: others.id,
            });
            postIds.pop();

            console.log(
                `ok: group "${group.slug}" member=${member.user.email} mod=${mod.user.email}`,
            );
        } else {
            console.log(
                '(skip mod pin/unpin + mod-delete: no moderator|admin|owner in group)',
            );

            // Still verify author delete when no mod present
            await memberCaller.post.delete({
                slug: group.slug,
                postId: authored.id,
            });
            postIds.pop();
            console.log(
                `ok (partial): group "${group.slug}" as ${member.user.email}`,
            );
        }

        console.log('\nPASS');
    } finally {
        for (const id of postIds) {
            await db.post.delete({ where: { id } }).catch(() => {});
        }
        await db.$disconnect();
    }
}

main().catch((err) => {
    console.error('\nFAIL', err);
    process.exitCode = 1;
    void db.$disconnect();
});
