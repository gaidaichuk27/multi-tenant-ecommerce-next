'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { User } from '@entities/User';
import { LangSelector } from '@features/langSelector';
import { HeaderAuthButtons, LogOutButton } from '@features/auth/buttons';
import { ThemeSelector, ThemeToggle } from '@features/theme';
import { Avatar } from '@shared/ui/Avatar';
import { Button } from '@shared/ui/Form/Button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerTitle,
    DrawerTrigger,
} from '@shared/ui/Drawer/Drawer';
import { X, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Label } from '@shared/ui/Form/Label';
import {
    buildLocalizedPathname,
    isValidLocale,
} from '@shared/config/locales/locale';
import i18nConfig from '@/i18nConfig';

interface SettingsDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    showAuthButtons?: boolean;
    user?: User | null;
}

export const SettingsDrawer = ({
    open,
    onOpenChange,
    showAuthButtons = false,
    user = null,
}: SettingsDrawerProps) => {
    const { t } = useTranslation(['common']);
    const pathname = usePathname();
    const segment = pathname.split('/')[1];
    const locale = isValidLocale(segment) ? segment : i18nConfig.defaultLocale;

    return (
        <Drawer
            open={open}
            onOpenChange={onOpenChange}
            direction="right"
        >
            {!user && (
                <DrawerTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        aria-label={t('settings.open')}
                    >
                        <Menu size={24} />
                    </Button>
                </DrawerTrigger>
            )}

            <DrawerContent className="flex h-full flex-col">
                <DrawerTitle className="sr-only">
                    {user ? (user.name ?? user.username) : t('settings.title')}
                </DrawerTitle>

                <DrawerClose asChild>
                    <Button
                        size="icon"
                        className="absolute top-0 right-0 size-10 rounded-none"
                        aria-label={t('settings.close')}
                    >
                        <X />
                    </Button>
                </DrawerClose>

                <div className="flex min-h-0 flex-1 flex-col">
                    <div className="shrink-0">
                        {user && (
                            <div className="py-4 pr-12 pl-4">
                                <Avatar
                                    user={user}
                                    size="large"
                                    showInfo
                                />
                            </div>
                        )}

                        {showAuthButtons && (
                            <div className="px-4 pt-4">
                                <HeaderAuthButtons direction="col" />
                            </div>
                        )}

                        <ul
                            className="no-scrollbar border-border grid shrink-0 grid-cols-[auto_1fr] content-start gap-x-4 gap-y-3 border-t px-4 pt-4"
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
                    </div>

                    {user && (
                        <div className="border-border mt-auto space-y-2 border-t p-4">
                            {/* TEMP: remove once account settings page exists */}
                            <Button
                                asChild
                                variant="outline"
                                className="w-full"
                            >
                                <Link
                                    href={buildLocalizedPathname(
                                        '/password-change',
                                        locale,
                                    )}
                                    onClick={() => onOpenChange(false)}
                                >
                                    {t('form.password.change.title')}
                                </Link>
                            </Button>
                            <LogOutButton />
                        </div>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
};
