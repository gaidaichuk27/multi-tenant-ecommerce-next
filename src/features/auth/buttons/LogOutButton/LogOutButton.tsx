'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { logoutAccount } from '@lib/auth/client-api';
import {
    buildLocalizedPathname,
    isValidLocale,
} from '@shared/config/locales/locale';
import { useFormApiError } from '@shared/hooks/useFormApiError';
import i18nConfig from '@/i18nConfig';
import { Button } from '@shared/ui/Form/Button';
import { cn } from '@lib/utils';

interface LogOutButtonProps {
    className?: string;
}

export const LogOutButton = ({ className }: LogOutButtonProps) => {
    const { t } = useTranslation(['common']);
    const getSubmitError = useFormApiError();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);

    const clickHandler = async () => {
        try {
            setIsLoading(true);
            await logoutAccount();

            const segment = pathname.split('/').filter(Boolean)[0];
            const locale = isValidLocale(segment)
                ? segment
                : i18nConfig.defaultLocale;

            window.location.href = buildLocalizedPathname('/', locale);
        } catch (error) {
            toast.error(getSubmitError(error));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            type="button"
            variant="outline"
            className={cn('w-full', className)}
            onClick={clickHandler}
            disabled={isLoading}
            aria-label={t('auth.logout.button')}
        >
            {isLoading ? t('loading') : t('auth.logout.button')}
        </Button>
    );
};
