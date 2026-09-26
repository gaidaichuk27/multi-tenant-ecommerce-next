import type { Metadata } from 'next';
import getTranslations from '@/i18n';
import { CategoriesPageView } from '@views/group/CategoriesPageView';
import { isValidLocale } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import i18nConfig from '@/i18nConfig';

type CategoriesPageProps = {
    params: Promise<{ locale: string; group: string }>;
};

const i18nNamespaces = ['common'];

export async function generateMetadata({
    params,
}: CategoriesPageProps): Promise<Metadata> {
    const { locale } = await params;
    const { t } = await getTranslations(locale, i18nNamespaces);

    return {
        title: t('common:page.group.categories.title'),
        description: t('common:page.group.categories.description'),
        robots: { index: false, follow: false },
    };
}

export default async function CategoriesPage({ params }: CategoriesPageProps) {
    const { locale: localeParam, group: groupSlug } = await params;
    const locale: Language = isValidLocale(localeParam)
        ? localeParam
        : i18nConfig.defaultLocale;

    return (
        <CategoriesPageView
            locale={locale}
            groupSlug={groupSlug}
        />
    );
}
