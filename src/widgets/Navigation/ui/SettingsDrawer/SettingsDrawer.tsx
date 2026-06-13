'use client';

import { LangSelector } from '@features/langSelector';
import { ThemeSelector, ThemeToggle } from '@features/theme';
import { Button } from '@/src/shared/ui/Form/Button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@shared/ui/Drawer/Drawer';
import { X, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/src/shared/ui/Form/Label';

export const SettingsDrawer = () => {
    const { t } = useTranslation();
    return (
        <Drawer direction="right">
            <DrawerTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                >
                    <Menu size={24} />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle className="pr-10">
                        {t('page.test.title')}
                        <DrawerClose asChild>
                            <Button
                                size="icon"
                                className="absolute top-0 right-0 size-10 rounded-none"
                            >
                                <X />
                            </Button>
                        </DrawerClose>
                    </DrawerTitle>
                    <DrawerDescription className="pr-10">
                        {t('settings.description')}
                    </DrawerDescription>
                </DrawerHeader>
                <ul
                    className="no-scrollbar border-border grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 overflow-y-auto border-t-1 px-4 pt-10"
                    aria-label={t('settings.title')}
                >
                    <li className="contents">
                        <Label
                            htmlFor="lang-selector"
                            className="self-center"
                        >
                            {t('settings.language')}
                        </Label>
                        <div className="flex items-center">
                            <LangSelector />
                        </div>
                    </li>
                    <li className="contents">
                        <Label
                            htmlFor="theme-toggle"
                            className="self-center"
                        >
                            {t('settings.theme')}
                        </Label>
                        <div className="flex items-center">
                            <ThemeToggle />
                        </div>
                    </li>
                    <li className="contents">
                        <Label
                            htmlFor="theme-selector"
                            className="self-center"
                        >
                            {t('settings.theme-selector')}
                        </Label>
                        <div className="flex items-center">
                            <ThemeSelector />
                        </div>
                    </li>
                </ul>
            </DrawerContent>
        </Drawer>
    );
};
