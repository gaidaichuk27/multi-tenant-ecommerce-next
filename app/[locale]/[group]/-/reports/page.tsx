import type { Metadata } from 'next';
import getTranslations from '@/i18n';
import { ReportsPageView } from '@views/group/ReportsPageView';
import { isValidLocale } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import i18nConfig from '@/i18nConfig';

type ReportsPageProps = {
    params: Promise<{ locale: string; group: string }>;
};

const i18nNamespaces = ['common'];

export async function generateMetadata({
    params,
}: ReportsPageProps): Promise<Metadata> {
    const { locale } = await params;
    const { t } = await getTranslations(locale, i18nNamespaces);

    return {
        title: t('common:page.group.reports.title'),
        description: t('common:page.group.reports.description'),
        robots: { index: false, follow: false },
    };
}

export default async function ReportsPage({ params }: ReportsPageProps) {
    const { locale: localeParam, group: groupSlug } = await params;
    const locale: Language = isValidLocale(localeParam)
        ? localeParam
        : i18nConfig.defaultLocale;

    return (
        <ReportsPageView
            locale={locale}
            groupSlug={groupSlug}
        />
    );
}
