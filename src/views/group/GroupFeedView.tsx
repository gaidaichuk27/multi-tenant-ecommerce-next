import type { Post } from '@entities/Post';
import { CreatePostForm } from '@features/group-feed';
import { Avatar } from '@shared/ui/Avatar';

type GroupFeedViewLabels = {
    empty: string;
    commentsCount: (count: number) => string;
    pinned: string;
};

interface GroupFeedViewProps {
    groupSlug: string;
    posts: Post[];
    labels: GroupFeedViewLabels;
}

function formatPostedAt(iso: string) {
    try {
        return new Date(iso).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    } catch {
        return iso;
    }
}

function PostFeedItem({
    post,
    labels,
}: {
    post: Post;
    labels: Pick<GroupFeedViewLabels, 'commentsCount' | 'pinned'>;
}) {
    const displayName =
        post.author?.name ?? post.author?.username ?? post.authorId;

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
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p className="truncate font-medium">{displayName}</p>
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
                    <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">
                        {post.body}
                    </p>
                    {typeof post.commentCount === 'number' ? (
                        <p className="text-muted-foreground mt-2 text-xs">
                            {labels.commentsCount(post.commentCount)}
                        </p>
                    ) : null}
                </div>
            </div>
        </li>
    );
}

function PostFeedList({
    posts,
    labels,
}: {
    posts: Post[];
    labels: Pick<GroupFeedViewLabels, 'commentsCount' | 'pinned'>;
}) {
    return (
        <ul className="divide-border divide-y rounded-md border">
            {posts.map((post) => (
                <PostFeedItem
                    key={post.id}
                    post={post}
                    labels={labels}
                />
            ))}
        </ul>
    );
}

export function GroupFeedView({
    groupSlug,
    posts,
    labels,
}: GroupFeedViewProps) {
    return (
        <div className="space-y-6">
            <CreatePostForm groupSlug={groupSlug} />

            {posts.length === 0 ? (
                <p className="text-muted-foreground text-sm">{labels.empty}</p>
            ) : (
                <PostFeedList
                    posts={posts}
                    labels={labels}
                />
            )}
        </div>
    );
}
