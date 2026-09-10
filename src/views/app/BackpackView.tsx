import getTranslations from '@/i18n';
import { requireAuthSession } from '@lib/auth/require-auth-session';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { WithMainLayout } from '@hocs/WithMainLayout';
import { SectionHeader } from '@shared/ui/Typography';

interface BackpackViewProps {
    locale: Language;
}

const i18nNamespaces = ['common'];

export async function BackpackView({ locale }: BackpackViewProps) {
    await requireAuthSession(
        locale,
        buildLocalizedPathname('/backpack', locale),
    );

    const { t } = await getTranslations(locale, i18nNamespaces);

    const Content = () => (
        <div className="mx-auto w-full max-w-3xl p-6">
            <SectionHeader
                title={t('common:page.backpack.title')}
                subTitle={t('common:page.backpack.description')}
            />
            <p className="text-muted-foreground text-sm">Coming in Phase 1.</p>
        </div>
    );

    const Layouted = WithMainLayout(Content);

    return <Layouted />;
}
