import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import getTranslations from '@/i18n';
import { isTrpcErrorCode } from '@lib/trpc/errors';
import { requireAuthSession } from '@lib/auth/require-auth-session';
import { getGroupPublic } from '@lib/groups/queries';
import { HardRedirect } from '@lib/navigation/HardRedirect';
import {
    buildLocalizedPathname,
    isValidLocale,
} from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import i18nConfig from '@/i18nConfig';
import { GroupShellView } from '@views/group/GroupShellView';

type GroupLayoutProps = {
    children: React.ReactNode;
    params: Promise<{ locale: string; group: string }>;
};

const i18nNamespaces = ['common'];

function isGroupAboutPath(pathname: string, groupSlug: string): boolean {
    const segments = pathname.split('/').filter(Boolean);
    return segments[1] === groupSlug && segments[2] === 'about';
}

export default async function GroupLayout({
    children,
    params,
}: GroupLayoutProps) {
    const { locale: localeParam, group: groupSlug } = await params;
    const locale: Language = isValidLocale(localeParam)
        ? localeParam
        : i18nConfig.defaultLocale;

    const pathname = (await headers()).get('x-current-path') ?? '';
    const isAbout = isGroupAboutPath(pathname, groupSlug);

    let publicGroup;

    try {
        publicGroup = await getGroupPublic(groupSlug);
    } catch (error) {
        if (isTrpcErrorCode(error, 'NOT_FOUND')) {
            notFound();
        }

        throw error;
    }

    const { group, viewerMembership } = publicGroup;
    const isActiveMember = viewerMembership?.status === 'active';

    // About stays reachable without auth. Active members still use the shell so
    // soft-nav to /-/members keeps GroupNav (layout tree must not switch shape).
    if (isAbout && !isActiveMember) {
        return children;
    }

    if (!isAbout) {
        await requireAuthSession(
            locale,
            buildLocalizedPathname(`/${groupSlug}`, locale),
        );

        if (!isActiveMember || !viewerMembership) {
            return (
                <HardRedirect
                    href={buildLocalizedPathname(`/${groupSlug}/about`, locale)}
                />
            );
        }
    }

    if (!viewerMembership || !isActiveMember) {
        return children;
    }

    const { t } = await getTranslations(locale, i18nNamespaces);

    return (
        <GroupShellView
            locale={locale}
            group={group}
            membership={viewerMembership}
            navLabels={{
                community: t('common:group.nav.community'),
                about: t('common:group.nav.about'),
                members: t('common:group.nav.members'),
                pending: t('common:group.nav.pending'),
                reports: t('common:group.nav.reports'),
                categories: t('common:group.nav.categories'),
            }}
        >
            {children}
        </GroupShellView>
    );
}
