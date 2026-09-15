import type { Metadata } from 'next';
import getTranslations from '@/i18n';
import { MembersPageView } from '@views/group/MembersPageView';
import { isValidLocale } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import i18nConfig from '@/i18nConfig';

type MembersPageProps = {
    params: Promise<{ locale: string; group: string }>;
};

const i18nNamespaces = ['common'];

export async function generateMetadata({
    params,
}: MembersPageProps): Promise<Metadata> {
    const { locale } = await params;
    const { t } = await getTranslations(locale, i18nNamespaces);

    return {
        title: t('common:page.group.members.title'),
        description: t('common:page.group.members.description'),
        robots: { index: false, follow: false },
    };
}

export default async function MembersPage({ params }: MembersPageProps) {
    const { locale: localeParam, group: groupSlug } = await params;
    const locale: Language = isValidLocale(localeParam)
        ? localeParam
        : i18nConfig.defaultLocale;

    return (
        <MembersPageView
            locale={locale}
            groupSlug={groupSlug}
        />
    );
}
