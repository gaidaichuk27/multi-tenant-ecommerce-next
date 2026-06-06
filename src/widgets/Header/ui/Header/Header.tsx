import { memo } from 'react';
import { LangSelector } from '@features/langSelector';
import { ThemeSelector, ThemeToggle } from '@features/theme';
import { Logo } from '@shared/ui/Logo';
import { HeaderClient } from './HeaderClient';

interface HeaderProps {
    className?: string;
    isSticky?: boolean;
}

export const Header = memo(({ isSticky = true }: HeaderProps) => {
    return (
        <HeaderClient isSticky={isSticky}>
            <div className="header__inner">
                <div className="header__top">
                    <Logo />

                    <div className="ml-auto flex gap-1.5">
                        <LangSelector slim />
                        <ThemeToggle />
                        <ThemeSelector />
                    </div>
                </div>
            </div>
            <div className="header__backdrop"></div>
        </HeaderClient>
    );
});

Header.displayName = 'Header';
