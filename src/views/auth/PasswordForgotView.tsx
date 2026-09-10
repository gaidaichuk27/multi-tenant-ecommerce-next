import getTranslations from '@/i18n';
import { ActionButton } from '@features/auth/buttons';
import { PasswordForgotForm } from '@features/forms/PasswordForgotForm';
import { ShadowBox } from '@shared/ui/ShadowBox/ShadowBox';
import { SectionHeader } from '@shared/ui/Typography';
import { Legend } from '@shared/ui/Legend';
import type { Language } from '@shared/config/locales/types';
import { cn } from '@lib/utils';

interface PasswordForgotViewProps {
    className?: string;
    locale: Language;
}

const i18nNamespaces = ['common'];

export const PasswordForgotView = async ({
    className,
    locale,
}: PasswordForgotViewProps) => {
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
                    title={t('common:form.password.forgot.title')}
                    subTitle={t('common:form.password.forgot.subtitle')}
                    className="mb-4"
                />
                <PasswordForgotForm locale={locale} />

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
