import Link from 'next/link';
import type { Group } from '@entities/Group';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { SectionHeader } from '@shared/ui/Typography';
import { cn } from '@lib/utils';

interface GroupAboutViewProps {
    className?: string;
    locale: Language;
    group: Group;
    labels: {
        joinCta: string;
        visibility: string;
        backToApp: string;
    };
}

export function GroupAboutView({
    className,
    locale,
    group,
    labels,
}: GroupAboutViewProps) {
    return (
        <div className={cn('mx-auto w-full max-w-3xl p-6', className)}>
            <SectionHeader
                title={group.name}
                subTitle={group.description ?? undefined}
                className="mb-6"
            />

            <dl className="mb-6 grid gap-2 text-sm">
                <div>
                    <dt className="text-muted-foreground inline">
                        {labels.visibility}:{' '}
                    </dt>
                    <dd className="inline capitalize">{group.visibility}</dd>
                </div>
                <div>
                    <dt className="text-muted-foreground inline">URL: </dt>
                    <dd className="inline">/{group.slug}</dd>
                </div>
            </dl>

            <div className="flex gap-3">
                <Link
                    href={buildLocalizedPathname('/login', locale)}
                    className="bg-primary text-primary-foreground inline-flex rounded-md px-4 py-2 text-sm font-medium"
                >
                    {labels.joinCta}
                </Link>
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
