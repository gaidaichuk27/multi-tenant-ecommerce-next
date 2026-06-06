import { memo } from 'react';

import { Container } from '@shared/ui/Container';
import getTranslations from '@/i18n';
import { getCurrentLangFromPathname } from '@helpers/getCurrentLangFromPathname';

const i18nNamespaces = ['common'];

export const HomeView = memo(async () => {
    const pathName = await getCurrentLangFromPathname();
    const { t } = await getTranslations(pathName, i18nNamespaces);
    return <>{t('common:page.test.title')}</>;
});

HomeView.displayName = 'HomeView';
