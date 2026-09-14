import getTranslations from '@/i18n';
import type { Language } from '@shared/config/locales/types';
import { GroupFeedPlaceholderView } from '@views/group/GroupFeedPlaceholderView';

interface GroupFeedPageViewProps {
    locale: Language;
    groupSlug: string;
}

const i18nNamespaces = ['common'];

export async function GroupFeedPageView({ locale }: GroupFeedPageViewProps) {
    const { t } = await getTranslations(locale, i18nNamespaces);

    return (
        <GroupFeedPlaceholderView
            locale={locale}
            title={t('common:group.feed.placeholder.title')}
            description={t('common:group.feed.placeholder.description')}
        />
    );
}
