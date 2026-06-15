'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { cn } from '@lib/utils';
import { Button } from '@shared/ui/Form/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@shared/ui/Form/Dropdown';
import { useTranslation } from 'react-i18next';

export function ThemeToggle({ className }: { className?: string }) {
    const { setTheme } = useTheme();
    const { t } = useTranslation();

    return (
        <div className={cn(className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="relative"
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                        <Moon className="absolute top-1/2 left-1/2 h-[1.2rem] w-[1.2rem] -translate-x-1/2 -translate-y-1/2 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                        <span className="sr-only">{t('theme.toggle')}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme('light')}>
                        {t('theme.light')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dark')}>
                        {t('theme.dark')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('system')}>
                        {t('theme.system')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
