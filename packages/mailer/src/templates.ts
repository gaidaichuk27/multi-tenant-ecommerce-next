import { accountVerificationEmailTemplate as baseAccountVerificationEmailTemplate } from './emailTemplates/accountVerificationEmail/template';
import { changePasswordEmailTemplate as baseChangePasswordEmailTemplate } from './emailTemplates/changePasswordEmail/template';
import { emailConfirmationEmailTemplate as baseEmailConfirmationEmailTemplate } from './emailTemplates/emailConfirmationEmail/template';
import { forgotPasswordEmailTemplate as baseForgotPasswordEmailTemplate } from './emailTemplates/forgotPasswordEmail/template';
import { membershipApprovedEmailTemplate as baseMembershipApprovedEmailTemplate } from './emailTemplates/membershipApprovedEmail/template';
import { membershipDeclinedEmailTemplate as baseMembershipDeclinedEmailTemplate } from './emailTemplates/membershipDeclinedEmail/template';
import { membershipJoinRequestEmailTemplate as baseMembershipJoinRequestEmailTemplate } from './emailTemplates/membershipJoinRequestEmail/template';
import type { LeanEmailChrome } from './emailTemplates/leanEmailLayout';
import { applyEmailBranding } from './branding';
import { getDefaultLocale } from './config';
import { getEmailChromeCopy } from './emailCopy/chrome';
import {
    getAccountVerificationCopy,
    getChangePasswordCopy,
    getEmailConfirmationCopy,
    getForgotPasswordCopy,
} from './emailCopy/auth';
import { escapeHtml } from './html';

export function accountVerificationEmailTemplate(
    url: string,
    to: string,
    locale?: string,
): string {
    const resolved = locale ?? getDefaultLocale();
    const copy = getAccountVerificationCopy(resolved);
    const email = escapeHtml(to);
    const safeUrl = escapeHtml(url);

    return applyEmailBranding(
        baseAccountVerificationEmailTemplate({
            url,
            to: email,
            title: copy.title,
            thankYou: copy.thankYou,
            bodyHtml: copy.bodyHtml(email, safeUrl),
            cta: copy.cta,
            chrome: getEmailChromeCopy(resolved),
            locale: resolved,
        }),
        resolved,
    );
}

export function forgotPasswordEmailTemplate(
    url: string,
    to: string,
    locale?: string,
): string {
    const resolved = locale ?? getDefaultLocale();
    const copy = getForgotPasswordCopy(resolved);
    const email = escapeHtml(to);
    const safeUrl = escapeHtml(url);

    return applyEmailBranding(
        baseForgotPasswordEmailTemplate({
            url,
            to: email,
            title: copy.title,
            thankYou: copy.thankYou,
            bodyHtml: copy.bodyHtml(email, safeUrl),
            cta: copy.cta,
            chrome: getEmailChromeCopy(resolved),
            locale: resolved,
        }),
        resolved,
    );
}

export function changePasswordEmailTemplate(
    url: string,
    to: string,
    locale?: string,
): string {
    const resolved = locale ?? getDefaultLocale();
    const copy = getChangePasswordCopy(resolved);
    const email = escapeHtml(to);
    const safeUrl = escapeHtml(url);

    return applyEmailBranding(
        baseChangePasswordEmailTemplate({
            url,
            to: email,
            title: copy.title,
            thankYou: copy.thankYou,
            bodyHtml: copy.bodyHtml(email, safeUrl),
            cta: copy.cta,
            chrome: getEmailChromeCopy(resolved),
            locale: resolved,
        }),
        resolved,
    );
}

export function emailConfirmationEmailTemplate(
    couponCode: string,
    locale?: string,
): string {
    const resolved = locale ?? getDefaultLocale();
    const copy = getEmailConfirmationCopy(resolved);

    return applyEmailBranding(
        baseEmailConfirmationEmailTemplate({
            couponCode: escapeHtml(couponCode),
            title: copy.title,
            thankYou: copy.thankYou,
            bodyHtml: copy.bodyHtml,
            chrome: getEmailChromeCopy(resolved),
            locale: resolved,
        }),
        resolved,
    );
}

export function membershipJoinRequestEmailTemplate(params: {
    pendingUrl: string;
    title: string;
    thankYou: string;
    bodyBeforeLink: string;
    cta: string;
    chrome: LeanEmailChrome;
    locale?: string;
}): string {
    return applyEmailBranding(
        baseMembershipJoinRequestEmailTemplate(params),
        params.locale ?? getDefaultLocale(),
    );
}

export function membershipApprovedEmailTemplate(params: {
    groupUrl: string;
    title: string;
    thankYou: string;
    bodyBeforeLink: string;
    cta: string;
    chrome: LeanEmailChrome;
    locale?: string;
}): string {
    return applyEmailBranding(
        baseMembershipApprovedEmailTemplate(params),
        params.locale ?? getDefaultLocale(),
    );
}

export function membershipDeclinedEmailTemplate(params: {
    groupUrl: string;
    title: string;
    thankYou: string;
    bodyBeforeLink: string;
    cta: string;
    chrome: LeanEmailChrome;
    locale?: string;
}): string {
    return applyEmailBranding(
        baseMembershipDeclinedEmailTemplate(params),
        params.locale ?? getDefaultLocale(),
    );
}

export { attachments } from './attachment';
