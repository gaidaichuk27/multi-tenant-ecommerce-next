/**
 * Phase 2 smoke: tRPC post.* / comment.* via createCaller (groupMemberProcedure).
 *
 * Usage (from repo root):
 *   pnpm smoke:feed:phase-2
 *
 * Requires an active group membership in the local DB. Cleans up created rows.
 */
import assert from 'node:assert/strict';
import { db } from '@repo/database';
import type { User } from '@entities/User';
import { createCallerFactory } from '../src/TRPC/init';
import { appRouter } from '../src/TRPC/routers/_app';

const createCaller = createCallerFactory(appRouter);

function section(title: string) {
    console.log(`\n== ${title} ==`);
}

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
    console.log('smoke: community-feed phase-2');

    const membership = await db.groupMembership.findFirst({
        where: { status: 'active' },
        include: {
            group: { select: { id: true, slug: true } },
            user: true,
        },
        orderBy: { joinedAt: 'asc' },
    });

    assert.ok(
        membership,
        'expected an active group membership (re-seed if empty)',
    );

    const { group, user } = membership;
    const caller = createCaller({
        userId: user.id,
        user: toAppUser(user),
        headers: new Headers(),
    });

    let postId: string | undefined;

    try {
        section('post.create / list / get');
        const created = await caller.post.create({
            slug: group.slug,
            body: '[smoke] phase-2 post',
        });
        postId = created.id;
        assert.equal(created.body, '[smoke] phase-2 post');
        assert.equal(created.authorId, user.id);
        assert.equal(created.commentCount, 0);
        assert.equal(created.likeCount, 0);
        assert.equal(created.likedByViewer, false);
        assert.ok(created.author?.username);

        const listed = await caller.post.list({
            slug: group.slug,
            limit: 20,
        });
        assert.ok(listed.items.some((item) => item.id === created.id));

        const got = await caller.post.get({
            slug: group.slug,
            postId: created.id,
        });
        assert.equal(got.id, created.id);
        assert.equal(got.likeCount, 0);
        assert.equal(got.likedByViewer, false);

        section('post.like toggle');
        const liked = await caller.post.like({
            slug: group.slug,
            postId: created.id,
        });
        assert.equal(liked.liked, true);
        assert.equal(liked.likeCount, 1);

        const afterLike = await caller.post.get({
            slug: group.slug,
            postId: created.id,
        });
        assert.equal(afterLike.likeCount, 1);
        assert.equal(afterLike.likedByViewer, true);

        const unliked = await caller.post.like({
            slug: group.slug,
            postId: created.id,
        });
        assert.equal(unliked.liked, false);
        assert.equal(unliked.likeCount, 0);

        section('comment.create / list / reply');
        const comment = await caller.comment.create({
            slug: group.slug,
            postId: created.id,
            body: '[smoke] phase-2 comment',
        });
        assert.equal(comment.postId, created.id);
        assert.equal(comment.parentId, null);

        const reply = await caller.comment.create({
            slug: group.slug,
            postId: created.id,
            parentId: comment.id,
            body: '[smoke] phase-2 reply',
        });
        assert.equal(reply.parentId, comment.id);

        const comments = await caller.comment.list({
            slug: group.slug,
            postId: created.id,
            limit: 50,
        });
        assert.equal(comments.items.length, 2);

        const afterComments = await caller.post.get({
            slug: group.slug,
            postId: created.id,
        });
        assert.equal(afterComments.commentCount, 2);

        section('post.update / comment.update');
        const updatedPost = await caller.post.update({
            slug: group.slug,
            postId: created.id,
            body: '[smoke] phase-2 post updated',
        });
        assert.equal(updatedPost.body, '[smoke] phase-2 post updated');

        const updatedComment = await caller.comment.update({
            slug: group.slug,
            commentId: comment.id,
            body: '[smoke] phase-2 comment updated',
        });
        assert.equal(updatedComment.body, '[smoke] phase-2 comment updated');

        section('delete');
        await caller.comment.delete({
            slug: group.slug,
            commentId: reply.id,
        });
        await caller.post.delete({
            slug: group.slug,
            postId: created.id,
        });
        postId = undefined;

        await assert.rejects(
            () =>
                caller.post.get({
                    slug: group.slug,
                    postId: created.id,
                }),
            (err: unknown) =>
                typeof err === 'object' &&
                err !== null &&
                'code' in err &&
                (err as { code: string }).code === 'NOT_FOUND',
        );

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
