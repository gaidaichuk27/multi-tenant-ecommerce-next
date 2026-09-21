import type {
    GroupMembershipRoleDto,
    GroupMembershipStatusDto,
} from '@repo/api';
import type { Post } from '@entities/Post';
import { CreatePostForm } from '@features/group-feed';
import type { Language } from '@shared/config/locales/types';

import { PostFeedItem } from './PostFeedItem';

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
                            pinnedLabel={labels.pinned}
                            commentsCountLabel={
                                typeof post.commentCount === 'number'
                                    ? labels.commentsCount(post.commentCount)
                                    : null
                            }
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}
