import type { EmailChromeCopy } from '../emailCopy/chrome';
import { escapeHtml } from '../html';

export type LeanEmailChrome = EmailChromeCopy;

type LeanEmailParams = {
    locale?: string;
    title: string;
    thankYou: string;
    /** Already-escaped HTML body (may include links). */
    bodyHtml: string;
    ctaUrl?: string;
    cta?: string;
    /** Optional highlighted block (e.g. coupon code). */
    highlight?: string;
    chrome: LeanEmailChrome;
};

/**
 * Compact transactional layout shared by auth + membership emails.
 * Keeps HTML well under Gmail's ~102KB clip limit.
 */
export function leanEmailTemplate({
    locale = 'en',
    title,
    thankYou,
    bodyHtml,
    ctaUrl,
    cta,
    highlight,
    chrome,
}: LeanEmailParams): string {
    const supportMailto = 'mailto:help@mealstogo.com';
    const safeCtaUrl = ctaUrl ? escapeHtml(ctaUrl) : undefined;
    const ctaBlock =
        safeCtaUrl && cta
            ? `<tr>
            <td align="center" style="padding:24px;">
              <a href="${safeCtaUrl}" target="_blank" style="display:inline-block;padding:12px 28px;border:1px solid #999999;border-radius:0;background:#ffffff;color:#666666;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:20px;text-decoration:none;">
                ${cta}
              </a>
            </td>
          </tr>`
            : '';
    const highlightBlock = highlight
        ? `<tr>
            <td align="center" style="padding:16px 24px 8px;">
              <span style="display:inline-block;padding:12px 24px;border:1px solid #999999;font-family:Arial,Helvetica,sans-serif;font-size:28px;line-height:34px;color:#333333;letter-spacing:1px;">${highlight}</span>
            </td>
          </tr>`
        : '';

    return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f6f6f6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f6f6f6;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#ffffff;border-collapse:collapse;">
          <tr>
            <td align="center" style="padding:28px 24px 12px;">
              <a href="http://localhost:3000" target="_blank" style="text-decoration:none;">
                <img src="cid:logo" width="120" alt="MEALSTOGO" style="display:block;border:0;outline:none;" />
              </a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:8px 24px 0;font-family:Arial,Helvetica,sans-serif;font-size:28px;line-height:34px;color:#333333;">
              ${title}
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:16px 24px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:24px;color:#333333;">
              ${thankYou}
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:16px 24px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:24px;color:#333333;">
              ${bodyHtml}
            </td>
          </tr>
          ${highlightBlock}
          ${ctaBlock}
          <tr>
            <td align="center" style="padding:8px 24px 0;font-family:Arial,Helvetica,sans-serif;font-size:28px;line-height:34px;color:#333333;">
              ${chrome.needHelp}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 24px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="50%" valign="top" style="padding:0 8px 12px 0;">
                    <div style="font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:22px;color:#333333;text-align:center;padding-bottom:8px;">${chrome.askAt}</div>
                    <a href="${supportMailto}" style="display:block;padding:10px 12px;border:1px solid #999999;background:#ffffff;color:#666666;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:18px;text-align:center;text-decoration:none;word-break:break-all;">help@mealstogo.com</a>
                  </td>
                  <td width="50%" valign="top" style="padding:0 0 12px 8px;">
                    <div style="font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:22px;color:#333333;text-align:center;padding-bottom:8px;">${chrome.visitOur}</div>
                    <a href="http://localhost:3000" target="_blank" style="display:block;padding:10px 12px;border:1px solid #999999;background:#ffffff;color:#666666;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:18px;text-align:center;text-decoration:none;">${chrome.helpCenter}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:16px 24px 8px;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:22px;color:#333333;">
              ${chrome.socialHeading}
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:8px 24px 20px;">
              <a href="https://facebook.com" target="_blank" style="display:inline-block;margin:0 10px;text-decoration:none;">
                <img src="cid:social-facebook" width="32" height="32" alt="Facebook" style="display:block;border:0;outline:none;" />
              </a>
              <a href="https://instagram.com" target="_blank" style="display:inline-block;margin:0 10px;text-decoration:none;">
                <img src="cid:social-instagram" width="32" height="32" alt="Instagram" style="display:block;border:0;outline:none;" />
              </a>
              <a href="https://youtube.com" target="_blank" style="display:inline-block;margin:0 10px;text-decoration:none;">
                <img src="cid:social-youtube" width="32" height="32" alt="YouTube" style="display:block;border:0;outline:none;" />
              </a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:8px 24px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#999999;">
              ${chrome.footerBlurb}
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 24px 28px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#999999;">
              <a href="http://localhost:3000" target="_blank" style="color:#999999;text-decoration:underline;">${chrome.privacy}</a>
              &nbsp;|&nbsp;
              <a href="http://localhost:3000" target="_blank" style="color:#999999;text-decoration:underline;">${chrome.unsubscribe}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
