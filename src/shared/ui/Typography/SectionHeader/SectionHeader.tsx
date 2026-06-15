import { type ReactNode } from 'react';

import { Typography } from '@shared/ui/Typography';

import { cn } from '@lib/utils';

interface SectionHeaderProps {
    className?: string;
    title?: string;
    subTitle?: string | ReactNode;
    color?: string;
    titleClassName?: string;
    subTitleClassName?: string;
    align?: 'left' | 'right' | 'center';
    hasBottomMargin?: boolean;
}

export const SectionHeader = ({
    className,
    title,
    subTitle,
    color = 'var(--primary)',
    titleClassName,
    subTitleClassName,
    hasBottomMargin = true,
    align = 'center',
}: SectionHeaderProps) => {
    if (!title && !subTitle) return;

    const subTitleContent =
        typeof subTitle === 'string' ? (
            <Typography
                variant="title-5"
                weight={400}
                style={{ color: 'var(--muted-foreground)' }}
                className={subTitleClassName}
                align={align}
            >
                {subTitle}
            </Typography>
        ) : (
            subTitle
        );

    return (
        <div
            className={cn(
                'flex flex-col gap-2',
                className,
                hasBottomMargin ? 'mb-14' : 'mb-0',
            )}
        >
            <Typography
                variant="title-1"
                weight={500}
                style={{ color }}
                className={titleClassName}
                align={align}
            >
                {title}
            </Typography>
            {subTitleContent}
        </div>
    );
};
