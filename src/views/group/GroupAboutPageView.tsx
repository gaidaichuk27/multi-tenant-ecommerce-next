import { notFound } from 'next/navigation';
import getTranslations from '@/i18n';
import type { Group } from '@entities/Group';
import { isTrpcErrorCode } from '@lib/trpc/errors';
import { getGroupBySlug } from '@lib/groups/queries';
import { WithMainLayout } from '@hocs/WithMainLayout';
import type { Language } from '@shared/config/locales/types';
import { GroupAboutView } from '@views/group/GroupAboutView';

interface GroupAboutPageViewProps {
    locale: Language;
    groupSlug: string;
}

const i18nNamespaces = ['common'];

export async function GroupAboutPageView({
    locale,
    groupSlug,
}: GroupAboutPageViewProps) {
    const { t } = await getTranslations(locale, i18nNamespaces);

    let group: Group;

    try {
        group = await getGroupBySlug(groupSlug);
    } catch (error) {
        if (isTrpcErrorCode(error, 'NOT_FOUND')) {
            notFound();
        }

        throw error;
    }

    const Layouted = WithMainLayout(() => (
        <GroupAboutView
            locale={locale}
            group={group}
            labels={{
                joinCta: t('common:group.about.join_cta'),
                visibility: t('common:group.about.visibility'),
                backToApp: t('common:app.back_to_app'),
            }}
        />
    ));

    return <Layouted />;
}
