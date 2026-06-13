import { memo } from 'react';

import getTranslations from '@/i18n';
import { getCurrentLangFromPathname } from '@helpers/getCurrentLangFromPathname';
import { previewCardsData } from '@features/grids/previewCardGrid/mock/previewCardsData';
import { PreviewCardGrid } from '@features/grids/previewCardGrid/ui/PreviewCardGrid';
import { FiltersRow } from '@features/filters/filtersRow';
import { HomeSubtitle } from '@features/home';
import { AnimationType } from '@shared/config/types';
import { SectionHeader } from '@shared/ui/Typography';

const i18nNamespaces = ['common'];

export const HomeView = memo(async () => {
    const pathName = await getCurrentLangFromPathname();
    const { t } = await getTranslations(pathName, i18nNamespaces);

    return (
        <>
            <SectionHeader
                title={t('home.title')}
                subTitle={<HomeSubtitle />}
            />
            <FiltersRow />
            <PreviewCardGrid
                items={previewCardsData}
                animation={AnimationType.FADE_IN}
                delay={100}
            />
        </>
    );
});

HomeView.displayName = 'HomeView';
