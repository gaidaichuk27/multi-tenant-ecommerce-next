'use client';

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { useThemeConfig } from '@providers/theme/ActiveThemeProvider';
import { colorGroups, type ColorToken } from './colors.schema';

const ThemeScopeContext = React.createContext<HTMLElement | null>(null);

function useThemeScope() {
    return React.useContext(ThemeScopeContext);
}

function useCssVariable(cssVar: string) {
    const scope = useThemeScope();
    const [value, setValue] = React.useState('');

    React.useLayoutEffect(() => {
        if (!scope) return;

        const read = () => {
            setValue(getComputedStyle(scope).getPropertyValue(cssVar).trim());
        };

        read();

        const observer = new MutationObserver(read);
        observer.observe(scope, {
            attributes: true,
            attributeFilter: ['class', 'style'],
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class', 'style'],
        });

        return () => observer.disconnect();
    }, [cssVar, scope]);

    return value;
}

function ColorSwatchPreview({ token }: { token: ColorToken }) {
    const textVar = token.sampleTextVar ?? '--foreground';

    return (
        <div
            className="flex min-h-20 items-center justify-center px-4 py-5"
            style={{
                backgroundColor: `var(${token.cssVar})`,
                color: `var(${textVar})`,
            }}
        >
            <span className="text-lg font-semibold">Aa</span>
        </div>
    );
}

function ColorSwatch({ token }: { token: ColorToken }) {
    const resolved = useCssVariable(token.cssVar);

    return (
        <div className="border-border flex flex-col overflow-hidden rounded-lg border">
            <ColorSwatchPreview token={token} />
            <div
                className="space-y-1 border-t p-3 text-xs"
                style={{
                    backgroundColor: 'var(--card)',
                    color: 'var(--card-foreground)',
                }}
            >
                <p className="font-medium">{token.name}</p>
                <p
                    className="font-mono opacity-80"
                    style={{ color: 'var(--muted-foreground)' }}
                >
                    {token.cssVar}
                </p>
                {token.tailwindClass ? (
                    <p
                        className="font-mono opacity-80"
                        style={{ color: 'var(--muted-foreground)' }}
                    >
                        {token.tailwindClass}
                    </p>
                ) : null}
                {resolved ? (
                    <p
                        className="font-mono break-all opacity-80"
                        style={{ color: 'var(--muted-foreground)' }}
                    >
                        {resolved}
                    </p>
                ) : (
                    <p
                        className="font-mono opacity-60"
                        style={{ color: 'var(--muted-foreground)' }}
                    >
                        (inherits from theme scope)
                    </p>
                )}
            </div>
        </div>
    );
}

function ThemedColorsLayout({ children }: { children: React.ReactNode }) {
    const [scope, setScope] = React.useState<HTMLElement | null>(null);
    const { activeTheme } = useThemeConfig();

    return (
        <ThemeScopeContext.Provider value={scope}>
            <div
                ref={setScope}
                className={`theme-${activeTheme} bg-background text-foreground min-h-screen p-6 md:p-10`}
            >
                {children}
            </div>
        </ThemeScopeContext.Provider>
    );
}

function ColorPalette() {
    return (
        <ThemedColorsLayout>
            <header className="mb-10 max-w-3xl space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Color schema
                </h1>
                <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--muted-foreground)' }}
                >
                    Semantic tokens from{' '}
                    <code className="text-foreground">globals.css</code> and{' '}
                    <code className="text-foreground">themes.css</code>. Brand
                    theme is applied on <code>body</code> (same as the app). Use
                    the theme toolbar above (light/dark + brand theme).
                </p>
            </header>

            <div className="space-y-12">
                {colorGroups.map((group) => (
                    <section
                        key={group.title}
                        className="space-y-4"
                    >
                        <div>
                            <h2 className="text-lg font-medium">
                                {group.title}
                            </h2>
                            {group.description ? (
                                <p
                                    className="mt-1 text-sm"
                                    style={{ color: 'var(--muted-foreground)' }}
                                >
                                    {group.description}
                                </p>
                            ) : null}
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {group.tokens.map((token) => (
                                <ColorSwatch
                                    key={token.cssVar}
                                    token={token}
                                />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </ThemedColorsLayout>
    );
}

function ContrastPairs() {
    const pairs = colorGroups
        .flatMap((g) => g.tokens)
        .filter(
            (t) =>
                t.sampleTextVar &&
                t.sampleTextVar !== '--foreground' &&
                !t.cssVar.startsWith('--chart'),
        );

    return (
        <ThemedColorsLayout>
            <header className="mb-8 space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Foreground pairs
                </h1>
                <p
                    className="text-sm"
                    style={{ color: 'var(--muted-foreground)' }}
                >
                    Same swatches as the palette — background fill with paired
                    text color.
                </p>
            </header>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {pairs.map((token) => (
                    <ColorSwatch
                        key={token.cssVar}
                        token={token}
                    />
                ))}
            </div>
        </ThemedColorsLayout>
    );
}

const meta = {
    title: 'Design System/Colors',
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Semantic color tokens (CSS variables) used across the app. Use the Storybook theme toolbar for light/dark and brand themes.',
            },
        },
    },
    tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Palette: Story = {
    render: () => <ColorPalette />,
};

export const ForegroundPairs: Story = {
    render: () => <ContrastPairs />,
};
