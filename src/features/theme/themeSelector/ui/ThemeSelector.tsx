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
import { cn } from '@lib/utils';
import { useTranslation } from 'react-i18next';

export function ThemeSelector({ className }: { className?: string }) {
    const { activeTheme, setActiveTheme } = useThemeConfig();
    const { t } = useTranslation();

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <Label
                htmlFor="theme-selector"
                className="sr-only"
            >
                {t('theme.theme')}
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
                        {t('theme.select')}
                    </span>
                    <span className="text-muted-foreground block sm:hidden">
                        {t('theme.select')}
                    </span>
                    <SelectValue placeholder={t('theme.select')} />
                </SelectTrigger>
                <SelectContent
                    align="end"
                    position="popper"
                >
                    <SelectGroup>
                        <SelectLabel>{t('theme.default')}</SelectLabel>
                        {DEFAULT_THEMES.map((theme) => (
                            <SelectItem
                                key={theme.name}
                                value={theme.value}
                            >
                                {t(`theme.${theme.value}`)}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}
