import path from 'path';
import fs from 'fs';
import type { Attachment } from 'nodemailer/lib/mailer';

/**
 * Prefer assets shipped with `@repo/mailer` so Next standalone / Docker
 * do not depend on `backend/assets`. Fall back to monorepo paths for local DX.
 */
function resolveAssetPath(...segments: string[]): string {
    const relative = path.join(...segments);
    const candidates = [
        path.resolve(__dirname, '../assets', relative),
        path.resolve(process.cwd(), 'packages/mailer/assets', relative),
        path.resolve(process.cwd(), 'backend/assets', relative),
        path.resolve(process.cwd(), 'assets', relative),
        path.resolve(process.cwd(), 'public', relative),
    ];

    for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }

    throw new Error(`Mailer asset not found: ${relative}`);
}

function inlinePng(
    filename: string,
    cid: string,
    ...pathSegments: string[]
): Attachment {
    const filePath = resolveAssetPath(...pathSegments);

    return {
        filename,
        content: fs.readFileSync(filePath),
        cid,
        contentType: 'image/png',
        contentDisposition: 'inline',
    };
}

/** Inline images for templates (`cid:logo`, `cid:social-*`). */
export const attachments: Attachment[] = [
    inlinePng('logo.png', 'logo', 'email', 'logo.png'),
    inlinePng(
        'facebook.png',
        'social-facebook',
        'email',
        'social',
        'facebook.png',
    ),
    inlinePng(
        'instagram.png',
        'social-instagram',
        'email',
        'social',
        'instagram.png',
    ),
    inlinePng(
        'youtube.png',
        'social-youtube',
        'email',
        'social',
        'youtube.png',
    ),
];
