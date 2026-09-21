/**
 * Focused post.update smoke via createCaller
 * (avoids full appRouter → mail → SVG).
 *
 * Coverage:
 *   - author can update own post
 *   - empty / whitespace body rejected (BAD_REQUEST)
 *   - unrelated member cannot update
 *   - mod can update others' posts
 *
 * Usage (from repo root):
 *   pnpm smoke:feed:update
 *
 * Requires at least one active plain member. Mod cases need a
 * moderator|admin|owner in the same group (skipped with a note otherwise).
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
    console.log('smoke: post.update');

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
        const authored = await memberCaller.post.create({
            slug: group.slug,
            body: '[smoke] update authored',
        });
        postIds.push(authored.id);

        // --- author can update ---
        const updatedByAuthor = await memberCaller.post.update({
            slug: group.slug,
            postId: authored.id,
            body: '[smoke] update authored — edited',
        });
        assert.equal(updatedByAuthor.body, '[smoke] update authored — edited');
        assert.equal(updatedByAuthor.id, authored.id);

        // --- empty / whitespace body rejected (create-parity) ---
        await assert.rejects(
            () =>
                memberCaller.post.update({
                    slug: group.slug,
                    postId: authored.id,
                    body: '   ',
                }),
            (err: unknown) => {
                assert.ok(err instanceof TRPCError);
                assert.equal(err.code, 'BAD_REQUEST');
                return true;
            },
        );
        await assert.rejects(
            () =>
                memberCaller.post.update({
                    slug: group.slug,
                    postId: authored.id,
                    body: '',
                }),
            (err: unknown) => {
                assert.ok(err instanceof TRPCError);
                assert.equal(err.code, 'BAD_REQUEST');
                return true;
            },
        );

        // --- unrelated member cannot update ---
        if (otherMember) {
            const otherCaller = callerFor(otherMember.user);
            await assertForbidden(() =>
                otherCaller.post.update({
                    slug: group.slug,
                    postId: authored.id,
                    body: '[smoke] update forbidden',
                }),
            );
        } else {
            console.log(
                '(skip unrelated-member update forbid: no second plain member)',
            );
        }

        if (mod) {
            const modCaller = callerFor(mod.user);

            // --- mod can update others' posts ---
            const updatedByMod = await modCaller.post.update({
                slug: group.slug,
                postId: authored.id,
                body: '[smoke] update by mod',
            });
            assert.equal(updatedByMod.body, '[smoke] update by mod');

            console.log(
                `ok: group "${group.slug}" member=${member.user.email} mod=${mod.user.email}`,
            );
        } else {
            console.log('(skip mod update: no moderator|admin|owner in group)');
            console.log(
                `ok (partial): group "${group.slug}" as ${member.user.email}`,
            );
        }

        await memberCaller.post.delete({
            slug: group.slug,
            postId: authored.id,
        });
        postIds.pop();

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
