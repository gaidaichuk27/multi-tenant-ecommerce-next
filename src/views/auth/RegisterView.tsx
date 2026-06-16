import getTranslations from '@/i18n';
import { getCurrentLangFromPathname } from '@helpers/getCurrentLangFromPathname';
import { ActionButton } from '@features/auth/buttons';
import { RegisterForm } from '@/src/features/forms/RegistrForm';
import { ShadowBox } from '@shared/ui/ShadowBox/ShadowBox';
import { SectionHeader } from '@shared/ui/Typography';
import { Legend } from '@shared/ui/Legend';

import { cn } from '@lib/utils';

interface RegisterViewProps {
    className?: string;
}

const i18nNamespaces = ['common'];

export const RegisterView = async ({ className }: RegisterViewProps) => {
    const pathName = await getCurrentLangFromPathname();
    const { t } = await getTranslations(pathName, i18nNamespaces);

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
                <RegisterForm />

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
