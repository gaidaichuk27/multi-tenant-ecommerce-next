import type { Metadata } from 'next';
import getTranslations from '@/i18n';
import { PendingPageView } from '@views/group/PendingPageView';
import { isValidLocale } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import i18nConfig from '@/i18nConfig';

type PendingPageProps = {
    params: Promise<{ locale: string; group: string }>;
};

const i18nNamespaces = ['common'];

export async function generateMetadata({
    params,
}: PendingPageProps): Promise<Metadata> {
    const { locale } = await params;
    const { t } = await getTranslations(locale, i18nNamespaces);

    return {
        title: t('common:page.group.pending.title'),
        description: t('common:page.group.pending.description'),
        robots: { index: false, follow: false },
    };
}

export default async function PendingPage({ params }: PendingPageProps) {
    const { locale: localeParam, group: groupSlug } = await params;
    const locale: Language = isValidLocale(localeParam)
        ? localeParam
        : i18nConfig.defaultLocale;

    return (
        <PendingPageView
            locale={locale}
            groupSlug={groupSlug}
        />
    );
}
