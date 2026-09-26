'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { cn } from '@lib/utils';

export type GroupNavLabels = {
    community: string;
    about: string;
    members: string;
    pending: string;
    reports: string;
    categories: string;
};

interface GroupNavProps {
    className?: string;
    locale: Language;
    groupSlug: string;
    showPending: boolean;
    showReports: boolean;
    showCategories: boolean;
    labels: GroupNavLabels;
}

export function GroupNav({
    className,
    locale,
    groupSlug,
    showPending,
    showReports,
    showCategories,
    labels,
}: GroupNavProps) {
    const pathname = usePathname();

    const items = [
        {
            href: buildLocalizedPathname(`/${groupSlug}`, locale),
            label: labels.community,
            match: (path: string) => {
                const segments = path.split('/').filter(Boolean);
                return (
                    segments[1] === groupSlug &&
                    (segments.length === 2 || segments[2] === undefined)
                );
            },
        },
        {
            href: buildLocalizedPathname(`/${groupSlug}/about`, locale),
            label: labels.about,
            match: (path: string) => path.includes(`/${groupSlug}/about`),
        },
        {
            href: buildLocalizedPathname(`/${groupSlug}/-/members`, locale),
            label: labels.members,
            match: (path: string) => path.includes(`/${groupSlug}/-/members`),
        },
        ...(showPending
            ? [
                  {
                      href: buildLocalizedPathname(
                          `/${groupSlug}/-/pending`,
                          locale,
                      ),
                      label: labels.pending,
                      match: (path: string) =>
                          path.includes(`/${groupSlug}/-/pending`),
                  },
              ]
            : []),
        ...(showReports
            ? [
                  {
                      href: buildLocalizedPathname(
                          `/${groupSlug}/-/reports`,
                          locale,
                      ),
                      label: labels.reports,
                      match: (path: string) =>
                          path.includes(`/${groupSlug}/-/reports`),
                  },
              ]
            : []),
        ...(showCategories
            ? [
                  {
                      href: buildLocalizedPathname(
                          `/${groupSlug}/-/categories`,
                          locale,
                      ),
                      label: labels.categories,
                      match: (path: string) =>
                          path.includes(`/${groupSlug}/-/categories`),
                  },
              ]
            : []),
    ];

    return (
        <nav
            className={cn(
                'border-border mb-6 flex flex-wrap gap-1 border-b',
                className,
            )}
            aria-label={labels.community}
        >
            {items.map((item) => {
                const isActive = item.match(pathname);

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'px-3 py-2 text-sm font-medium transition-colors',
                            isActive
                                ? 'border-primary text-foreground border-b-2'
                                : 'text-muted-foreground hover:text-foreground',
                        )}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
