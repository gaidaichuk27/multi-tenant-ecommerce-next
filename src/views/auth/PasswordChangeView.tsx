import getTranslations from '@/i18n';
import { getCurrentLangFromPathname } from '@helpers/getCurrentLangFromPathname';
import { ActionButton } from '@features/auth/buttons';
import { PasswordChangeForm } from '@features/forms/PasswordChangeForm';
import { ShadowBox } from '@shared/ui/ShadowBox/ShadowBox';
import { SectionHeader } from '@shared/ui/Typography';
import { Legend } from '@shared/ui/Legend';

import { cn } from '@lib/utils';

interface PasswordChangeViewProps {
    className?: string;
}

const i18nNamespaces = ['common'];

export const PasswordChangeView = async ({
    className,
}: PasswordChangeViewProps) => {
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
                    title={t('common:form.password.change.title')}
                    subTitle={t('common:form.password.change.subtitle')}
                    className="mb-4"
                />
                <PasswordChangeForm />
            </ShadowBox>
        </div>
    );
};
