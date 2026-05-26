export enum ThemeNames {
    DEFAULT = 'Default',
    NEO_BRUTALISM = 'Neo Brutalism',
    BUBBLE_GUM = 'Bubble Gum',
}

export const Themes = {
    [ThemeNames.DEFAULT]: 'default',
    [ThemeNames.NEO_BRUTALISM]: 'neo-brutalism',
    [ThemeNames.BUBBLE_GUM]: 'bubble-gum',
} as const;

export type Theme = {
    [K in keyof typeof Themes]: {
        name: K;
        value: (typeof Themes)[K];
    };
}[keyof typeof Themes];
