import { DEFAULT_THEMES } from './themeSelector/constants/themes';
import type { Theme } from './themeSelector/types/theme';

const VALID_THEME_VALUES = new Set(DEFAULT_THEMES.map((theme) => theme.value));

export const DEFAULT_THEME: Theme['value'] = 'default';

export function resolveTheme(value?: string): Theme['value'] {
    if (value && VALID_THEME_VALUES.has(value as Theme['value'])) {
        return value as Theme['value'];
    }
    return DEFAULT_THEME;
}

export function getThemeClassName(theme: Theme['value']): string {
    return `theme-${theme}`;
}
