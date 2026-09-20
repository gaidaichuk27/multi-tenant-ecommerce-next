import { leanEmailTemplate } from '../leanEmailLayout';
import type { LeanEmailChrome } from '../leanEmailLayout';

export const changePasswordEmailTemplate = ({
    url,
    title,
    thankYou,
    bodyHtml,
    cta,
    chrome,
    locale,
}: {
    url: string;
    to: string;
    title: string;
    thankYou: string;
    bodyHtml: string;
    cta: string;
    chrome: LeanEmailChrome;
    locale?: string;
}): string =>
    leanEmailTemplate({
        locale,
        title,
        thankYou,
        bodyHtml,
        ctaUrl: url,
        cta,
        chrome,
    });
