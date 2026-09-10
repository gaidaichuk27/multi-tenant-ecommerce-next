import type { Metadata } from 'next';
import getTranslations from '@/i18n';
import { AppView } from '@views/app/AppView';
import { isValidLocale } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import i18nConfig from '@/i18nConfig';

/** Cookie session gate — never serve a static Full Route Cache shell. */
export const dynamic = 'force-dynamic';

type AppPageProps = {
    params: Promise<{ locale: string }>;
};

const i18nNamespaces = ['common'];

export async function generateMetadata({
    params,
}: AppPageProps): Promise<Metadata> {
    const { locale } = await params;
    const { t } = await getTranslations(locale, i18nNamespaces);

    return {
        title: t('common:page.app.title'),
        description: t('common:page.app.description'),
        robots: { index: false, follow: false },
    };
}

export default async function AppPage({ params }: AppPageProps) {
    const { locale: localeParam } = await params;
    const locale: Language = isValidLocale(localeParam)
        ? localeParam
        : i18nConfig.defaultLocale;

    return <AppView locale={locale} />;
}
