import getTranslations from '@/i18n';
import { Suspense } from 'react';
import { ActionButton } from '@features/auth/buttons';
import { SignInForm } from '@features/forms/SignInForm';
import { ShadowBox } from '@shared/ui/ShadowBox/ShadowBox';
import { SectionHeader } from '@shared/ui/Typography';
import { Legend } from '@shared/ui/Legend';
import type { Language } from '@shared/config/locales/types';

import { cn } from '@lib/utils';

interface LoginViewProps {
    className?: string;
    locale: Language;
}

const i18nNamespaces = ['common'];

export const LoginView = async ({ className, locale }: LoginViewProps) => {
    const { t } = await getTranslations(locale, i18nNamespaces);

    return (
        <div
            className={cn(
                'flex h-screen flex-col items-center justify-center gap-2',
                className,
            )}
        >
            <ShadowBox className="w-full max-w-[600px]">
                <SectionHeader
                    title={t('common:form.login.title')}
                    subTitle={t('common:form.login.subtitle')}
                    className="mb-4"
                />
                <Suspense fallback={<p>{t('common:loading')}</p>}>
                    <SignInForm locale={locale} />
                </Suspense>

                <Legend label={t('common:form.label.no.account')} />

                <ActionButton
                    title="common:form.button.register"
                    route="/register"
                    variant={{ variant: 'default', size: 'default' }}
                    className="w-full"
                    aria-label={t('common:form.button.register')}
                />
            </ShadowBox>
        </div>
    );
};
