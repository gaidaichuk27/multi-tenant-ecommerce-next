'use client';

import { memo } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { Button, buttonVariants } from '@shared/ui/Form/Button';
import { useTranslation } from 'react-i18next';
import { usePathname, useRouter } from 'next/navigation';
import {
    buildLocalizedPathname,
    isValidLocale,
} from '@shared/config/locales/locale';
import i18nConfig from '@/i18nConfig';

interface ActionButtonProps {
    className?: string;
    route: string;
    variant?: VariantProps<typeof buttonVariants>;
    title: string;
}

export const ActionButton = memo(
    ({
        route,
        variant = { variant: 'default', size: 'default' },
        className,
        title,
    }: ActionButtonProps) => {
        const { t } = useTranslation(['common']);
        const router = useRouter();
        const pathname = usePathname();

        const clickButtonHandler = () => {
            const segment = pathname.split('/').filter(Boolean)[0];
            const locale = isValidLocale(segment)
                ? segment
                : i18nConfig.defaultLocale;

            router.push(buildLocalizedPathname(route, locale));
        };
        return (
            <Button
                type="button"
                variant={variant.variant}
                className={className}
                aria-label={t(title)}
                onClick={clickButtonHandler}
            >
                {t(title)}
            </Button>
        );
    },
);

ActionButton.displayName = 'ActionButton';
