import Link from 'next/link';
import type { GroupWithRole } from '@entities/Group';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { SectionHeader } from '@shared/ui/Typography';
import { cn } from '@lib/utils';

interface AppDashboardProps {
    className?: string;
    locale: Language;
    groups: GroupWithRole[];
    labels: {
        welcome: string;
        myGroups: string;
        noGroups: string;
        createLink: string;
        createAnother: string;
    };
}

export function AppDashboard({
    className,
    locale,
    groups,
    labels,
}: AppDashboardProps) {
    const createPath = buildLocalizedPathname('/create', locale);

    return (
        <div className={cn('mx-auto w-full max-w-3xl p-6', className)}>
            <SectionHeader
                title={labels.welcome}
                subTitle={labels.myGroups}
                className="mb-6"
            />

            {groups.length === 0 ? (
                <div className="flex flex-col gap-4">
                    <p>{labels.noGroups}</p>
                    <Link
                        href={createPath}
                        className="text-primary underline"
                    >
                        {labels.createLink}
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <ul className="flex flex-col gap-3">
                        {groups.map((group) => (
                            <li
                                key={group.id}
                                className="border-border rounded-lg border p-4"
                            >
                                <Link
                                    href={buildLocalizedPathname(
                                        `/${group.slug}/about`,
                                        locale,
                                    )}
                                    className="font-medium hover:underline"
                                >
                                    {group.name}
                                </Link>
                                <p className="text-muted-foreground text-sm">
                                    /{group.slug} · {group.role}
                                </p>
                            </li>
                        ))}
                    </ul>
                    <Link
                        href={createPath}
                        className="text-primary underline"
                    >
                        {labels.createAnother}
                    </Link>
                </div>
            )}
        </div>
    );
}
