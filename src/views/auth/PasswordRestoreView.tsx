import getTranslations from '@/i18n';
import { Suspense } from 'react';
import { getCurrentLangFromPathname } from '@helpers/getCurrentLangFromPathname';
import { PasswordRestoreForm } from '@features/forms/PasswordRestoreForm';
import { ShadowBox } from '@shared/ui/ShadowBox/ShadowBox';
import { SectionHeader } from '@shared/ui/Typography';

import { cn } from '@lib/utils';
import type { Language } from '@shared/config/locales/types';

interface PasswordRestoreViewProps {
    className?: string;
    locale?: Language;
}

const i18nNamespaces = ['common'];

export const PasswordRestoreView = async ({
    className,
    locale,
}: PasswordRestoreViewProps) => {
    const pathName = locale ?? (await getCurrentLangFromPathname());
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
                <Suspense fallback={<p>{t('common:loading')}</p>}>
                    <PasswordRestoreForm locale={pathName} />
                </Suspense>
            </ShadowBox>
        </div>
    );
};
