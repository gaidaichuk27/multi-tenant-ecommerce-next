import type { Metadata } from 'next';
import getTranslations from '@/i18n';
import { CreateGroupView } from '@views/create/CreateGroupView';
import { isValidLocale } from '@shared/config/locales/locale';
import { Language } from '@shared/config/locales/types';
import i18nConfig from '@/i18nConfig';

type CreatePageProps = {
    params: Promise<{ locale: string }>;
};

const i18nNamespaces = ['common'];

export async function generateMetadata({
    params,
}: CreatePageProps): Promise<Metadata> {
    const { locale } = await params;
    const { t } = await getTranslations(locale, i18nNamespaces);

    return {
        title: t('common:page.create.title'),
        description: t('common:page.create.description'),
        robots: { index: false, follow: false },
    };
}

export default async function CreatePage({ params }: CreatePageProps) {
    const { locale: localeParam } = await params;
    const locale: Language = isValidLocale(localeParam)
        ? localeParam
        : i18nConfig.defaultLocale;
    return <CreateGroupView locale={locale} />;
}
