import getTranslations from '@/i18n';
import { getCurrentLangFromPathname } from '@helpers/getCurrentLangFromPathname';
import { PasswordRestoreForm } from '@features/forms/PasswordRestoreForm';
import { ShadowBox } from '@shared/ui/ShadowBox/ShadowBox';
import { SectionHeader } from '@shared/ui/Typography';

import { cn } from '@lib/utils';

interface PasswordRestoreViewProps {
    className?: string;
}

const i18nNamespaces = ['common'];

export const PasswordRestoreView = async ({
    className,
}: PasswordRestoreViewProps) => {
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
                    title={t('common:form.password.restore.title')}
                    subTitle={t('common:form.password.restore.subtitle')}
                    className="mb-4"
                />
                <PasswordRestoreForm />
            </ShadowBox>
        </div>
    );
};
