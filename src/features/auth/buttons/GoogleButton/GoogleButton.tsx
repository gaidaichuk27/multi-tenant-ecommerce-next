'use client';

import { memo } from 'react';
import { Button } from '@shared/ui/Form/Button';
import { useTranslation } from 'react-i18next';
import Google from '@icons/google.svg';
import Image from 'next/image';

import { cn } from '@lib/utils';
import { getSvgSrc } from '@/src/shared/config/types';

interface GoogleButtonProps {
    className?: string;
    onSubmit?: () => void;
}

export const GoogleButton = memo(
    ({ className, onSubmit }: GoogleButtonProps) => {
        const { t } = useTranslation('common');

        const clickHandler = () => {
            onSubmit?.();
        };

        return (
            <Button
                type="submit"
                variant="outline"
                className={cn(className)}
                aria-label={t('common:sign_in_with_google')}
                onClick={clickHandler}
            >
                <Image
                    src={getSvgSrc(Google)}
                    alt="Google"
                    width={20}
                    height={20}
                />
                {t('common:form.button.google.singin')}
            </Button>
        );
    },
);

GoogleButton.displayName = 'GoogleButton';
