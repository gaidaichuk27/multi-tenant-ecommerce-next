import { notFound, redirect } from 'next/navigation';
import getTranslations from '@/i18n';
import { isTrpcErrorCode } from '@lib/trpc/errors';
import { listPostComments } from '@lib/comments/queries';
import { getGroupPost } from '@lib/posts/queries';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { GroupPostView } from '@views/group/GroupPostView';

interface GroupPostPageViewProps {
    locale: Language;
    groupSlug: string;
    postId: string;
}

const i18nNamespaces = ['common'];

export async function GroupPostPageView({
    locale,
    groupSlug,
    postId,
}: GroupPostPageViewProps) {
    const { t } = await getTranslations(locale, i18nNamespaces);

    let post;
    let commentsPage;

    try {
        [post, commentsPage] = await Promise.all([
            getGroupPost(groupSlug, postId),
            listPostComments(groupSlug, postId),
        ]);
    } catch (error) {
        if (isTrpcErrorCode(error, 'NOT_FOUND')) {
            notFound();
        }

        if (
            isTrpcErrorCode(error, 'FORBIDDEN') ||
            isTrpcErrorCode(error, 'UNAUTHORIZED')
        ) {
            redirect(buildLocalizedPathname(`/${groupSlug}/about`, locale));
        }

        throw error;
    }

    return (
        <GroupPostView
            locale={locale}
            groupSlug={groupSlug}
            post={post}
            comments={commentsPage.items}
            labels={{
                backToFeed: t('common:group.post.back_to_feed'),
                commentsHeading: t('common:group.post.comments_heading'),
                commentsEmpty: t('common:group.post.comments_empty'),
                reply: t('common:group.post.comment.reply'),
                cancelReply: t('common:group.post.comment.cancel_reply'),
                pinned: t('common:group.feed.pinned'),
            }}
        />
    );
}
