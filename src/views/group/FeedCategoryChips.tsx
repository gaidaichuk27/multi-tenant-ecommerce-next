import Link from 'next/link';
import type { CategoryDto } from '@repo/api';
import { buildCategoryFeedHref } from '@lib/categories/urls';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { cn } from '@lib/utils';

interface FeedCategoryChipsProps {
    locale: Language;
    groupSlug: string;
    categories: CategoryDto[];
    activeCategoryId: string | null;
    allLabel: string;
    /** Accessible name for the filter nav (not the "All" chip label). */
    navLabel: string;
}

export function FeedCategoryChips({
    locale,
    groupSlug,
    categories,
    activeCategoryId,
    allLabel,
    navLabel,
}: FeedCategoryChipsProps) {
    if (categories.length === 0) {
        return null;
    }

    const baseHref = buildLocalizedPathname(`/${groupSlug}`, locale);

    const chipClass = (active: boolean) =>
        cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            active
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:text-foreground',
        );

    return (
        <nav
            className="flex flex-wrap gap-2"
            aria-label={navLabel}
        >
            <Link
                href={baseHref}
                scroll={false}
                className={chipClass(activeCategoryId === null)}
            >
                {allLabel}
            </Link>
            {categories.map((category) => (
                <Link
                    key={category.id}
                    href={buildCategoryFeedHref(baseHref, category.id)}
                    scroll={false}
                    className={chipClass(activeCategoryId === category.id)}
                >
                    {category.name}
                </Link>
            ))}
        </nav>
    );
}
