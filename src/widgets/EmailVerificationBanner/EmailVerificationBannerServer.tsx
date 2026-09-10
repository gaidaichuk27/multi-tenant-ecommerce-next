import { headers } from 'next/headers';
import { getCurrentLangFromPathname } from '@helpers/getCurrentLangFromPathname';
import { getAuthSession } from '@lib/auth/session';
import { EmailVerificationBanner } from '@widgets/EmailVerificationBanner';

/**
 * Layout-level banner — no `params.locale` (unlike pages → views).
 * `getCurrentLangFromPathname()` is intentional here; do not "fix" to a
 * locale prop unless MainLayout starts receiving `locale` from the page tree.
 * Session fetch is request-cached via `getAuthSession` (shared with tRPC/Header).
 */
export async function EmailVerificationBannerServer() {
    const requestHeaders = await headers();
    const session = await getAuthSession(requestHeaders);

    if (!session?.user || session.user.isEmailConfirmed) {
        return null;
    }

    const locale = await getCurrentLangFromPathname();

    return <EmailVerificationBanner locale={locale} />;
}
