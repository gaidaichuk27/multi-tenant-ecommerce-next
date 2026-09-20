import { ApiError, AUTH_T_MESSAGES } from '@repo/api';
import {
    buildStorefrontPath,
    getDefaultLocale,
    getEmailConfirmationCouponCode,
    sendMail,
    accountVerificationEmailTemplate,
    changePasswordEmailTemplate,
    emailConfirmationEmailTemplate,
    forgotPasswordEmailTemplate,
    attachments,
    getAccountVerificationCopy,
    getChangePasswordCopy,
    getEmailConfirmationCopy,
    getForgotPasswordCopy,
} from '@repo/mailer';
import { signEmailVerifyToken } from '../jwt';

type AuthEmailUser = {
    id: string;
    email: string;
};

export function resolveEmailLocale(locale?: string): string {
    return locale ?? getDefaultLocale();
}

export async function sendAccountVerificationEmail(
    user: AuthEmailUser,
    locale?: string,
) {
    const resolvedLocale = resolveEmailLocale(locale);
    const token = signEmailVerifyToken(user.id);
    const url = buildStorefrontPath(resolvedLocale, '/verify-email', { token });
    const copy = getAccountVerificationCopy(resolvedLocale);

    try {
        await sendMail({
            to: user.email,
            subject: copy.subject,
            html: accountVerificationEmailTemplate(
                url,
                user.email,
                resolvedLocale,
            ),
            attachments,
        });
    } catch {
        throw new ApiError(
            500,
            AUTH_T_MESSAGES.REGISTER_EMAIL_SEND_FAILED,
            'Failed to send verification email',
        );
    }
}

export async function sendPasswordResetEmail(
    user: AuthEmailUser,
    locale: string | undefined,
    token: string,
) {
    const resolvedLocale = resolveEmailLocale(locale);
    const url = buildStorefrontPath(resolvedLocale, '/password-restore', {
        token,
    });
    const copy = getForgotPasswordCopy(resolvedLocale);

    try {
        await sendMail({
            to: user.email,
            subject: copy.subject,
            html: forgotPasswordEmailTemplate(url, user.email, resolvedLocale),
            attachments,
        });
    } catch {
        throw new ApiError(
            500,
            AUTH_T_MESSAGES.PASSWORD_FORGOT_SEND_FAILED,
            'Failed to send password reset email',
        );
    }
}

/**
 * Security notification after a successful password change.
 * Informational only — the changing session stays logged in (new access token);
 * other sessions are already invalidated via tokenVersion. Best-effort send.
 */
export async function sendPasswordChangedEmail(
    user: AuthEmailUser,
    locale?: string,
) {
    const resolvedLocale = resolveEmailLocale(locale);
    const url = buildStorefrontPath(resolvedLocale, '/');
    const copy = getChangePasswordCopy(resolvedLocale);

    try {
        await sendMail({
            to: user.email,
            subject: copy.subject,
            html: changePasswordEmailTemplate(url, user.email, resolvedLocale),
            attachments,
        });
    } catch (error) {
        console.error('Failed to send password-changed email:', error);
    }
}

export async function sendEmailConfirmedEmail(
    user: AuthEmailUser,
    locale?: string,
) {
    const resolvedLocale = resolveEmailLocale(locale);
    const couponCode = getEmailConfirmationCouponCode();
    const copy = getEmailConfirmationCopy(resolvedLocale);

    try {
        await sendMail({
            to: user.email,
            subject: copy.subject,
            html: emailConfirmationEmailTemplate(couponCode, resolvedLocale),
            attachments,
        });
    } catch (error) {
        console.error('Failed to send confirmation email:', error);
    }
}

export async function resendAccountVerificationEmail(
    user: AuthEmailUser,
    locale?: string,
) {
    try {
        await sendAccountVerificationEmail(user, locale);
    } catch {
        throw new ApiError(
            500,
            AUTH_T_MESSAGES.VERIFY_EMAIL_SEND_FAILED,
            'Failed to send verification email',
        );
    }
}
