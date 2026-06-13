import { memo } from 'react';
import { LangSelector } from '@features/langSelector';
import { ThemeSelector, ThemeToggle } from '@features/theme';
import { Logo } from '@shared/ui/Logo';
import { HeaderClient } from './HeaderClient';
import { SettingsDrawer } from '@widgets/Navigation';

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

                    <div className="ml-auto flex items-center gap-1.5">
                        <LangSelector
                            slim
                            className="hidden lg:block"
                        />
                        <ThemeToggle className="hidden lg:block" />
                        <ThemeSelector className="hidden lg:block" />
                        <SettingsDrawer />
                    </div>
                </div>
            </div>
            <div className="header__backdrop"></div>
        </HeaderClient>
    );
});

Header.displayName = 'Header';
