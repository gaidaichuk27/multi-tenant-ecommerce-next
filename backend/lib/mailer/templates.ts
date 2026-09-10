import { accountVerificationEmailTemplate as baseAccountVerificationEmailTemplate } from './emailTemplates/accountVerificationEmail/template';
import { changePasswordEmailTemplate as baseChangePasswordEmailTemplate } from './emailTemplates/changePasswordEmail/template';
import { emailConfirmationEmailTemplate as baseEmailConfirmationEmailTemplate } from './emailTemplates/emailConfirmationEmail/template';
import { forgotPasswordEmailTemplate as baseForgotPasswordEmailTemplate } from './emailTemplates/forgotPasswordEmail/template';
import { applyEmailBranding } from './branding';
import { getDefaultLocale } from './config';

export function accountVerificationEmailTemplate(
    url: string,
    to: string,
    locale?: string,
): string {
    return applyEmailBranding(
        baseAccountVerificationEmailTemplate(url, to, locale),
        locale ?? getDefaultLocale(),
    );
}

export function forgotPasswordEmailTemplate(
    url: string,
    to: string,
    locale?: string,
): string {
    return applyEmailBranding(
        baseForgotPasswordEmailTemplate(url, to, locale),
        locale ?? getDefaultLocale(),
    );
}

export function changePasswordEmailTemplate(
    url: string,
    to: string,
    locale?: string,
): string {
    return applyEmailBranding(
        baseChangePasswordEmailTemplate(url, to, locale),
        locale ?? getDefaultLocale(),
    );
}

export function emailConfirmationEmailTemplate(
    couponCode: string,
    locale?: string,
): string {
    return applyEmailBranding(
        baseEmailConfirmationEmailTemplate(couponCode, locale),
        locale ?? getDefaultLocale(),
    );
}

export { attachments } from './attachment';
