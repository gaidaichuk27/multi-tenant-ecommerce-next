import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ThemeProvider, ActiveThemeProvider } from '@providers/theme';
import { getThemeClassName, resolveTheme } from '@features/theme';
import { Orbitron, Rajdhani, Fira_Code } from 'next/font/google';
import '@styles/globals.css';

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

export const metadata: Metadata = {
    title: 'Create your own comunity',
    description: 'Build a community around your passion',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const theme = resolveTheme(cookieStore.get('active_theme')?.value);
    return (
        <html
            lang="en"
            suppressHydrationWarning
        >
            <body
                className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased ${getThemeClassName(theme)}`}
            >
                <ThemeProvider>
                    <ActiveThemeProvider initialTheme={theme}>
                        <div className="js-page page h-full">{children}</div>
                    </ActiveThemeProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
