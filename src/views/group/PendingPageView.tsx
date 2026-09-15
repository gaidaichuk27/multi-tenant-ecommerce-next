import { notFound, redirect } from 'next/navigation';
import getTranslations from '@/i18n';
import { isTrpcErrorCode } from '@lib/trpc/errors';
import { listPendingMembers } from '@lib/membership/queries';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { PendingListView } from '@views/group/PendingListView';

interface PendingPageViewProps {
    locale: Language;
    groupSlug: string;
}

const i18nNamespaces = ['common'];

export async function PendingPageView({
    locale,
    groupSlug,
}: PendingPageViewProps) {
    const { t } = await getTranslations(locale, i18nNamespaces);

    let page;

    try {
        page = await listPendingMembers(groupSlug);
    } catch (error) {
        if (isTrpcErrorCode(error, 'NOT_FOUND')) {
            notFound();
        }

        if (
            isTrpcErrorCode(error, 'FORBIDDEN') ||
            isTrpcErrorCode(error, 'UNAUTHORIZED')
        ) {
            redirect(buildLocalizedPathname(`/${groupSlug}`, locale));
        }

        throw error;
    }

    return (
        <PendingListView
            groupSlug={groupSlug}
            title={t('common:group.pending.title')}
            emptyLabel={t('common:group.pending.empty')}
            approveLabel={t('common:group.pending.approve')}
            declineLabel={t('common:group.pending.decline')}
            members={page.items}
        />
    );
}
