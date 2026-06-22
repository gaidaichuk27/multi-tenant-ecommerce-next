import { cookies } from 'next/headers';
import { ThemeProvider, ActiveThemeProvider } from '@providers/theme';
import { getThemeClassName, resolveTheme } from '@features/theme';
import { Orbitron, Rajdhani, Fira_Code } from 'next/font/google';
import initTranslations from '@/i18n';
import i18nConfig from '@/i18nConfig';
import '@styles/globals.css';
import TranslationProvider from '@providers/TranslationProvider';
import { TRPCReactProvider } from '@providers/TRPCProvider';

const fontSans = Orbitron({
    subsets: ['latin'],
    variable: '--font-sans',
});

const fontSerif = Rajdhani({
    subsets: ['latin'],
    weight: ['300', '400', '700'],
    variable: '--font-serif',
});

const fontMono = Fira_Code({
    subsets: ['latin'],
    variable: '--font-mono',
});

const i18nNamespaces = ['common'];

export function generateStaticParams() {
    return i18nConfig.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;
    const cookieStore = await cookies();
    const theme = resolveTheme(cookieStore.get('active_theme')?.value);
    const { resources } = await initTranslations(locale, i18nNamespaces);
    return (
        <html
            lang={locale}
            suppressHydrationWarning
        >
            <body
                className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased ${getThemeClassName(theme)}`}
            >
                <ThemeProvider>
                    <ActiveThemeProvider initialTheme={theme}>
                        <TranslationProvider
                            locale={locale}
                            resources={resources}
                            namespaces={i18nNamespaces}
                        >
                            <div className="js-page page h-full">
                                <TRPCReactProvider>
                                    {children}
                                </TRPCReactProvider>
                            </div>
                        </TranslationProvider>
                    </ActiveThemeProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
