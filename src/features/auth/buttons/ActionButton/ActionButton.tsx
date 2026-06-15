'use client';

import { memo } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { Button, buttonVariants } from '@shared/ui/Form/Button';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

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

        const clickButtonHandler = () => {
            router.push(route);
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
