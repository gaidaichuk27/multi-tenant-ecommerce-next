import {
    accountVerificationEmailTemplate,
    buildStorefrontPath,
    changePasswordEmailTemplate,
    emailConfirmationEmailTemplate,
    forgotPasswordEmailTemplate,
    getPreselectedLocale,
    getEmailConfirmationCouponCode,
    getMembershipApprovedCopy,
    getEmailChromeCopy,
    getMembershipDeclinedCopy,
    getMembershipJoinRequestCopy,
    membershipApprovedEmailTemplate,
    membershipDeclinedEmailTemplate,
    membershipJoinRequestEmailTemplate,
} from '@repo/mailer';

function escapeHtml(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

/** Keys match mailer template helpers (without `EmailTemplate` suffix). */
const TEMPLATE_RENDERERS = {
    accountVerification: (locale: string) =>
        accountVerificationEmailTemplate(
            buildStorefrontPath(locale, '/verify-email', {
                token: 'preview-token',
            }),
            'preview@example.com',
            locale,
        ),
    forgotPassword: (locale: string) =>
        forgotPasswordEmailTemplate(
            buildStorefrontPath(locale, '/password-restore', {
                token: 'preview-token',
            }),
            'preview@example.com',
            locale,
        ),
    changePassword: (locale: string) =>
        changePasswordEmailTemplate(
            buildStorefrontPath(locale, '/'),
            'preview@example.com',
            locale,
        ),
    emailConfirmation: (locale: string) =>
        emailConfirmationEmailTemplate(
            getEmailConfirmationCouponCode(),
            locale,
        ),
    membershipJoinRequest: (locale: string) => {
        const copy = getMembershipJoinRequestCopy(locale);
        const chrome = getEmailChromeCopy(locale);
        const groupName = escapeHtml('Preview Community');
        return membershipJoinRequestEmailTemplate({
            pendingUrl: buildStorefrontPath(
                locale,
                '/preview-community/-/pending',
            ),
            title: copy.title,
            thankYou: copy.thankYou,
            bodyBeforeLink: copy.bodyBeforeLink(
                escapeHtml('Alex Preview'),
                escapeHtml('alexpreview'),
                groupName,
            ),
            cta: copy.cta,
            chrome,
            locale,
        });
    },
    membershipApproved: (locale: string) => {
        const copy = getMembershipApprovedCopy(locale);
        const chrome = getEmailChromeCopy(locale);
        return membershipApprovedEmailTemplate({
            groupUrl: buildStorefrontPath(locale, '/preview-community'),
            title: copy.title,
            thankYou: copy.thankYou,
            bodyBeforeLink: copy.bodyBeforeLink(
                escapeHtml('Preview Community'),
            ),
            cta: copy.cta,
            chrome,
            locale,
        });
    },
    membershipDeclined: (locale: string) => {
        const copy = getMembershipDeclinedCopy(locale);
        const chrome = getEmailChromeCopy(locale);
        return membershipDeclinedEmailTemplate({
            groupUrl: buildStorefrontPath(locale, '/preview-community'),
            title: copy.title,
            thankYou: copy.thankYou,
            bodyBeforeLink: copy.bodyBeforeLink(
                escapeHtml('Preview Community'),
                escapeHtml(
                    'Please answer the join questions with a bit more detail, then request again.',
                ),
            ),
            cta: copy.cta,
            chrome,
            locale,
        });
    },
} as const;

type EmailPreviewTemplateName = keyof typeof TEMPLATE_RENDERERS;

const AUTH_TEMPLATE_NAMES = [
    'accountVerification',
    'forgotPassword',
    'changePassword',
    'emailConfirmation',
] as const satisfies readonly EmailPreviewTemplateName[];

const MEMBERSHIP_TEMPLATE_NAMES = [
    'membershipJoinRequest',
    'membershipApproved',
    'membershipDeclined',
] as const satisfies readonly EmailPreviewTemplateName[];

function areEmailPreviewsEnabled() {
    if (process.env.ENABLE_EMAIL_PREVIEWS === '1') {
        return true;
    }

    return process.env.NODE_ENV !== 'production';
}

function isEmailPreviewTemplateName(
    value: string,
): value is EmailPreviewTemplateName {
    return value in TEMPLATE_RENDERERS;
}

function renderIndexHtml(locale: string): string {
    const linkItems = (names: readonly EmailPreviewTemplateName[]) =>
        names
            .map((name) => {
                const href = `/api/dev/verify-template?t=${encodeURIComponent(name)}&locale=${encodeURIComponent(locale)}`;
                return `<li style="margin:8px 0;"><a href="${href}"><code>${name}</code></a></li>`;
            })
            .join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Email template previews</title>
</head>
<body style="font-family:system-ui,sans-serif;max-width:40rem;margin:2rem auto;padding:0 1rem;line-height:1.5;">
  <h1>Email template previews</h1>
  <p>Dev-only. Open a template with <code>/api/dev/verify-template?t=templateName</code>.</p>
  <p>Optional: <code>&amp;locale=${locale}</code> (current default).</p>
  <h2>Auth</h2>
  <ul>
    ${linkItems(AUTH_TEMPLATE_NAMES)}
  </ul>
  <h2>Membership</h2>
  <ul>
    ${linkItems(MEMBERSHIP_TEMPLATE_NAMES)}
  </ul>
</body>
</html>`;
}

function htmlResponse(body: string, status = 200) {
    return new Response(body, {
        status,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Security-Policy':
                "default-src 'none'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com data:; img-src data: https: http:; base-uri 'none'",
        },
    });
}

/**
 * GET /api/dev/verify-template?t=templateName&locale=en
 * Renders branded mailer HTML. Never sends mail.
 */
export async function GET(request: Request) {
    if (!areEmailPreviewsEnabled()) {
        return new Response('Not found', { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const localeParam = searchParams.get('locale');
    const locale =
        localeParam && localeParam.length > 0
            ? localeParam
            : getPreselectedLocale();
    const templateName = searchParams.get('t')?.trim() ?? '';

    if (!templateName) {
        return htmlResponse(renderIndexHtml(locale));
    }

    if (!isEmailPreviewTemplateName(templateName)) {
        return htmlResponse(
            `<!DOCTYPE html>
<html lang="en"><body style="font-family:system-ui,sans-serif;padding:2rem;">
  <h1>Unknown template</h1>
  <p><code>t=${templateName}</code> is not a known mailer template.</p>
  <p><a href="/api/dev/verify-template?locale=${encodeURIComponent(locale)}">List templates</a></p>
</body></html>`,
            404,
        );
    }

    // Preview has no MIME attachments — rewrite cid:* to public storefront assets.
    const origin = new URL(request.url).origin;
    const html = TEMPLATE_RENDERERS[templateName](locale)
        .replaceAll('src="cid:logo"', `src="${origin}/email/logo.png"`)
        .replaceAll(
            'src="cid:social-facebook"',
            `src="${origin}/email/social/facebook.png"`,
        )
        .replaceAll(
            'src="cid:social-instagram"',
            `src="${origin}/email/social/instagram.png"`,
        )
        .replaceAll(
            'src="cid:social-youtube"',
            `src="${origin}/email/social/youtube.png"`,
        );

    return htmlResponse(html);
}
