import type { Metadata } from 'next';
import getTranslations from '@/i18n';
import { isTrpcErrorCode } from '@lib/trpc/errors';
import { getGroupBySlug } from '@lib/groups/queries';
import { GroupAboutPageView } from '@views/group/GroupAboutPageView';
import { isValidLocale } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import i18nConfig from '@/i18nConfig';

type GroupAboutPageProps = {
    params: Promise<{ locale: string; group: string }>;
};

const i18nNamespaces = ['common'];

export async function generateMetadata({
    params,
}: GroupAboutPageProps): Promise<Metadata> {
    const { locale, group: groupSlug } = await params;
    const { t } = await getTranslations(locale, i18nNamespaces);

    try {
        const group = await getGroupBySlug(groupSlug);

        return {
            title: t('common:page.group.about.title', { name: group.name }),
            description:
                group.description ??
                t('common:page.group.about.description', { name: group.name }),
        };
    } catch (error) {
        if (isTrpcErrorCode(error, 'NOT_FOUND')) {
            return { title: t('common:group.not_found') };
        }

        throw error;
    }
}

export default async function GroupAboutPage({ params }: GroupAboutPageProps) {
    const { locale: localeParam, group: groupSlug } = await params;
    const locale: Language = isValidLocale(localeParam)
        ? localeParam
        : i18nConfig.defaultLocale;

    return (
        <GroupAboutPageView
            locale={locale}
            groupSlug={groupSlug}
        />
    );
}
