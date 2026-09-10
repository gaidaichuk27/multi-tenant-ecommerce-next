'use client';

import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { AUTH_T_MESSAGES } from '@repo/api';
import { resendVerificationEmail } from '@lib/auth/password-client-api';
import { useFormApiError } from '@shared/hooks/useFormApiError';
import { Button } from '@shared/ui/Form/Button';
import { cn } from '@lib/utils';
import type { Language } from '@shared/config/locales/types';

interface EmailVerificationBannerProps {
    className?: string;
    locale: Language;
}

export const EmailVerificationBanner = memo(
    ({ className, locale }: EmailVerificationBannerProps) => {
        const { t } = useTranslation(['common']);
        const getSubmitError = useFormApiError();
        const [isSubmitting, setIsSubmitting] = useState(false);

        const handleResend = async () => {
            try {
                setIsSubmitting(true);
                await resendVerificationEmail(locale);
                toast.success(
                    t(`common:${AUTH_T_MESSAGES.RESEND_VERIFICATION_SUCCESS}`),
                );
            } catch (error) {
                toast.error(getSubmitError(error));
            } finally {
                setIsSubmitting(false);
            }
        };

        return (
            <div
                className={cn(
                    'text-foreground flex items-center justify-between gap-4 border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm',
                    className,
                )}
            >
                <p>{t('common:auth.email.verification_banner')}</p>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isSubmitting}
                    onClick={handleResend}
                >
                    {isSubmitting
                        ? t('common:loading')
                        : t('common:auth.email.resend_button')}
                </Button>
            </div>
        );
    },
);

EmailVerificationBanner.displayName = 'EmailVerificationBanner';
