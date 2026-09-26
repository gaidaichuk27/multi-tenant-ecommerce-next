import { notFound, redirect, unstable_rethrow } from 'next/navigation';
import { CATEGORY_T_MESSAGES } from '@repo/api';
import getTranslations from '@/i18n';
import { getTrpcErrorMessage, isTrpcErrorCode } from '@lib/trpc/errors';
import { listCategories } from '@lib/categories/queries';
import { getMineMembership } from '@lib/groups/queries';
import { listGroupPosts } from '@lib/posts/queries';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { GroupFeedView } from '@views/group/GroupFeedView';

interface GroupFeedPageViewProps {
    locale: Language;
    groupSlug: string;
    categoryId?: string | null;
}

const i18nNamespaces = ['common'];

export async function GroupFeedPageView({
    locale,
    groupSlug,
    categoryId = null,
}: GroupFeedPageViewProps) {
    const { t } = await getTranslations(locale, i18nNamespaces);
    const feedHref = buildLocalizedPathname(`/${groupSlug}`, locale);
    const aboutHref = buildLocalizedPathname(`/${groupSlug}/about`, locale);

    try {
        const [categories, membership] = await Promise.all([
            listCategories(groupSlug),
            getMineMembership(groupSlug),
        ]);

        // Invalid / stale ?category= — strip from the URL instead of silently
        // showing All while the bad query stays in the address bar.
        if (
            categoryId &&
            !categories.some((category) => category.id === categoryId)
        ) {
            redirect(feedHref);
        }

        const activeCategoryId = categoryId;

        const page = await listGroupPosts(
            groupSlug,
            activeCategoryId ? { categoryId: activeCategoryId } : undefined,
        );

        return (
            <GroupFeedView
                locale={locale}
                groupSlug={groupSlug}
                posts={page.items}
                categories={categories}
                activeCategoryId={activeCategoryId}
                viewerUserId={membership?.userId ?? null}
                viewerRole={membership?.role ?? null}
                viewerStatus={membership?.status ?? null}
                labels={{
                    empty: activeCategoryId
                        ? t('common:group.feed.empty_filtered')
                        : t('common:group.feed.empty'),
                    commentsCount: (count) =>
                        t('common:group.feed.comments_count', { count }),
                    pinned: t('common:group.feed.pinned'),
                    allCategories: t('common:group.feed.categories.all'),
                    categoriesNav: t('common:group.feed.categories.nav'),
                    categoryNone: t('common:group.feed.composer.category_none'),
                    categoryLabel: t('common:group.feed.composer.category'),
                }}
            />
        );
    } catch (error) {
        // Preserve Next.js control-flow from redirect()/notFound() inside try.
        unstable_rethrow(error);

        // Category deleted between listCategories and post.list — same UX as L3.
        if (
            categoryId &&
            isTrpcErrorCode(error, 'NOT_FOUND') &&
            getTrpcErrorMessage(error) === CATEGORY_T_MESSAGES.NOT_FOUND
        ) {
            redirect(feedHref);
        }

        if (isTrpcErrorCode(error, 'NOT_FOUND')) {
            notFound();
        }

        if (
            isTrpcErrorCode(error, 'FORBIDDEN') ||
            isTrpcErrorCode(error, 'UNAUTHORIZED')
        ) {
            redirect(aboutHref);
        }

        throw error;
    }
}
