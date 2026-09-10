import getTranslations from '@/i18n';
import { requireAuthSession } from '@lib/auth/require-auth-session';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { WithMainLayout } from '@hocs/WithMainLayout';
import { caller } from '@TRPC/server';
import { AppDashboard } from './AppDashboard';

interface AppViewProps {
    className?: string;
    locale: Language;
}

const i18nNamespaces = ['common'];

export async function AppView({ className, locale }: AppViewProps) {
    const { t } = await getTranslations(locale, i18nNamespaces);
    await requireAuthSession(locale, buildLocalizedPathname('/app', locale));

    const groups = await caller.group.listMine();

    const Layouted = WithMainLayout(() => (
        <AppDashboard
            className={className}
            locale={locale}
            groups={groups}
            labels={{
                welcome: t('common:app.welcome'),
                myGroups: t('common:app.my_groups'),
                noGroups: t('common:app.no_groups'),
                createLink: t('common:app.create_link'),
                createAnother: t('common:app.create_another'),
            }}
        />
    ));

    return <Layouted />;
}
