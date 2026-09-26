import type {
    CategoryDto,
    GroupMembershipRoleDto,
    GroupMembershipStatusDto,
} from '@repo/api';
import type { Comment } from '@entities/Comment';
import type { Post } from '@entities/Post';
import { GroupPostDetail } from '@features/group-feed';
import type { Language } from '@shared/config/locales/types';

type GroupPostViewLabels = {
    backToFeed: string;
    commentsHeading: string;
    commentsEmpty: string;
    reply: string;
    cancelReply: string;
    pinned: string;
    categoryNone: string;
    categoryLabel: string;
};

interface GroupPostViewProps {
    locale: Language;
    groupSlug: string;
    post: Post;
    comments: Comment[];
    categories: CategoryDto[];
    viewerUserId: string | null;
    viewerRole: GroupMembershipRoleDto | null;
    viewerStatus: GroupMembershipStatusDto | null;
    labels: GroupPostViewLabels;
}

/** Server view — interactive detail lives in {@link GroupPostDetail}. */
export function GroupPostView(props: GroupPostViewProps) {
    return <GroupPostDetail {...props} />;
}
