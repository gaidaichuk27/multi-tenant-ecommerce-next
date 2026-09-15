/**
 * Phase 1 smoke: @repo/api post/comment contracts + Prisma posts/comments CRUD.
 *
 * Usage (from repo root):
 *   pnpm exec dotenv -e .env -- pnpm --filter backend exec tsx ../../scripts/smoke-community-feed-phase-1.ts
 *
 * Exit 0 on success. Cleans up rows it creates.
 */
import assert from 'node:assert/strict';
import {
    COMMENT_T_MESSAGES,
    POST_T_MESSAGES,
    commentCreateInputSchema,
    commentSchema,
    postBodySchema,
    postCreateInputSchema,
    postListInputSchema,
    postSchema,
    serializeComment,
    serializePost,
} from '@repo/api';
import { db } from '@repo/database';

function section(title: string) {
    console.log(`\n== ${title} ==`);
}

async function testContracts() {
    section('contracts');

    assert.equal(POST_T_MESSAGES.CREATE_SUCCESS, 'post.create.success');
    assert.equal(COMMENT_T_MESSAGES.CREATE_SUCCESS, 'comment.create.success');

    assert.equal(postBodySchema.safeParse('').success, false);
    assert.equal(postBodySchema.safeParse('   ').success, false);
    assert.equal(postBodySchema.safeParse('hello').success, true);

    const createOk = postCreateInputSchema.safeParse({
        slug: 'demo-group',
        body: '  hello feed  ',
    });
    assert.equal(createOk.success, true);
    if (createOk.success) {
        assert.equal(createOk.data.body, 'hello feed');
    }

    assert.equal(
        postCreateInputSchema.safeParse({ slug: 'demo-group', body: '' })
            .success,
        false,
    );

    const list = postListInputSchema.safeParse({ slug: 'demo-group' });
    assert.equal(list.success, true);
    if (list.success) {
        assert.equal(list.data.limit, 20);
    }

    const now = new Date('2026-09-15T12:00:00.000Z');
    const postDto = serializePost({
        id: 'post_1',
        groupId: 'group_1',
        authorId: 'user_1',
        body: 'Hello',
        type: 'text',
        pinned: false,
        broadcastEmail: false,
        createdAt: now,
        updatedAt: now,
        author: {
            id: 'user_1',
            username: 'alice',
            name: 'Alice',
            avatarUrl: null,
        },
        commentCount: 2,
    });
    assert.equal(postDto.createdAt, now.toISOString());
    assert.equal(postDto.author?.username, 'alice');
    assert.equal(postDto.commentCount, 2);
    assert.equal(postSchema.safeParse(postDto).success, true);

    const commentOk = commentCreateInputSchema.safeParse({
        slug: 'demo-group',
        postId: 'post_1',
        body: 'Nice post',
        parentId: undefined,
    });
    assert.equal(commentOk.success, true);

    const commentDto = serializeComment({
        id: 'c_1',
        postId: 'post_1',
        parentId: null,
        authorId: 'user_1',
        body: 'Nice post',
        createdAt: now,
        updatedAt: now,
    });
    assert.equal(commentDto.parentId, null);
    assert.equal(commentSchema.safeParse(commentDto).success, true);

    console.log('ok: zod schemas + serializers');
}

async function testDatabase() {
    section('database');

    const group = await db.group.findFirst({
        orderBy: { createdAt: 'asc' },
        select: { id: true, slug: true, ownerId: true },
    });
    assert.ok(
        group,
        'expected at least one group in local DB (re-seed if empty)',
    );

    const authorId = group.ownerId;
    let postId: string | undefined;
    let commentId: string | undefined;
    let replyId: string | undefined;

    try {
        const post = await db.post.create({
            data: {
                groupId: group.id,
                authorId,
                body: '[smoke] phase-1 post',
                type: 'text',
            },
        });
        postId = post.id;
        assert.equal(post.type, 'text');
        assert.equal(post.pinned, false);

        const comment = await db.comment.create({
            data: {
                postId: post.id,
                authorId,
                body: '[smoke] phase-1 comment',
            },
        });
        commentId = comment.id;
        assert.equal(comment.parentId, null);

        const reply = await db.comment.create({
            data: {
                postId: post.id,
                parentId: comment.id,
                authorId,
                body: '[smoke] phase-1 reply',
            },
        });
        replyId = reply.id;
        assert.equal(reply.parentId, comment.id);

        const listed = await db.post.findMany({
            where: { groupId: group.id, id: post.id },
            include: { _count: { select: { comments: true } } },
        });
        assert.equal(listed.length, 1);
        assert.equal(listed[0]?._count.comments, 2);

        const dto = serializePost({
            ...listed[0]!,
            commentCount: listed[0]!._count.comments,
        });
        assert.equal(postSchema.safeParse(dto).success, true);

        console.log(
            `ok: CRUD on group "${group.slug}" (post=${post.id}, comments=2)`,
        );
    } finally {
        if (replyId) {
            await db.comment.delete({ where: { id: replyId } }).catch(() => {});
        }
        if (commentId) {
            await db.comment
                .delete({ where: { id: commentId } })
                .catch(() => {});
        }
        if (postId) {
            await db.post.delete({ where: { id: postId } }).catch(() => {});
        }
    }
}

async function main() {
    console.log('smoke: community-feed phase-1');
    await testContracts();
    await testDatabase();
    console.log('\nPASS');
}

main()
    .catch((err) => {
        console.error('\nFAIL', err);
        process.exitCode = 1;
    })
    .finally(async () => {
        await db.$disconnect();
    });
