'use client';

import { useHeaderSticky } from '@hooks/useStickyHeader';
import { useStickyHeaderHeight } from '@hooks/useStickyHeaderHeight';
import { ThemeSelector, ThemeToggle } from '@features/theme';
import { cn } from '@lib/utils';

interface HeaderProps {
    className?: string;
    isSticky?: boolean;
}

export const Header = ({ className, isSticky = true }: HeaderProps) => {
    useHeaderSticky(isSticky);
    useStickyHeaderHeight();

    return (
        <header className={cn(className, 'js-header header')}>
            <div className="header__inner">
                <div className="ml-auto flex gap-1.5">
                    <ThemeToggle />
                    <ThemeSelector />
                </div>
            </div>
            <div className="header__backdrop"></div>
        </header>
    );
};
