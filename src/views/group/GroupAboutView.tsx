import Link from 'next/link';
import type { Group } from '@entities/Group';
import type { Membership } from '@entities/Membership';
import { JoinGroupActions } from '@features/join-group';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { SectionHeader } from '@shared/ui/Typography';
import { cn } from '@lib/utils';

interface GroupAboutViewProps {
    className?: string;
    locale: Language;
    group: Group;
    memberCount: number;
    viewerMembership: Membership | null;
    isAuthenticated: boolean;
    labels: {
        join: string;
        requestJoin: string;
        pending: string;
        openCommunity: string;
        leave: string;
        loginToJoin: string;
        banned: string;
        visibility: string;
        members: string;
        backToApp: string;
    };
}

export function GroupAboutView({
    className,
    locale,
    group,
    memberCount,
    viewerMembership,
    isAuthenticated,
    labels,
}: GroupAboutViewProps) {
    // Active members get title + GroupNav from GroupShellView (layout).
    const showStandaloneChrome = viewerMembership?.status !== 'active';

    return (
        <div
            className={cn(
                showStandaloneChrome && 'mx-auto w-full max-w-3xl p-6',
                className,
            )}
        >
            {showStandaloneChrome ? (
                <SectionHeader
                    title={group.name}
                    subTitle={group.description ?? undefined}
                    className="mb-6"
                />
            ) : null}

            <dl className="mb-6 grid gap-2 text-sm">
                <div>
                    <dt className="text-muted-foreground inline">
                        {labels.visibility}:{' '}
                    </dt>
                    <dd className="inline capitalize">{group.visibility}</dd>
                </div>
                <div>
                    <dt className="text-muted-foreground inline">
                        {labels.members}:{' '}
                    </dt>
                    <dd className="inline">{memberCount}</dd>
                </div>
                <div>
                    <dt className="text-muted-foreground inline">URL: </dt>
                    <dd className="inline">/{group.slug}</dd>
                </div>
            </dl>

            <div className="flex flex-wrap items-center gap-3">
                <JoinGroupActions
                    locale={locale}
                    group={group}
                    viewerMembership={viewerMembership}
                    isAuthenticated={isAuthenticated}
                    labels={{
                        join: labels.join,
                        requestJoin: labels.requestJoin,
                        pending: labels.pending,
                        openCommunity: labels.openCommunity,
                        leave: labels.leave,
                        loginToJoin: labels.loginToJoin,
                        banned: labels.banned,
                    }}
                />
                <Link
                    href={buildLocalizedPathname('/app', locale)}
                    className="border-border inline-flex rounded-md border px-4 py-2 text-sm"
                >
                    {labels.backToApp}
                </Link>
            </div>
        </div>
    );
}
