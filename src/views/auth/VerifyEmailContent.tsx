'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { verifyEmail } from '@lib/auth/verify-client-api';
import { useFormApiError } from '@shared/hooks/useFormApiError';
import { ErrorMessage } from '@shared/ui/Form/ErrorMessage';
import { SectionHeader } from '@shared/ui/Typography';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { cn } from '@lib/utils';

type VerifyStatus = 'loading' | 'idle' | 'success' | 'error';

interface VerifyEmailContentProps {
    className?: string;
    locale: Language;
}

export const VerifyEmailContent = memo(
    ({ className, locale }: VerifyEmailContentProps) => {
        const { t } = useTranslation(['common']);
        const router = useRouter();
        const searchParams = useSearchParams();
        const getSubmitError = useFormApiError();
        const hasStartedRef = useRef(false);
        const [status, setStatus] = useState<VerifyStatus>('loading');
        const [error, setError] = useState<string | null>(null);

        useEffect(() => {
            if (hasStartedRef.current) {
                return;
            }

            // After a successful verify we replace ?token=… with ?verified=1.
            // That remounts this client component, so treat verified as success
            // instead of "token missing".
            if (searchParams.get('verified') === '1') {
                setStatus('success');
                return;
            }

            const token = searchParams.get('token');

            // Direct visit (no link from email): guidance, not an API error.
            if (!token) {
                setStatus('idle');
                return;
            }

            hasStartedRef.current = true;

            const runVerification = async () => {
                try {
                    const response = await verifyEmail(token, locale);
                    const successToast = t(`common:${response.tMessage}`, {
                        defaultValue: response.message,
                    });
                    toast.success(successToast);
                    setStatus('success');
                    // Keep success UI across remount; strip the JWT from the URL.
                    router.replace(
                        `${buildLocalizedPathname('/verify-email', locale)}?verified=1`,
                    );
                } catch (verificationError) {
                    const errorMessage = getSubmitError(verificationError);
                    setError(errorMessage);
                    setStatus('error');
                    toast.error(errorMessage);
                }
            };

            void runVerification();
        }, [getSubmitError, locale, router, searchParams, t]);

        const title =
            status === 'idle'
                ? t('common:page.verify.email.no.token.title')
                : t('common:page.verify.email.title');

        const subTitle =
            status === 'success'
                ? t('common:page.verify.email.success.description')
                : status === 'idle'
                  ? t('common:page.verify.email.no.token.description')
                  : status === 'loading'
                    ? t('common:loading')
                    : t('common:page.verify.email.description');

        return (
            <div className={cn(className)}>
                <SectionHeader
                    title={title}
                    subTitle={status === 'error' ? undefined : subTitle}
                    className="mb-4"
                />
                {status === 'error' && error ? (
                    <ErrorMessage error={error} />
                ) : null}
            </div>
        );
    },
);

VerifyEmailContent.displayName = 'VerifyEmailContent';
