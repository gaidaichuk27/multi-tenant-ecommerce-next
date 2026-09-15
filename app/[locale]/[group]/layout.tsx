import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import getTranslations from '@/i18n';
import { isTrpcErrorCode } from '@lib/trpc/errors';
import { requireAuthSession } from '@lib/auth/require-auth-session';
import { getGroupPublic } from '@lib/groups/queries';
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

    if (isGroupAboutPath(pathname, groupSlug)) {
        return children;
    }

    const { t } = await getTranslations(locale, i18nNamespaces);

    await requireAuthSession(
        locale,
        buildLocalizedPathname(`/${groupSlug}`, locale),
    );

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

    if (!viewerMembership || viewerMembership.status !== 'active') {
        redirect(buildLocalizedPathname(`/${groupSlug}/about`, locale));
    }

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
            }}
        >
            {children}
        </GroupShellView>
    );
}
