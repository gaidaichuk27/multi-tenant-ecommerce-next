import { notFound, redirect } from 'next/navigation';
import { isGroupAdminRole } from '@repo/api';
import getTranslations from '@/i18n';
import { isTrpcErrorCode } from '@lib/trpc/errors';
import { listCategories } from '@lib/categories/queries';
import { getMineMembership } from '@lib/groups/queries';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { CategoriesListView } from '@views/group/CategoriesListView';

interface CategoriesPageViewProps {
    locale: Language;
    groupSlug: string;
}

const i18nNamespaces = ['common'];

export async function CategoriesPageView({
    locale,
    groupSlug,
}: CategoriesPageViewProps) {
    const { t } = await getTranslations(locale, i18nNamespaces);

    let categories;
    let membership;

    try {
        [categories, membership] = await Promise.all([
            listCategories(groupSlug),
            getMineMembership(groupSlug),
        ]);
    } catch (error) {
        if (isTrpcErrorCode(error, 'NOT_FOUND')) {
            notFound();
        }

        if (
            isTrpcErrorCode(error, 'FORBIDDEN') ||
            isTrpcErrorCode(error, 'UNAUTHORIZED')
        ) {
            redirect(buildLocalizedPathname(`/${groupSlug}`, locale));
        }

        throw error;
    }

    if (!isGroupAdminRole(membership?.role)) {
        redirect(buildLocalizedPathname(`/${groupSlug}`, locale));
    }

    return (
        <CategoriesListView
            groupSlug={groupSlug}
            title={t('common:group.categories.title')}
            emptyLabel={t('common:group.categories.empty')}
            hintLabel={t('common:group.categories.hint')}
            renameLabel={t('common:group.categories.rename')}
            saveLabel={t('common:group.categories.save')}
            cancelLabel={t('common:modal.cancel')}
            deleteLabel={t('common:group.categories.delete')}
            moveUpLabel={t('common:group.categories.move_up')}
            moveDownLabel={t('common:group.categories.move_down')}
            categories={categories}
        />
    );
}
