import getTranslations from '@/i18n';
import { Metadata } from 'next';
import { WithMainLayout } from '@hocs/WithMainLayout';
import { PasswordForgotView } from '@views/auth/PasswordForgotView';

const i18nNamespaces = ['common'];

type PasswordForgotPageProps = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({
    params,
}: PasswordForgotPageProps): Promise<Metadata> {
    const { locale } = await params;
    const { t } = await getTranslations(locale, i18nNamespaces);

    return {
        title: t('common:page.password.forgot.title'),
        description: t('common:page.password.forgot.description'),
    };
}

export default function PasswordForgotPage() {
    const Layouted = WithMainLayout(PasswordForgotView);
    return <Layouted />;
}
