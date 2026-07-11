import getTranslations from '@/i18n';
import { WithMainLayout } from '@hocs/WithMainLayout';
import { CreateGroupForm } from '@features/create-group';
import { ShadowBox } from '@shared/ui/ShadowBox/ShadowBox';
import { SectionHeader } from '@shared/ui/Typography';
import type { Language } from '@shared/config/locales/types';
import { cn } from '@lib/utils';

interface CreateGroupViewProps {
    className?: string;
    locale: Language;
}

const i18nNamespaces = ['common'];

export async function CreateGroupView({
    className,
    locale,
}: CreateGroupViewProps) {
    const { t } = await getTranslations(locale, i18nNamespaces);

    const Layouted = WithMainLayout(() => (
        <div
            className={cn(
                'flex min-h-[60vh] flex-col items-center justify-center p-6',
                className,
            )}
        >
            <ShadowBox className="w-full max-w-[600px]">
                <SectionHeader
                    title={t('common:group.form.title')}
                    subTitle={t('common:group.form.subtitle')}
                    className="mb-4"
                />
                <CreateGroupForm locale={locale} />
            </ShadowBox>
        </div>
    ));

    return <Layouted />;
}
