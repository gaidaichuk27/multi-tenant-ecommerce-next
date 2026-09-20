import { buildStorefrontPath, getDefaultLocale } from './config';
import {
    getMembershipApprovedCopy,
    getMembershipDeclinedCopy,
    getMembershipJoinRequestCopy,
} from './emailCopy/membership';
import { getEmailChromeCopy } from './emailCopy/chrome';
import { escapeHtml } from './html';
import { sendMail } from './sendMail';
import { attachments } from './attachment';
import {
    membershipApprovedEmailTemplate,
    membershipDeclinedEmailTemplate,
    membershipJoinRequestEmailTemplate,
} from './templates';

type MailRecipient = {
    email: string;
    name?: string | null;
    username?: string | null;
};

type GroupEmailContext = {
    name: string;
    slug: string;
};

function resolveEmailLocale(locale?: string): string {
    return locale ?? getDefaultLocale();
}

function displayName(user: MailRecipient): string {
    return user.name?.trim() || user.username?.trim() || user.email;
}

/**
 * Notify group owner/admins that someone requested to join (pending).
 * Best-effort — never throws to the caller.
 */
export async function sendMembershipJoinRequestEmails(opts: {
    recipients: MailRecipient[];
    group: GroupEmailContext;
    joiner: MailRecipient & { username: string };
    locale?: string;
}) {
    if (opts.recipients.length === 0) {
        return;
    }

    const resolvedLocale = resolveEmailLocale(opts.locale);
    const copy = getMembershipJoinRequestCopy(resolvedLocale);
    const chrome = getEmailChromeCopy(resolvedLocale);
    const groupName = escapeHtml(opts.group.name);
    const joinerDisplayName = escapeHtml(displayName(opts.joiner));
    const joinerUsername = escapeHtml(opts.joiner.username);
    const pendingUrl = buildStorefrontPath(
        resolvedLocale,
        `/${opts.group.slug}/-/pending`,
    );
    const subject = copy.subject(opts.group.name);
    const html = membershipJoinRequestEmailTemplate({
        pendingUrl,
        title: copy.title,
        thankYou: copy.thankYou,
        bodyBeforeLink: copy.bodyBeforeLink(
            joinerDisplayName,
            joinerUsername,
            groupName,
        ),
        cta: copy.cta,
        chrome,
        locale: resolvedLocale,
    });

    await Promise.all(
        opts.recipients.map(async (recipient) => {
            try {
                await sendMail({
                    to: recipient.email,
                    subject,
                    html,
                    attachments,
                });
            } catch (error) {
                console.error(
                    'Failed to send membership join-request email:',
                    error,
                );
            }
        }),
    );
}

/**
 * Notify the joiner that their pending request was approved.
 * Best-effort — never throws to the caller.
 */
export async function sendMembershipApprovedEmail(opts: {
    recipient: MailRecipient;
    group: GroupEmailContext;
    locale?: string;
}) {
    const resolvedLocale = resolveEmailLocale(opts.locale);
    const copy = getMembershipApprovedCopy(resolvedLocale);
    const chrome = getEmailChromeCopy(resolvedLocale);
    const groupUrl = buildStorefrontPath(resolvedLocale, `/${opts.group.slug}`);

    try {
        await sendMail({
            to: opts.recipient.email,
            subject: copy.subject(opts.group.name),
            html: membershipApprovedEmailTemplate({
                groupUrl,
                title: copy.title,
                thankYou: copy.thankYou,
                bodyBeforeLink: copy.bodyBeforeLink(
                    escapeHtml(opts.group.name),
                ),
                cta: copy.cta,
                chrome,
                locale: resolvedLocale,
            }),
            attachments,
        });
    } catch (error) {
        console.error('Failed to send membership approved email:', error);
    }
}

/**
 * Notify the joiner that their pending request was declined.
 * Best-effort — never throws to the caller.
 */
export async function sendMembershipDeclinedEmail(opts: {
    recipient: MailRecipient;
    group: GroupEmailContext;
    declineReason?: string;
    locale?: string;
}) {
    const resolvedLocale = resolveEmailLocale(opts.locale);
    const copy = getMembershipDeclinedCopy(resolvedLocale);
    const chrome = getEmailChromeCopy(resolvedLocale);
    const groupUrl = buildStorefrontPath(resolvedLocale, `/${opts.group.slug}`);
    const declineReasonHtml = opts.declineReason?.trim()
        ? escapeHtml(opts.declineReason.trim())
        : undefined;

    try {
        await sendMail({
            to: opts.recipient.email,
            subject: copy.subject(opts.group.name),
            html: membershipDeclinedEmailTemplate({
                groupUrl,
                title: copy.title,
                thankYou: copy.thankYou,
                bodyBeforeLink: copy.bodyBeforeLink(
                    escapeHtml(opts.group.name),
                    declineReasonHtml,
                ),
                cta: copy.cta,
                chrome,
                locale: resolvedLocale,
            }),
            attachments,
        });
    } catch (error) {
        console.error('Failed to send membership declined email:', error);
    }
}
