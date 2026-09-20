import { leanEmailTemplate } from '../leanEmailLayout';
import type { LeanEmailChrome } from '../leanEmailLayout';

export const emailConfirmationEmailTemplate = ({
    couponCode,
    title,
    thankYou,
    bodyHtml,
    chrome,
    locale,
}: {
    couponCode: string;
    title: string;
    thankYou: string;
    bodyHtml: string;
    chrome: LeanEmailChrome;
    locale?: string;
}): string =>
    leanEmailTemplate({
        locale,
        title,
        thankYou,
        bodyHtml,
        highlight: couponCode,
        chrome,
    });
