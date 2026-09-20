import { Language, type StorefrontLocale } from '@repo/api';
import { getPreselectedLocale } from '../languageMeta';

export type EmailChromeCopy = {
    needHelp: string;
    askAt: string;
    visitOur: string;
    helpCenter: string;
    socialHeading: string;
    footerBlurb: string;
    privacy: string;
    unsubscribe: string;
};

const CHROME: Record<StorefrontLocale, EmailChromeCopy> = {
    en: {
        needHelp: 'Need help?',
        askAt: 'Ask at',
        visitOur: 'Visit our',
        helpCenter: 'Help center',
        socialHeading: 'Like it! Love it! Share it!',
        footerBlurb:
            'You are receiving this email because you have visited our site or asked us about the regular newsletter. Make sure our messages get to your Inbox (and not your bulk or junk folders).',
        privacy: 'Privacy policy',
        unsubscribe: 'Unsubscribe',
    },
    ua: {
        needHelp: 'Потрібна допомога?',
        askAt: 'Напишіть на',
        visitOur: 'Відвідайте',
        helpCenter: 'Центр допомоги',
        socialHeading: 'Подобається? Поділіться!',
        footerBlurb:
            'Ви отримали цей лист, бо відвідували наш сайт або запитували про новини. Переконайтеся, що наші повідомлення потрапляють у Вхідні (а не в спам).',
        privacy: 'Політика конфіденційності',
        unsubscribe: 'Відписатися',
    },
    pl: {
        needHelp: 'Potrzebujesz pomocy?',
        askAt: 'Napisz na',
        visitOur: 'Odwiedź',
        helpCenter: 'Centrum pomocy',
        socialHeading: 'Lubisz to? Podziel się!',
        footerBlurb:
            'Otrzymujesz tę wiadomość, ponieważ odwiedziłeś naszą stronę lub pytałeś o newsletter. Upewnij się, że nasze wiadomości trafiają do Skrzynki odbiorczej (a nie do spamu).',
        privacy: 'Polityka prywatności',
        unsubscribe: 'Wypisz się',
    },
    de: {
        needHelp: 'Brauchen Sie Hilfe?',
        askAt: 'Schreiben Sie an',
        visitOur: 'Besuchen Sie unser',
        helpCenter: 'Hilfecenter',
        socialHeading: 'Gefällt es? Teilen Sie es!',
        footerBlurb:
            'Sie erhalten diese E-Mail, weil Sie unsere Website besucht oder nach dem Newsletter gefragt haben. Stellen Sie sicher, dass unsere Nachrichten im Posteingang ankommen (nicht im Spam).',
        privacy: 'Datenschutz',
        unsubscribe: 'Abmelden',
    },
};

export function asStorefrontLocale(locale?: string): StorefrontLocale {
    if (locale && (Object.values(Language) as string[]).includes(locale)) {
        return locale as StorefrontLocale;
    }

    return getPreselectedLocale();
}

export function getEmailChromeCopy(locale?: string): EmailChromeCopy {
    return CHROME[asStorefrontLocale(locale)];
}

/** @deprecated Prefer getEmailChromeCopy. */
export const getMembershipChromeCopy = getEmailChromeCopy;
