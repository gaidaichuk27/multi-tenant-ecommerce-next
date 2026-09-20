import { leanEmailTemplate } from '../leanEmailLayout';
import type { LeanEmailChrome } from '../leanEmailLayout';
import { escapeHtml } from '../../html';

export type MembershipEmailChrome = LeanEmailChrome;

export const membershipDeclinedEmailTemplate = ({
    groupUrl,
    title,
    thankYou,
    bodyBeforeLink,
    cta,
    chrome,
    locale,
}: {
    groupUrl: string;
    title: string;
    thankYou: string;
    bodyBeforeLink: string;
    cta: string;
    chrome: MembershipEmailChrome;
    locale?: string;
}): string => {
    const safeUrl = escapeHtml(groupUrl);
    return leanEmailTemplate({
        locale,
        title,
        thankYou,
        bodyHtml: `${bodyBeforeLink} <a href="${safeUrl}" target="_blank" style="color:#134f5c;text-decoration:none;word-break:break-all;">${safeUrl}</a>.`,
        ctaUrl: groupUrl,
        cta,
        chrome,
    });
};
