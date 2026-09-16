import { notFound, redirect } from 'next/navigation';
import getTranslations from '@/i18n';
import { isTrpcErrorCode } from '@lib/trpc/errors';
import { listGroupPosts } from '@lib/posts/queries';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { GroupFeedView } from '@views/group/GroupFeedView';

interface GroupFeedPageViewProps {
    locale: Language;
    groupSlug: string;
}

const i18nNamespaces = ['common'];

export async function GroupFeedPageView({
    locale,
    groupSlug,
}: GroupFeedPageViewProps) {
    const { t } = await getTranslations(locale, i18nNamespaces);

    let page;

    try {
        page = await listGroupPosts(groupSlug);
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
        <GroupFeedView
            groupSlug={groupSlug}
            posts={page.items}
            labels={{
                empty: t('common:group.feed.empty'),
                commentsCount: (count) =>
                    t('common:group.feed.comments_count', { count }),
                pinned: t('common:group.feed.pinned'),
            }}
        />
    );
}
