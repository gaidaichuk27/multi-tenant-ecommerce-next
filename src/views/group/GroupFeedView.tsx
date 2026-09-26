import type {
    CategoryDto,
    GroupMembershipRoleDto,
    GroupMembershipStatusDto,
} from '@repo/api';
import type { Post } from '@entities/Post';
import { CreatePostForm, PostFeedItem } from '@features/group-feed';
import type { Language } from '@shared/config/locales/types';

import { FeedCategoryChips } from './FeedCategoryChips';

type GroupFeedViewLabels = {
    empty: string;
    commentsCount: (count: number) => string;
    pinned: string;
    allCategories: string;
    categoriesNav: string;
    categoryNone: string;
    categoryLabel: string;
};

interface GroupFeedViewProps {
    locale: Language;
    groupSlug: string;
    posts: Post[];
    categories: CategoryDto[];
    activeCategoryId: string | null;
    viewerUserId: string | null;
    viewerRole: GroupMembershipRoleDto | null;
    viewerStatus: GroupMembershipStatusDto | null;
    labels: GroupFeedViewLabels;
}

export function GroupFeedView({
    locale,
    groupSlug,
    posts,
    categories,
    activeCategoryId,
    viewerUserId,
    viewerRole,
    viewerStatus,
    labels,
}: GroupFeedViewProps) {
    return (
        <div className="space-y-6">
            <CreatePostForm
                groupSlug={groupSlug}
                categories={categories}
                defaultCategoryId={activeCategoryId}
                categoryNoneLabel={labels.categoryNone}
                categoryLabel={labels.categoryLabel}
            />

            <FeedCategoryChips
                locale={locale}
                groupSlug={groupSlug}
                categories={categories}
                activeCategoryId={activeCategoryId}
                allLabel={labels.allCategories}
                navLabel={labels.categoriesNav}
            />

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
                            categories={categories}
                            viewerUserId={viewerUserId}
                            viewerRole={viewerRole}
                            viewerStatus={viewerStatus}
                            pinnedLabel={labels.pinned}
                            categoryNoneLabel={labels.categoryNone}
                            categoryLabel={labels.categoryLabel}
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
