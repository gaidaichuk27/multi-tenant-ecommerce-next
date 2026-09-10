import path from 'path';
import type { Attachment } from 'nodemailer/lib/mailer';

const LOGO_PATH = path.resolve(process.cwd(), 'assets/email/logo.png');

export const attachments: Attachment[] = [
    {
        filename: 'logo.png',
        path: LOGO_PATH,
        cid: 'logo',
    },
];
