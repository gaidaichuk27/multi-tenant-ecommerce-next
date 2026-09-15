import { notFound, redirect } from 'next/navigation';
import getTranslations from '@/i18n';
import { isTrpcErrorCode } from '@lib/trpc/errors';
import { listGroupMembers } from '@lib/membership/queries';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { MembersListView } from '@views/group/MembersListView';

interface MembersPageViewProps {
    locale: Language;
    groupSlug: string;
}

const i18nNamespaces = ['common'];

export async function MembersPageView({
    locale,
    groupSlug,
}: MembersPageViewProps) {
    const { t } = await getTranslations(locale, i18nNamespaces);

    let page;

    try {
        page = await listGroupMembers(groupSlug);
    } catch (error) {
        if (isTrpcErrorCode(error, 'NOT_FOUND')) {
            notFound();
        }

        if (
            isTrpcErrorCode(error, 'FORBIDDEN') ||
            isTrpcErrorCode(error, 'UNAUTHORIZED')
        ) {
            redirect(buildLocalizedPathname(`/${groupSlug}/about`, locale));
        }

        throw error;
    }

    return (
        <MembersListView
            title={t('common:group.members.title')}
            emptyLabel={t('common:group.members.empty')}
            members={page.items}
        />
    );
}
