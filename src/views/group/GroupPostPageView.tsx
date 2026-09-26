import { notFound, redirect } from 'next/navigation';
import getTranslations from '@/i18n';
import { isTrpcErrorCode } from '@lib/trpc/errors';
import { listCategories } from '@lib/categories/queries';
import { listPostComments } from '@lib/comments/queries';
import { getMineMembership } from '@lib/groups/queries';
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
    let membership;
    let categories;

    try {
        [post, commentsPage, membership, categories] = await Promise.all([
            getGroupPost(groupSlug, postId),
            listPostComments(groupSlug, postId),
            getMineMembership(groupSlug),
            listCategories(groupSlug),
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
            categories={categories}
            viewerUserId={membership?.userId ?? null}
            viewerRole={membership?.role ?? null}
            viewerStatus={membership?.status ?? null}
            labels={{
                backToFeed: t('common:group.post.back_to_feed'),
                commentsHeading: t('common:group.post.comments_heading'),
                commentsEmpty: t('common:group.post.comments_empty'),
                reply: t('common:group.post.comment.reply'),
                cancelReply: t('common:group.post.comment.cancel_reply'),
                pinned: t('common:group.feed.pinned'),
                categoryNone: t('common:group.feed.composer.category_none'),
                categoryLabel: t('common:group.feed.composer.category'),
            }}
        />
    );
}
