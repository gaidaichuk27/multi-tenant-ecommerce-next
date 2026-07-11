import type { Metadata } from 'next';
import getTranslations from '@/i18n';
import { BackpackView } from '@views/app/BackpackView';
import { isValidLocale } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import i18nConfig from '@/i18nConfig';

type BackpackPageProps = {
    params: Promise<{ locale: string }>;
};

const i18nNamespaces = ['common'];

export async function generateMetadata({
    params,
}: BackpackPageProps): Promise<Metadata> {
    const { locale } = await params;
    const { t } = await getTranslations(locale, i18nNamespaces);

    return {
        title: t('common:page.backpack.title'),
        description: t('common:page.backpack.description'),
        robots: { index: false, follow: false },
    };
}

export default async function BackpackPage({ params }: BackpackPageProps) {
    const { locale: localeParam } = await params;
    const locale: Language = isValidLocale(localeParam)
        ? localeParam
        : i18nConfig.defaultLocale;

    return <BackpackView locale={locale} />;
}
