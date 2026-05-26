'use client';

import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';
import type { Theme } from '@features/theme/themeSelector';
import { cookieService } from '@services/cookieService';

const COOKIE_THEME = 'active_theme';
const DEFAULT_THEME = 'default';

type ThemeContextType = {
    activeTheme: Theme['value'];
    setActiveTheme: (theme: Theme['value']) => void;
};

const setThemeCookie = (theme: Theme['value']) => {
    cookieService.set(COOKIE_THEME, theme);
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ActiveThemeProvider({
    children,
    initialTheme,
}: {
    children: ReactNode;
    initialTheme?: Theme['value'];
}) {
    const [activeTheme, setActiveTheme] = useState<Theme['value']>(
        () => initialTheme || DEFAULT_THEME,
    );

    useEffect(() => {
        Array.from(document.body.classList)
            .filter((className) => className.startsWith('theme-'))
            .forEach((className) => {
                document.body.classList.remove(className);
            });
        document.body.classList.add(`theme-${activeTheme}`);

        setThemeCookie(activeTheme);
    }, [activeTheme]);

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
