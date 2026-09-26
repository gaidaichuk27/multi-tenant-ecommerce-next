'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type {
    CategoryDto,
    GroupMembershipRoleDto,
    GroupMembershipStatusDto,
} from '@repo/api';
import type { Post } from '@entities/Post';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { formatPostedAt } from '@shared/lib/formatPostedAt';
import { Avatar } from '@shared/ui/Avatar';

import { LikePostButton } from './LikePostButton';
import { PostActionsMenu } from './PostActionsMenu';
import { PostCategoryBadge, PostPinnedBadge } from './PostMetaBadges';

interface PostFeedItemProps {
    locale: Language;
    groupSlug: string;
    post: Post;
    categories: CategoryDto[];
    viewerUserId: string | null;
    viewerRole: GroupMembershipRoleDto | null;
    viewerStatus: GroupMembershipStatusDto | null;
    /** Precomputed on the server — Client Components cannot receive functions. */
    pinnedLabel: string;
    categoryNoneLabel: string;
    categoryLabel: string;
    commentsCountLabel: string | null;
}

/**
 * Client item so edit can update the body/category immediately via `onSaved`
 * (same lag pattern as likes: local state + `router.refresh()`).
 */
export function PostFeedItem({
    locale,
    groupSlug,
    post,
    categories,
    viewerUserId,
    viewerRole,
    viewerStatus,
    pinnedLabel,
    categoryNoneLabel,
    categoryLabel,
    commentsCountLabel,
}: PostFeedItemProps) {
    const [body, setBody] = useState(post.body);
    const [categoryId, setCategoryId] = useState(post.categoryId);

    useEffect(() => {
        setBody(post.body);
        // Only re-seed body from RSC when the post identity changes. Avoids
        // router.refresh() overwriting a just-saved body with briefly-stale props.
        // eslint-disable-next-line react-hooks/exhaustive-deps -- sync body on post change only
    }, [post.id]);

    // Category can become null after delete→SetNull + refresh without post.id changing.
    useEffect(() => {
        setCategoryId(post.categoryId);
    }, [post.id, post.categoryId]);

    // Drop a local id that no longer exists in the group's category list.
    useEffect(() => {
        if (
            categoryId &&
            !categories.some((category) => category.id === categoryId)
        ) {
            setCategoryId(null);
        }
    }, [categories, categoryId]);

    const displayName =
        post.author?.name ?? post.author?.username ?? post.authorId;
    const href = buildLocalizedPathname(`/${groupSlug}/${post.id}`, locale);
    const feedHref = buildLocalizedPathname(`/${groupSlug}`, locale);
    const category = categoryId
        ? categories.find((item) => item.id === categoryId)
        : undefined;

    return (
        <li className="space-y-3 px-4 py-4">
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
                                <PostPinnedBadge label={pinnedLabel} />
                            ) : null}
                            {category ? (
                                <PostCategoryBadge
                                    feedHref={feedHref}
                                    categoryId={category.id}
                                    name={category.name}
                                />
                            ) : null}
                        </div>
                        <PostActionsMenu
                            locale={locale}
                            groupSlug={groupSlug}
                            postId={post.id}
                            authorId={post.authorId}
                            body={body}
                            categoryId={categoryId}
                            categories={categories}
                            pinned={post.pinned}
                            viewerUserId={viewerUserId}
                            viewerRole={viewerRole}
                            viewerStatus={viewerStatus}
                            surface="feed"
                            onSaved={(saved) => {
                                setBody(saved.body);
                                setCategoryId(saved.categoryId);
                            }}
                            categoryNoneLabel={categoryNoneLabel}
                            categoryLabel={categoryLabel}
                        />
                    </div>
                    <Link
                        href={href}
                        className="hover:text-foreground mt-2 block text-sm leading-relaxed whitespace-pre-wrap"
                    >
                        {body}
                    </Link>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                        <LikePostButton
                            groupSlug={groupSlug}
                            postId={post.id}
                            likeCount={post.likeCount}
                            likedByViewer={post.likedByViewer}
                        />
                        {commentsCountLabel ? (
                            <p className="text-muted-foreground text-xs">
                                <Link
                                    href={href}
                                    className="hover:text-foreground hover:underline"
                                >
                                    {commentsCountLabel}
                                </Link>
                            </p>
                        ) : null}
                    </div>
                </div>
            </div>
        </li>
    );
}
