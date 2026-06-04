'use client';

import type { CSSProperties, ReactNode } from 'react';

import { ThemeSelector, ThemeToggle } from '@features/theme';
import { ActiveThemeProvider, ThemeProvider } from '@providers/theme';

/** Matches toolbar row height (py-2 + controls). */
const THEME_TOOLBAR_HEIGHT = '3.5rem';

/**
 * Wraps every story with next-themes (light/dark) + brand themes (themes.css).
 * Toolbar is fixed so Storybook `layout: centered` only affects the story canvas.
 */
export function StorybookThemeDecorator({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
        >
            <ActiveThemeProvider initialTheme="default">
                <div className="bg-background text-foreground relative min-h-screen">
                    <div
                        className="border-border bg-background/95 fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-end gap-2 border-b px-4 backdrop-blur-sm"
                        data-storybook-theme-toolbar
                        style={
                            {
                                '--storybook-theme-toolbar-height':
                                    THEME_TOOLBAR_HEIGHT,
                            } as CSSProperties
                        }
                    >
                        <ThemeToggle />
                        <ThemeSelector />
                    </div>
                    <div
                        className="min-h-screen"
                        style={{
                            paddingTop: THEME_TOOLBAR_HEIGHT,
                        }}
                    >
                        {children}
                    </div>
                </div>
            </ActiveThemeProvider>
        </ThemeProvider>
    );
}
