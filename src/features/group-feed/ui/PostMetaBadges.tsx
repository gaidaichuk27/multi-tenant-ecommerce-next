import Link from 'next/link';
import { Pin } from 'lucide-react';
import { buildCategoryFeedHref } from '@lib/categories/urls';
import { cn } from '@lib/utils';

export function PostPinnedBadge({
    label,
    className,
}: {
    label: string;
    className?: string;
}) {
    return (
        <span
            className={cn(
                'border-primary/25 bg-primary/10 text-primary inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs font-medium',
                className,
            )}
        >
            <Pin
                className="size-3 shrink-0"
                aria-hidden
            />
            {label}
        </span>
    );
}

export function PostCategoryBadge({
    feedHref,
    categoryId,
    name,
    className,
}: {
    feedHref: string;
    categoryId: string;
    name: string;
    className?: string;
}) {
    return (
        <Link
            href={buildCategoryFeedHref(feedHref, categoryId)}
            scroll={false}
            className={cn(
                'text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-md px-1.5 py-0.5 text-xs font-medium',
                className,
            )}
        >
            {name}
        </Link>
    );
}
