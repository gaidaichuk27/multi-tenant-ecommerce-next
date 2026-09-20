import type { StorefrontLocale } from '@repo/api';
import { asStorefrontLocale } from './chrome';

type MembershipJoinRequestCopy = {
    subject: (groupName: string) => string;
    title: string;
    thankYou: string;
    bodyBeforeLink: (
        joinerDisplayName: string,
        joinerUsername: string,
        groupName: string,
    ) => string;
    cta: string;
};

type MembershipApprovedCopy = {
    subject: (groupName: string) => string;
    title: string;
    thankYou: string;
    bodyBeforeLink: (groupName: string) => string;
    cta: string;
};

type MembershipDeclinedCopy = {
    subject: (groupName: string) => string;
    title: string;
    thankYou: string;
    bodyBeforeLink: (groupName: string, declineReasonHtml?: string) => string;
    cta: string;
};

const JOIN_REQUEST: Record<StorefrontLocale, MembershipJoinRequestCopy> = {
    en: {
        subject: (groupName) => `Join request: ${groupName}`,
        title: 'New join request',
        thankYou: 'Thank you for choosing MEALSTOGO',
        bodyBeforeLink: (joinerDisplayName, joinerUsername, groupName) =>
            `<strong>${joinerDisplayName}</strong> (@${joinerUsername}) requested to join <strong>${groupName}</strong> on MEALSTOGO. Review pending requests to approve or decline by clicking the button below`,
        cta: 'Review pending',
    },
    ua: {
        subject: (groupName) => `Запит на приєднання: ${groupName}`,
        title: 'Новий запит на приєднання',
        thankYou: 'Дякуємо, що обрали MEALSTOGO',
        bodyBeforeLink: (joinerDisplayName, joinerUsername, groupName) =>
            `<strong>${joinerDisplayName}</strong> (@${joinerUsername}) надіслав(ла) запит на приєднання до <strong>${groupName}</strong> на MEALSTOGO. Перегляньте запити, щоб схвалити або відхилити, натиснувши кнопку нижче`,
        cta: 'Переглянути запити',
    },
    pl: {
        subject: (groupName) => `Prośba o dołączenie: ${groupName}`,
        title: 'Nowa prośba o dołączenie',
        thankYou: 'Dziękujemy, że wybierasz MEALSTOGO',
        bodyBeforeLink: (joinerDisplayName, joinerUsername, groupName) =>
            `<strong>${joinerDisplayName}</strong> (@${joinerUsername}) prosi o dołączenie do <strong>${groupName}</strong> na MEALSTOGO. Przejrzyj oczekujące prośby, aby zatwierdzić lub odrzucić, klikając przycisk poniżej`,
        cta: 'Przejrzyj prośby',
    },
    de: {
        subject: (groupName) => `Beitrittsanfrage: ${groupName}`,
        title: 'Neue Beitrittsanfrage',
        thankYou: 'Danke, dass Sie MEALSTOGO wählen',
        bodyBeforeLink: (joinerDisplayName, joinerUsername, groupName) =>
            `<strong>${joinerDisplayName}</strong> (@${joinerUsername}) möchte <strong>${groupName}</strong> auf MEALSTOGO beitreten. Prüfen Sie ausstehende Anfragen zum Genehmigen oder Ablehnen über den Button unten`,
        cta: 'Anfragen prüfen',
    },
};

