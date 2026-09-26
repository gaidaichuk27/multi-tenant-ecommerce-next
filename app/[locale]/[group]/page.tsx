import type { Metadata } from 'next';
import getTranslations from '@/i18n';
import { isTrpcErrorCode } from '@lib/trpc/errors';
import { getGroupPublic } from '@lib/groups/queries';
import { GroupFeedPageView } from '@views/group/GroupFeedPageView';
import { isValidLocale } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import i18nConfig from '@/i18nConfig';

type GroupFeedPageProps = {
    params: Promise<{ locale: string; group: string }>;
    searchParams: Promise<{ category?: string | string[] }>;
};

const i18nNamespaces = ['common'];

export async function generateMetadata({
    params,
}: GroupFeedPageProps): Promise<Metadata> {
    const { locale, group: groupSlug } = await params;
    const { t } = await getTranslations(locale, i18nNamespaces);

    try {
        const { group } = await getGroupPublic(groupSlug);

        return {
            title: t('common:page.group.feed.title', { name: group.name }),
            description: t('common:page.group.feed.description', {
                name: group.name,
            }),
            robots: { index: false, follow: false },
        };
    } catch (error) {
        if (isTrpcErrorCode(error, 'NOT_FOUND')) {
            return { title: t('common:group.not_found') };
        }

        throw error;
    }
}

export default async function GroupFeedPage({
    params,
    searchParams,
}: GroupFeedPageProps) {
    const { locale: localeParam, group: groupSlug } = await params;
    const locale: Language = isValidLocale(localeParam)
        ? localeParam
        : i18nConfig.defaultLocale;

    const resolvedSearch = await searchParams;
    const rawCategory = resolvedSearch.category;
    const categoryId =
        typeof rawCategory === 'string' && rawCategory.length > 0
            ? rawCategory
            : null;

    return (
        <GroupFeedPageView
            locale={locale}
            groupSlug={groupSlug}
            categoryId={categoryId}
        />
    );
}
