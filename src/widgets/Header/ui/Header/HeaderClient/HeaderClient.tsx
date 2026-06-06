'use client';

import { memo, ReactNode } from 'react';
import { useHeaderSticky } from '@hooks/useStickyHeader';
import { useStickyHeaderHeight } from '@hooks/useStickyHeaderHeight';
import { cn } from '@lib/utils';

interface HeaderClientProps {
    className?: string;
    children: ReactNode | ReactNode[];
    isSticky?: boolean;
}

export const HeaderClient = memo(
    ({ className, children, isSticky = true }: HeaderClientProps) => {
        useHeaderSticky(isSticky);
        useStickyHeaderHeight();
        return (
            <header className={cn(className, 'js-header header')}>
                {children}
            </header>
        );
    },
);

HeaderClient.displayName = 'HeaderClient';
