'use client';

import { Fragment, useState } from 'react';
import Link from 'next/link';
import type {
    GroupMembershipRoleDto,
    GroupMembershipStatusDto,
} from '@repo/api';
import type { Comment } from '@entities/Comment';
import type { Post } from '@entities/Post';
import {
    CreateCommentForm,
    LikePostButton,
    PostActionsMenu,
} from '@features/group-feed';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { formatPostedAt } from '@shared/lib/formatPostedAt';
import { Avatar } from '@shared/ui/Avatar';
import { Button } from '@shared/ui/Form/Button';
import { cn } from '@lib/utils';

type GroupPostViewLabels = {
    backToFeed: string;
    commentsHeading: string;
    commentsEmpty: string;
    reply: string;
    cancelReply: string;
    pinned: string;
};

interface GroupPostViewProps {
    locale: Language;
    groupSlug: string;
    post: Post;
    comments: Comment[];
    viewerUserId: string | null;
    viewerRole: GroupMembershipRoleDto | null;
    viewerStatus: GroupMembershipStatusDto | null;
    labels: GroupPostViewLabels;
}

function CommentItem({
    comment,
    groupSlug,
    postId,
    depth,
    labels,
    replyToId,
    onReply,
    onCancelReply,
}: {
    comment: Comment;
    groupSlug: string;
    postId: string;
    depth: number;
    labels: Pick<GroupPostViewLabels, 'reply' | 'cancelReply'>;
    replyToId: string | null;
    onReply: (id: string) => void;
    onCancelReply: () => void;
}) {
    const displayName =
        comment.author?.name ?? comment.author?.username ?? comment.authorId;
    const isReplying = replyToId === comment.id;

    return (
        <li className={cn('space-y-3 px-4 py-4', depth > 0 && 'ml-8 border-l')}>
            <div className="flex items-start gap-3">
                <Avatar
                    user={{
                        id: comment.author?.id ?? comment.authorId,
                        name: comment.author?.name ?? null,
                        username: comment.author?.username ?? comment.authorId,
                        email: '',
                        avatarUrl: comment.author?.avatarUrl ?? null,
                    }}
                />
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p className="truncate font-medium">{displayName}</p>
                        <time
                            dateTime={comment.createdAt}
                            className="text-muted-foreground text-xs"
                        >
                            {formatPostedAt(comment.createdAt)}
                        </time>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">
                        {comment.body}
                    </p>
                    {depth === 0 ? (
                        <div className="mt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-auto px-0 text-xs"
                                onClick={() =>
                                    isReplying
                                        ? onCancelReply()
                                        : onReply(comment.id)
                                }
                            >
                                {isReplying ? labels.cancelReply : labels.reply}
                            </Button>
                        </div>
                    ) : null}
                    {isReplying ? (
                        <div className="mt-3">
                            <CreateCommentForm
                                groupSlug={groupSlug}
                                postId={postId}
                                parentId={comment.id}
                                onSuccess={onCancelReply}
                            />
                        </div>
                    ) : null}
                </div>
            </div>
        </li>
    );
}

function buildCommentTree(comments: Comment[]) {
    const byParent = new Map<string | null, Comment[]>();

    for (const comment of comments) {
        const key = comment.parentId;
        const list = byParent.get(key) ?? [];
        list.push(comment);
        byParent.set(key, list);
    }

    return byParent;
}

export function GroupPostView({
    locale,
    groupSlug,
    post,
    comments,
    viewerUserId,
    viewerRole,
    viewerStatus,
    labels,
}: GroupPostViewProps) {
    const [replyToId, setReplyToId] = useState<string | null>(null);
    const feedHref = buildLocalizedPathname(`/${groupSlug}`, locale);
    const displayName =
        post.author?.name ?? post.author?.username ?? post.authorId;
    const byParent = buildCommentTree(comments);
    const roots = byParent.get(null) ?? [];

    return (
        <div className="space-y-6">
            <div>
                <Link
                    href={feedHref}
                    className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 hover:underline"
                >
                    {labels.backToFeed}
                </Link>
            </div>

            <article className="space-y-3 rounded-md border p-4">
                <div className="flex items-start gap-3">
                    <Avatar
                        user={{
                            id: post.author?.id ?? post.authorId,
                            name: post.author?.name ?? null,
                            username: post.author?.username ?? post.authorId,
                            email: '',
                            avatarUrl: post.author?.avatarUrl ?? null,
                        }}
                    />
                    <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-2">
                            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
                                <p className="truncate font-medium">
                                    {displayName}
                                </p>
                                <time
                                    dateTime={post.createdAt}
                                    className="text-muted-foreground text-xs"
                                >
                                    {formatPostedAt(post.createdAt)}
                                </time>
                                {post.pinned ? (
                                    <span className="bg-muted rounded px-1.5 py-0.5 text-xs font-medium">
                                        {labels.pinned}
                                    </span>
                                ) : null}
                            </div>
                            <PostActionsMenu
                                locale={locale}
                                groupSlug={groupSlug}
                                postId={post.id}
                                authorId={post.authorId}
                                pinned={post.pinned}
                                viewerUserId={viewerUserId}
                                viewerRole={viewerRole}
                                viewerStatus={viewerStatus}
                                surface="detail"
                            />
                        </div>
                        <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">
                            {post.body}
                        </p>
                        <div className="mt-3">
                            <LikePostButton
                                groupSlug={groupSlug}
                                postId={post.id}
                                likeCount={post.likeCount}
                                likedByViewer={post.likedByViewer}
                            />
                        </div>
                    </div>
                </div>
            </article>

            <section className="space-y-4">
                <h2 className="text-base font-semibold">
                    {labels.commentsHeading}
                </h2>

                <CreateCommentForm
                    groupSlug={groupSlug}
                    postId={post.id}
                />

                {roots.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                        {labels.commentsEmpty}
                    </p>
                ) : (
                    <ul className="divide-border divide-y rounded-md border">
                        {roots.map((root) => (
                            <Fragment key={root.id}>
                                <CommentItem
                                    comment={root}
                                    groupSlug={groupSlug}
                                    postId={post.id}
                                    depth={0}
                                    labels={labels}
                                    replyToId={replyToId}
                                    onReply={setReplyToId}
                                    onCancelReply={() => setReplyToId(null)}
                                />
                                {(byParent.get(root.id) ?? []).map((reply) => (
                                    <CommentItem
                                        key={reply.id}
                                        comment={reply}
                                        groupSlug={groupSlug}
                                        postId={post.id}
                                        depth={1}
                                        labels={labels}
                                        replyToId={replyToId}
                                        onReply={setReplyToId}
                                        onCancelReply={() => setReplyToId(null)}
                                    />
                                ))}
                            </Fragment>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
