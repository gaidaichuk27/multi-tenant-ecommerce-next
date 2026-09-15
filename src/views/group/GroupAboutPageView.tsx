import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import getTranslations from '@/i18n';
import type { GroupPublic } from '@entities/Group';
import { isTrpcErrorCode } from '@lib/trpc/errors';
import { getAuthSession } from '@lib/auth/session';
import { getGroupPublic } from '@lib/groups/queries';
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
    const session = await getAuthSession(await headers());

    let publicGroup: GroupPublic;

    try {
        publicGroup = await getGroupPublic(groupSlug);
    } catch (error) {
        if (isTrpcErrorCode(error, 'NOT_FOUND')) {
            notFound();
        }

        throw error;
    }

    const about = (
        <GroupAboutView
            locale={locale}
            group={publicGroup.group}
            memberCount={publicGroup.memberCount}
            viewerMembership={publicGroup.viewerMembership}
            isAuthenticated={Boolean(session?.user)}
            labels={{
                join: t('common:group.about.join_cta'),
                requestJoin: t('common:group.about.request_join'),
                pending: t('common:group.about.pending'),
                openCommunity: t('common:group.about.open_community'),
                leave: t('common:group.about.leave'),
                loginToJoin: t('common:group.about.login_to_join'),
                banned: t('common:group.about.banned'),
                visibility: t('common:group.about.visibility'),
                members: t('common:group.about.members_count'),
                backToApp: t('common:app.back_to_app'),
            }}
        />
    );

    // Active members already sit inside GroupShellView → MainLayout.
    if (publicGroup.viewerMembership?.status === 'active') {
        return about;
    }

    const Layouted = WithMainLayout(() => about);

    return <Layouted />;
}
