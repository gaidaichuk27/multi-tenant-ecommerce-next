import { ApiError, AUTH_T_MESSAGES } from '@repo/api';
import {
    buildStorefrontPath,
    getDefaultLocale,
    getEmailConfirmationCouponCode,
} from './config';
import { sendMail } from './sendMail';
import {
    accountVerificationEmailTemplate,
    attachments,
    changePasswordEmailTemplate,
    emailConfirmationEmailTemplate,
    forgotPasswordEmailTemplate,
} from './templates';
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

    try {
        await sendMail({
            to: user.email,
            subject: 'Verify your email',
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

    try {
        await sendMail({
            to: user.email,
            subject: 'Reset your password',
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
    // Soft link for the template button (home). Support contact lands later.
    const url = buildStorefrontPath(resolvedLocale, '/');

    try {
        await sendMail({
            to: user.email,
            subject: 'Your password was changed',
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

    try {
        await sendMail({
            to: user.email,
            subject: 'Your email is verified',
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
