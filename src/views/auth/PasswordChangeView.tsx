import getTranslations from '@/i18n';
import { requireAuthSession } from '@lib/auth/require-auth-session';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { PasswordChangeForm } from '@features/forms/PasswordChangeForm';
import { ShadowBox } from '@shared/ui/ShadowBox/ShadowBox';
import { SectionHeader } from '@shared/ui/Typography';
import { cn } from '@lib/utils';

interface PasswordChangeViewProps {
    className?: string;
    locale: Language;
}

const i18nNamespaces = ['common'];

export async function PasswordChangeView({
    className,
    locale,
}: PasswordChangeViewProps) {
    await requireAuthSession(
        locale,
        buildLocalizedPathname('/password-change', locale),
    );

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
                    title={t('common:form.password.change.title')}
                    subTitle={t('common:form.password.change.subtitle')}
                    className="mb-4"
                />
                <PasswordChangeForm locale={locale} />
            </ShadowBox>
        </div>
    );
}
