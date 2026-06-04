'use client';

import { useThemeConfig } from '@providers/theme/ActiveThemeProvider';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@shared/ui/Form/Select';
import { Label } from '@shared/ui/Form/Label';
import { DEFAULT_THEMES } from '../constants/themes';

export function ThemeSelector() {
    const { activeTheme, setActiveTheme } = useThemeConfig();

    return (
        <div className="flex items-center gap-2">
            <Label
                htmlFor="theme-selector"
                className="sr-only"
            >
                Theme
            </Label>
            <Select
                value={activeTheme}
                onValueChange={setActiveTheme}
            >
                <SelectTrigger
                    id="theme-selector"
                    className="text-primary justify-start *:data-[slot=select-value]:w-12"
                >
                    <span className="text-muted-foreground hidden sm:block">
                        Select a theme:
                    </span>
                    <span className="text-muted-foreground block sm:hidden">
                        Theme
                    </span>
                    <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent
                    align="end"
                    position="popper"
                >
                    <SelectGroup>
                        <SelectLabel>Default</SelectLabel>
                        {DEFAULT_THEMES.map((theme) => (
                            <SelectItem
                                key={theme.name}
                                value={theme.value}
                            >
                                {theme.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}
