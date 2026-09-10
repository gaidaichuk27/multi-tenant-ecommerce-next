import getTranslations from '@/i18n';
import { Suspense } from 'react';
import { ActionButton } from '@features/auth/buttons';
import { ShadowBox } from '@shared/ui/ShadowBox/ShadowBox';
import type { Language } from '@shared/config/locales/types';
import { cn } from '@lib/utils';

import { VerifyEmailContent } from './VerifyEmailContent';

interface VerifyEmailViewProps {
    className?: string;
    locale: Language;
}

const i18nNamespaces = ['common'];

export const VerifyEmailView = async ({
    className,
    locale,
}: VerifyEmailViewProps) => {
    const { t } = await getTranslations(locale, i18nNamespaces);

    return (
        <div
            className={cn(
                'flex h-screen flex-col items-center justify-center gap-2',
                className,
            )}
        >
            <ShadowBox className="w-full max-w-[600px]">
                <Suspense fallback={<p>{t('common:loading')}</p>}>
                    <VerifyEmailContent locale={locale} />
                </Suspense>

                <ActionButton
                    title="common:form.button.home"
                    route="/app"
                    variant={{ variant: 'default', size: 'default' }}
                    className="mt-6 w-full"
                    aria-label={t('common:form.button.home')}
                />
            </ShadowBox>
        </div>
    );
};
