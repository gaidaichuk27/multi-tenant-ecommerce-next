import { notFound, redirect } from 'next/navigation';
import getTranslations from '@/i18n';
import { isTrpcErrorCode } from '@lib/trpc/errors';
import { listPostReports } from '@lib/posts/queries';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { ReportsListView } from '@views/group/ReportsListView';

interface ReportsPageViewProps {
    locale: Language;
    groupSlug: string;
}

const i18nNamespaces = ['common'];

export async function ReportsPageView({
    locale,
    groupSlug,
}: ReportsPageViewProps) {
    const { t } = await getTranslations(locale, i18nNamespaces);

    let page;

    try {
        page = await listPostReports(groupSlug);
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
        <ReportsListView
            groupSlug={groupSlug}
            locale={locale}
            title={t('common:group.reports.title')}
            emptyLabel={t('common:group.reports.empty')}
            hintLabel={t('common:group.reports.hint')}
            resolveLabel={t('common:group.reports.resolve')}
            dismissLabel={t('common:group.reports.dismiss')}
            reportedByLabel={t('common:group.reports.reported_by')}
            reasonLabel={t('common:group.reports.reason')}
            viewPostLabel={t('common:group.reports.view_post')}
            reports={page.items}
        />
    );
}
