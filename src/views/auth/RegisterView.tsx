import getTranslations from '@/i18n';
import { ActionButton } from '@features/auth/buttons';
import { RegisterForm } from '@/src/features/forms/RegistrForm';
import { ShadowBox } from '@shared/ui/ShadowBox/ShadowBox';
import { SectionHeader } from '@shared/ui/Typography';
import { Legend } from '@shared/ui/Legend';
import type { Language } from '@shared/config/locales/types';

import { cn } from '@lib/utils';

interface RegisterViewProps {
    className?: string;
    locale: Language;
}

const i18nNamespaces = ['common'];

export const RegisterView = async ({
    className,
    locale,
}: RegisterViewProps) => {
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
                    title={t('common:form.register.title')}
                    subTitle={t('common:form.register.subtitle')}
                    className="mb-4"
                />
                <RegisterForm locale={locale} />

                <Legend label={t('common:form.label.have.account')} />

                <ActionButton
                    title="common:form.login.title"
                    route="/login"
                    variant={{ variant: 'default', size: 'default' }}
                    className="w-full"
                />
            </ShadowBox>
        </div>
    );
};
