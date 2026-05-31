'use client';

import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useLayoutEffect,
    useState,
} from 'react';
import type { Theme } from '@features/theme';
import { resolveTheme } from '@features/theme';
import { cookieService } from '@services/cookieService';

const COOKIE_THEME = 'active_theme';

type ThemeContextType = {
    activeTheme: Theme['value'];
    setActiveTheme: (theme: Theme['value']) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyThemeClass(theme: Theme['value']) {
    Array.from(document.body.classList)
        .filter((className) => className.startsWith('theme-'))
        .forEach((className) => {
            document.body.classList.remove(className);
        });
    document.body.classList.add(`theme-${theme}`);
}

export function ActiveThemeProvider({
    children,
    initialTheme,
}: {
    children: ReactNode;
    initialTheme?: Theme['value'];
}) {
    const resolvedInitialTheme = resolveTheme(initialTheme);
    const [activeTheme, setActiveThemeState] =
        useState<Theme['value']>(resolvedInitialTheme);

    useLayoutEffect(() => {
        applyThemeClass(activeTheme);
    }, [activeTheme]);

    const setActiveTheme = useCallback((theme: Theme['value']) => {
        const nextTheme = resolveTheme(theme);
        setActiveThemeState(nextTheme);
        cookieService.set(COOKIE_THEME, nextTheme);
    }, []);

    return (
        <ThemeContext.Provider value={{ activeTheme, setActiveTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeConfig() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error(
            'useThemeConfig must be used within an ActiveThemeProvider',
        );
    }
    return context;
}
