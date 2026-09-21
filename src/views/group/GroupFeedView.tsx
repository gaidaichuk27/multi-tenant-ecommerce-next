import Link from 'next/link';
import type {
    GroupMembershipRoleDto,
    GroupMembershipStatusDto,
} from '@repo/api';
import type { Post } from '@entities/Post';
import {
    CreatePostForm,
    LikePostButton,
    PostActionsMenu,
} from '@features/group-feed';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { formatPostedAt } from '@shared/lib/formatPostedAt';
import { Avatar } from '@shared/ui/Avatar';

type GroupFeedViewLabels = {
    empty: string;
    commentsCount: (count: number) => string;
    pinned: string;
};

interface GroupFeedViewProps {
    locale: Language;
    groupSlug: string;
    posts: Post[];
    viewerUserId: string | null;
    viewerRole: GroupMembershipRoleDto | null;
    viewerStatus: GroupMembershipStatusDto | null;
    labels: GroupFeedViewLabels;
}

function PostFeedItem({
    locale,
    groupSlug,
    post,
    viewerUserId,
    viewerRole,
    viewerStatus,
    labels,
}: {
    locale: Language;
    groupSlug: string;
    post: Post;
    viewerUserId: string | null;
    viewerRole: GroupMembershipRoleDto | null;
    viewerStatus: GroupMembershipStatusDto | null;
    labels: Pick<GroupFeedViewLabels, 'commentsCount' | 'pinned'>;
}) {
    const displayName =
        post.author?.name ?? post.author?.username ?? post.authorId;
    const href = buildLocalizedPathname(`/${groupSlug}/${post.id}`, locale);

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
                            surface="feed"
                        />
                    </div>
                    <Link
                        href={href}
                        className="hover:text-foreground mt-2 block text-sm leading-relaxed whitespace-pre-wrap"
                    >
                        {post.body}
                    </Link>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                        <LikePostButton
                            groupSlug={groupSlug}
                            postId={post.id}
                            likeCount={post.likeCount}
                            likedByViewer={post.likedByViewer}
                        />
                        {typeof post.commentCount === 'number' ? (
                            <p className="text-muted-foreground text-xs">
                                <Link
                                    href={href}
                                    className="hover:text-foreground hover:underline"
                                >
                                    {labels.commentsCount(post.commentCount)}
                                </Link>
                            </p>
                        ) : null}
                    </div>
                </div>
            </div>
        </li>
    );
}

function PostFeedList({
    locale,
    groupSlug,
    posts,
    viewerUserId,
    viewerRole,
    viewerStatus,
    labels,
}: {
    locale: Language;
    groupSlug: string;
    posts: Post[];
    viewerUserId: string | null;
    viewerRole: GroupMembershipRoleDto | null;
    viewerStatus: GroupMembershipStatusDto | null;
    labels: Pick<GroupFeedViewLabels, 'commentsCount' | 'pinned'>;
}) {
    return (
        <ul className="divide-border divide-y rounded-md border">
            {posts.map((post) => (
                <PostFeedItem
                    key={post.id}
                    locale={locale}
                    groupSlug={groupSlug}
                    post={post}
                    viewerUserId={viewerUserId}
                    viewerRole={viewerRole}
                    viewerStatus={viewerStatus}
                    labels={labels}
                />
            ))}
        </ul>
    );
}

export function GroupFeedView({
    locale,
    groupSlug,
    posts,
    viewerUserId,
    viewerRole,
    viewerStatus,
    labels,
}: GroupFeedViewProps) {
    return (
        <div className="space-y-6">
            <CreatePostForm groupSlug={groupSlug} />

            {posts.length === 0 ? (
                <p className="text-muted-foreground text-sm">{labels.empty}</p>
            ) : (
                <PostFeedList
                    locale={locale}
                    groupSlug={groupSlug}
                    posts={posts}
                    viewerUserId={viewerUserId}
                    viewerRole={viewerRole}
                    viewerStatus={viewerStatus}
                    labels={labels}
                />
            )}
        </div>
    );
}
