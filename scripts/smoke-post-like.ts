/**
 * Focused post.like smoke via createCaller (avoids full appRouter → mail → SVG).
 *
 * Usage (from repo root):
 *   pnpm smoke:feed:likes
 *
 * Requires an active group membership in the local DB. Cleans up created rows.
 */
import assert from 'node:assert/strict';
import { db } from '@repo/database';
import type { User } from '@entities/User';
import { createCallerFactory, createTRPCRouter } from '../src/TRPC/init';
import { postRouter } from '../src/TRPC/routers/post';

const createCaller = createCallerFactory(
    createTRPCRouter({ post: postRouter }),
);

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

async function main() {
    console.log('smoke: post.like');

    const membership = await db.groupMembership.findFirst({
        where: { status: 'active' },
        include: {
            group: { select: { id: true, slug: true } },
            user: true,
        },
        orderBy: { joinedAt: 'asc' },
    });
    assert.ok(membership, 'expected an active group membership');

    const { group, user } = membership;
    const caller = createCaller({
        userId: user.id,
        user: toAppUser(user),
        headers: new Headers(),
    });

    const otherMembership = await db.groupMembership.findFirst({
        where: {
            status: 'active',
            groupId: group.id,
            userId: { not: user.id },
        },
        include: { user: true },
    });

    let postId: string | undefined;

    try {
        const created = await caller.post.create({
            slug: group.slug,
            body: '[smoke] post like',
        });
        postId = created.id;
        assert.equal(created.likeCount, 0);
        assert.equal(created.likedByViewer, false);

        // Self-like: allowed, no author points
        const liked = await caller.post.like({
            slug: group.slug,
            postId: created.id,
        });
        assert.equal(liked.liked, true);
        assert.equal(liked.likeCount, 1);

        const got = await caller.post.get({
            slug: group.slug,
            postId: created.id,
        });
        assert.equal(got.likeCount, 1);
        assert.equal(got.likedByViewer, true);

        const afterSelfLike = await db.groupMembership.findUnique({
            where: {
                groupId_userId: { groupId: group.id, userId: user.id },
            },
        });
        assert.equal(afterSelfLike?.points, membership.points);

        const unliked = await caller.post.like({
            slug: group.slug,
            postId: created.id,
        });
        assert.equal(unliked.liked, false);
        assert.equal(unliked.likeCount, 0);

        // Concurrent double-like must not 500 (createMany skipDuplicates).
        // Toggle direction can race; only assert no throw + at most one like row.
        await assert.doesNotReject(() =>
            Promise.all([
                caller.post.like({ slug: group.slug, postId: created.id }),
                caller.post.like({ slug: group.slug, postId: created.id }),
            ]),
        );
        assert.ok(
            (await db.postLike.count({ where: { postId: created.id } })) <= 1,
        );

        // Normalize to unliked for the rest of the smoke
        const afterRace = await caller.post.get({
            slug: group.slug,
            postId: created.id,
        });
        if (afterRace.likedByViewer) {
            await caller.post.like({
                slug: group.slug,
                postId: created.id,
            });
        }
        assert.equal(
            await db.postLike.count({ where: { postId: created.id } }),
            0,
        );

        if (otherMembership) {
            const otherCaller = createCaller({
                userId: otherMembership.user.id,
                user: toAppUser(otherMembership.user),
                headers: new Headers(),
            });

            const pointsBefore = (
                await db.groupMembership.findUnique({
                    where: {
                        groupId_userId: {
                            groupId: group.id,
                            userId: user.id,
                        },
                    },
                })
            )?.points;
            assert.equal(typeof pointsBefore, 'number');

            const otherLiked = await otherCaller.post.like({
                slug: group.slug,
                postId: created.id,
            });
            assert.equal(otherLiked.liked, true);
            assert.equal(otherLiked.likeCount, 1);

            const authorAfter = await db.groupMembership.findUnique({
                where: {
                    groupId_userId: { groupId: group.id, userId: user.id },
                },
            });
            assert.equal(authorAfter?.points, pointsBefore! + 1);

            // Delete while other-member like is still present → claw back points
            await caller.post.delete({
                slug: group.slug,
                postId: created.id,
            });
            postId = undefined;

            const authorAfterDelete = await db.groupMembership.findUnique({
                where: {
                    groupId_userId: { groupId: group.id, userId: user.id },
                },
            });
            assert.equal(authorAfterDelete?.points, pointsBefore);
        } else {
            console.log(
                '(skip other-member points / delete clawback: only one active member)',
            );
            await caller.post.delete({
                slug: group.slug,
                postId: created.id,
            });
            postId = undefined;
        }

        console.log(`ok: group "${group.slug}" as ${user.email}`);
        console.log('\nPASS');
    } finally {
        if (postId) {
            await db.post.delete({ where: { id: postId } }).catch(() => {});
        }
        await db.$disconnect();
    }
}

main().catch((err) => {
    console.error('\nFAIL', err);
    process.exitCode = 1;
    void db.$disconnect();
});
