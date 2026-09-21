import { notFound, redirect } from 'next/navigation';
import getTranslations from '@/i18n';
import { isTrpcErrorCode } from '@lib/trpc/errors';
import { getMineMembership } from '@lib/groups/queries';
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
    let membership;

    try {
        [page, membership] = await Promise.all([
            listGroupPosts(groupSlug),
            getMineMembership(groupSlug),
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
        <GroupFeedView
            locale={locale}
            groupSlug={groupSlug}
            posts={page.items}
            viewerUserId={membership?.userId ?? null}
            viewerRole={membership?.role ?? null}
            viewerStatus={membership?.status ?? null}
            labels={{
                empty: t('common:group.feed.empty'),
                commentsCount: (count) =>
                    t('common:group.feed.comments_count', { count }),
                pinned: t('common:group.feed.pinned'),
            }}
        />
    );
}