const APPROVED: Record<StorefrontLocale, MembershipApprovedCopy> = {
    en: {
        subject: (groupName) => `You're approved: ${groupName}`,
        title: "You're approved",
        thankYou: 'Thank you for choosing MEALSTOGO',
        bodyBeforeLink: (groupName) =>
            `Your request to join <strong>${groupName}</strong> on MEALSTOGO was approved. Open the group and start participating by clicking the button below`,
        cta: 'Open group',
    },
    ua: {
        subject: (groupName) => `Вас схвалено: ${groupName}`,
        title: 'Вас схвалено',
        thankYou: 'Дякуємо, що обрали MEALSTOGO',
        bodyBeforeLink: (groupName) =>
            `Ваш запит на приєднання до <strong>${groupName}</strong> на MEALSTOGO схвалено. Відкрийте спільноту та почніть брати участь, натиснувши кнопку нижче`,
        cta: 'Відкрити спільноту',
    },
    pl: {
        subject: (groupName) => `Dołączenie zatwierdzone: ${groupName}`,
        title: 'Dołączenie zatwierdzone',
        thankYou: 'Dziękujemy, że wybierasz MEALSTOGO',
        bodyBeforeLink: (groupName) =>
            `Twoja prośba o dołączenie do <strong>${groupName}</strong> na MEALSTOGO została zatwierdzona. Otwórz grupę i zacznij uczestniczyć, klikając przycisk poniżej`,
        cta: 'Otwórz grupę',
    },
    de: {
        subject: (groupName) => `Beitritt genehmigt: ${groupName}`,
        title: 'Beitritt genehmigt',
        thankYou: 'Danke, dass Sie MEALSTOGO wählen',
        bodyBeforeLink: (groupName) =>
            `Ihre Anfrage, <strong>${groupName}</strong> auf MEALSTOGO beizutreten, wurde genehmigt. Öffnen Sie die Gruppe und nehmen Sie teil über den Button unten`,
        cta: 'Gruppe öffnen',
    },
};

const DECLINED: Record<StorefrontLocale, MembershipDeclinedCopy> = {
    en: {
        subject: (groupName) => `Join request declined: ${groupName}`,
        title: 'Join request declined',
        thankYou: 'Thank you for choosing MEALSTOGO',
        bodyBeforeLink: (groupName, declineReasonHtml) =>
            `Your request to join <strong>${groupName}</strong> on MEALSTOGO was declined. ${
                declineReasonHtml
                    ? `A note from the group: <strong>${declineReasonHtml}</strong>. `
                    : 'You can review the group and request again later if it still fits. '
            }View the group by clicking the button below`,
        cta: 'View group',
    },
    ua: {
        subject: (groupName) => `Запит відхилено: ${groupName}`,
        title: 'Запит на приєднання відхилено',
        thankYou: 'Дякуємо, що обрали MEALSTOGO',
        bodyBeforeLink: (groupName, declineReasonHtml) =>
            `Ваш запит на приєднання до <strong>${groupName}</strong> на MEALSTOGO відхилено. ${
                declineReasonHtml
                    ? `Примітка від спільноти: <strong>${declineReasonHtml}</strong>. `
                    : 'Ви можете переглянути спільноту й подати запит пізніше, якщо вона вам підходить. '
            }Перегляньте спільноту, натиснувши кнопку нижче`,
        cta: 'Переглянути спільноту',
    },
    pl: {
        subject: (groupName) => `Prośba odrzucona: ${groupName}`,
        title: 'Prośba o dołączenie odrzucona',
        thankYou: 'Dziękujemy, że wybierasz MEALSTOGO',
        bodyBeforeLink: (groupName, declineReasonHtml) =>
            `Twoja prośba o dołączenie do <strong>${groupName}</strong> na MEALSTOGO została odrzucona. ${
                declineReasonHtml
                    ? `Notatka od grupy: <strong>${declineReasonHtml}</strong>. `
                    : 'Możesz przejrzeć grupę i wysłać prośbę ponownie później, jeśli nadal Ci odpowiada. '
            }Zobacz grupę, klikając przycisk poniżej`,
        cta: 'Zobacz grupę',
    },
    de: {
        subject: (groupName) => `Beitrittsanfrage abgelehnt: ${groupName}`,
        title: 'Beitrittsanfrage abgelehnt',
        thankYou: 'Danke, dass Sie MEALSTOGO wählen',
        bodyBeforeLink: (groupName, declineReasonHtml) =>
            `Ihre Anfrage, <strong>${groupName}</strong> auf MEALSTOGO beizutreten, wurde abgelehnt. ${
                declineReasonHtml
                    ? `Hinweis der Gruppe: <strong>${declineReasonHtml}</strong>. `
                    : 'Sie können die Gruppe ansehen und später erneut anfragen, wenn sie noch passt. '
            }Öffnen Sie die Gruppe über den Button unten`,
        cta: 'Gruppe ansehen',
    },
};

export function getMembershipJoinRequestCopy(locale?: string) {
    return JOIN_REQUEST[asStorefrontLocale(locale)];
}

export function getMembershipApprovedCopy(locale?: string) {
    return APPROVED[asStorefrontLocale(locale)];
}

export function getMembershipDeclinedCopy(locale?: string) {
    return DECLINED[asStorefrontLocale(locale)];
}
