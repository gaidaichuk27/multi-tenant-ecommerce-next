import type { Metadata } from 'next';
import getTranslations from '@/i18n';
import { isTrpcErrorCode } from '@lib/trpc/errors';
import { getGroupPublic } from '@lib/groups/queries';
import { GroupPostPageView } from '@views/group/GroupPostPageView';
import { isValidLocale } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import i18nConfig from '@/i18nConfig';

type GroupPostPageProps = {
    params: Promise<{ locale: string; group: string; postId: string }>;
};

const i18nNamespaces = ['common'];

export async function generateMetadata({
    params,
}: GroupPostPageProps): Promise<Metadata> {
    const { locale, group: groupSlug } = await params;
    const { t } = await getTranslations(locale, i18nNamespaces);

    try {
        const { group } = await getGroupPublic(groupSlug);

        return {
            title: t('common:page.group.post.title', { name: group.name }),
            description: t('common:page.group.post.description', {
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

export default async function GroupPostPage({ params }: GroupPostPageProps) {
    const { locale: localeParam, group: groupSlug, postId } = await params;
    const locale: Language = isValidLocale(localeParam)
        ? localeParam
        : i18nConfig.defaultLocale;

    return (
        <GroupPostPageView
            locale={locale}
            groupSlug={groupSlug}
            postId={postId}
        />
    );
}
