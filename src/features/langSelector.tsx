'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown, Globe } from 'lucide-react';

import { cn } from '@lib/utils';
import { cookieService } from '@services/cookieService';
import { Button } from '@shared/ui/Form/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@shared/ui/Form/Dropdown';
import { FlagIcon } from '@shared/ui/FlagIcon';
import { LANG_COOKIE_KEY } from '@shared/config/locales/const';
import { LANGUAGE_OPTIONS } from '@shared/config/locales/languageOptions';
import { getLanguageOptionByLocale } from '@shared/config/locales/languageOptions';
import { isValidLocale } from '@shared/config/locales/locale';
import { Language, type LanguageOption } from '@shared/config/locales/types';
import i18nConfig from '@/i18nConfig';

interface LangSelectorProps {
    options?: LanguageOption[];
    disabled?: boolean;
    placeholder?: string;
    slim?: boolean;
    className?: string;
}

export function LangSelector({
    options = LANGUAGE_OPTIONS,
    disabled = false,
    placeholder = 'Select language',
    slim = false,
    className,
}: LangSelectorProps) {
    const router = useRouter();
    const pathname = usePathname();

    const routeLocale = useMemo(() => {
        const segment = pathname.split('/').filter(Boolean)[0];
        return isValidLocale(segment) ? segment : i18nConfig.defaultLocale;
    }, [pathname]);

    const selectedOption = useMemo(
        () =>
            getLanguageOptionByLocale(routeLocale) ??
            options.find((option) => option.preSelected) ??
            options[0],
        [options, routeLocale],
    );

    const handleSelect = useCallback(
        (languageValue: Language) => {
            cookieService.set(LANG_COOKIE_KEY, languageValue);

            const segments = pathname.split('/');
            segments[1] = languageValue;
            const newPath = segments.join('/') || `/${languageValue}`;

            router.push(newPath);
            router.refresh();
        },
        [pathname, router],
    );

    return (
        <div className={cn('flex shrink-0 items-center', className)}>
            <DropdownMenu size="lg">
                <DropdownMenuTrigger asChild>
                    <Button
                        id="lang-selector"
                        type="button"
                        variant="outline"
                        disabled={disabled}
                        className={cn(
                            'h-10 min-w-0 justify-between gap-2 px-3',
                            slim
                                ? 'w-[3.75rem] min-w-[3.75rem] gap-1 px-1.5'
                                : 'min-w-[6.5rem]',
                        )}
                        aria-label={
                            selectedOption
                                ? `Language: ${selectedOption.label}`
                                : placeholder
                        }
                    >
                        {selectedOption ? (
                            <div
                                className={cn(
                                    'flex min-w-0 items-center gap-2',
                                    slim
                                        ? 'shrink-0'
                                        : 'flex-1 overflow-hidden',
                                )}
                            >
                                <div className="border-border flex size-6 shrink-0 items-center overflow-hidden rounded-full border">
                                    <FlagIcon
                                        option={selectedOption}
                                        className="size-8.5"
                                    />
                                </div>
                                {!slim && (
                                    <span className="truncate">
                                        {selectedOption.label}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                {slim ? (
                                    <Globe
                                        className="size-5"
                                        aria-hidden
                                    />
                                ) : (
                                    placeholder
                                )}
                            </div>
                        )}
                        <ChevronDown
                            className={cn(
                                'size-4 shrink-0 opacity-50',
                                slim && 'size-3.5',
                            )}
                            aria-hidden
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="min-w-44"
                >
                    <DropdownMenuGroup>
                        <DropdownMenuRadioGroup
                            value={selectedOption.value}
                            onValueChange={(value) =>
                                handleSelect(value as Language)
                            }
                        >
                            {options.map((option) => (
                                <DropdownMenuRadioItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    <div className="border-border flex size-6 shrink-0 items-center overflow-hidden rounded-full border">
                                        <FlagIcon
                                            option={option}
                                            className="size-8.5"
                                        />
                                    </div>
                                    {option.label}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
