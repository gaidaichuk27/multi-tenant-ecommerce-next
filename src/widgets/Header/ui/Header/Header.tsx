'use client';

import { Container } from '@/src/shared/ui/Container';
import { useHeaderSticky } from '@hooks/useStickyHeader';
import { useStickyHeaderHeight } from '@hooks/useStickyHeaderHeight';
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
                <Container>header</Container>
            </div>
        </header>
    );
};
