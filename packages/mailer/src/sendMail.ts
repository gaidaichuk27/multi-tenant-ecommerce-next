import nodemailer from 'nodemailer';
import type { Attachment } from 'nodemailer/lib/mailer';
import { ApiError, AUTH_T_MESSAGES } from '@repo/api';

type SendMailInput = {
    to: string;
    subject: string;
    html: string;
    attachments?: Attachment[];
};

/**
 * Credentials come from `process.env` only (no file scrape).
 * - Next: root `.env` → membership emails
 * - Express: `backend/.env` (overrides root) → auth emails
 * Set `MAILER_*` on each process that sends mail.
 */
function getMailerCredentials() {
    const user = process.env.MAILER_ADDRESS;
    const pass = process.env.MAILER_SECRET;

    if (!user || !pass) {
        throw new ApiError(
            500,
            AUTH_T_MESSAGES.INTERNAL_ERROR,
            'Mailer is not configured',
        );
    }

    return { user, pass };
}

function createTransporter() {
    const { user, pass } = getMailerCredentials();

    return nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
    });
}

export async function sendMail({
    to,
    subject,
    html,
    attachments,
}: SendMailInput) {
    const { user } = getMailerCredentials();
    const transporter = createTransporter();

    await transporter.sendMail({
        from: user,
        to,
        subject,
        html,
        attachments,
    });
}
