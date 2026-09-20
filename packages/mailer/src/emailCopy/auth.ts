import type { StorefrontLocale } from '@repo/api';
import { asStorefrontLocale } from './chrome';

type AuthActionCopy = {
    subject: string;
    title: string;
    thankYou: string;
    bodyHtml: (emailHtml: string, url: string) => string;
    cta: string;
};

type AuthCouponCopy = {
    subject: string;
    title: string;
    thankYou: string;
    bodyHtml: string;
};

const VERIFICATION: Record<StorefrontLocale, AuthActionCopy> = {
    en: {
        subject: 'Verify your email',
        title: 'Verify your email and receive a 20% coupon!',
        thankYou: 'Thank you for choosing MEALSTOGO',
        bodyHtml: (email, url) =>
            `Please confirm that <strong>${email}</strong> is your email address by clicking the button below or use this link <a href="${url}" target="_blank" style="color:#134f5c;text-decoration:none;word-break:break-all;">${url}</a> within <strong>48 hours</strong>.`,
        cta: 'Verify',
    },
    ua: {
        subject: 'Підтвердіть email',
        title: 'Підтвердіть email і отримайте купон на 20%!',
        thankYou: 'Дякуємо, що обрали MEALSTOGO',
        bodyHtml: (email, url) =>
            `Будь ласка, підтвердіть, що <strong>${email}</strong> — ваша адреса, натиснувши кнопку нижче або перейшовши за посиланням <a href="${url}" target="_blank" style="color:#134f5c;text-decoration:none;word-break:break-all;">${url}</a> протягом <strong>48 годин</strong>.`,
        cta: 'Підтвердити',
    },
    pl: {
        subject: 'Potwierdź e-mail',
        title: 'Potwierdź e-mail i otrzymaj kupon 20%!',
        thankYou: 'Dziękujemy, że wybierasz MEALSTOGO',
        bodyHtml: (email, url) =>
            `Potwierdź, że <strong>${email}</strong> to Twój adres e-mail, klikając przycisk poniżej lub korzystając z linku <a href="${url}" target="_blank" style="color:#134f5c;text-decoration:none;word-break:break-all;">${url}</a> w ciągu <strong>48 godzin</strong>.`,
        cta: 'Potwierdź',
    },
    de: {
        subject: 'E-Mail bestätigen',
        title: 'E-Mail bestätigen und 20% Gutschein erhalten!',
        thankYou: 'Danke, dass Sie MEALSTOGO wählen',
        bodyHtml: (email, url) =>
            `Bitte bestätigen Sie, dass <strong>${email}</strong> Ihre E-Mail-Adresse ist, über den Button unten oder diesen Link <a href="${url}" target="_blank" style="color:#134f5c;text-decoration:none;word-break:break-all;">${url}</a> innerhalb von <strong>48 Stunden</strong>.`,
        cta: 'Bestätigen',
    },
};

const FORGOT: Record<StorefrontLocale, AuthActionCopy> = {
    en: {
        subject: 'Reset your password',
        title: 'Follow the link to reset your password',
        thankYou: 'Thank you for choosing MEALSTOGO',
        bodyHtml: (email, url) =>
            `You received this email because a password reset was requested for <strong>${email}</strong>. Reset your password using this link <a href="${url}" target="_blank" style="color:#134f5c;text-decoration:none;word-break:break-all;">${url}</a>.`,
        cta: 'Reset password',
    },
    ua: {
        subject: 'Скидання пароля',
        title: 'Перейдіть за посиланням, щоб скинути пароль',
        thankYou: 'Дякуємо, що обрали MEALSTOGO',
        bodyHtml: (email, url) =>
            `Ви отримали цей лист, бо для <strong>${email}</strong> запитали скидання пароля. Скиньте пароль за посиланням <a href="${url}" target="_blank" style="color:#134f5c;text-decoration:none;word-break:break-all;">${url}</a>.`,
        cta: 'Скинути пароль',
    },
    pl: {
        subject: 'Reset hasła',
        title: 'Użyj linku, aby zresetować hasło',
        thankYou: 'Dziękujemy, że wybierasz MEALSTOGO',
        bodyHtml: (email, url) =>
            `Otrzymałeś tę wiadomość, ponieważ poproszono o reset hasła dla <strong>${email}</strong>. Zresetuj hasło przez link <a href="${url}" target="_blank" style="color:#134f5c;text-decoration:none;word-break:break-all;">${url}</a>.`,
        cta: 'Resetuj hasło',
    },
    de: {
        subject: 'Passwort zurücksetzen',
        title: 'Folgen Sie dem Link, um Ihr Passwort zurückzusetzen',
        thankYou: 'Danke, dass Sie MEALSTOGO wählen',
        bodyHtml: (email, url) =>
            `Sie erhalten diese E-Mail, weil für <strong>${email}</strong> ein Passwort-Reset angefordert wurde. Setzen Sie Ihr Passwort über diesen Link zurück: <a href="${url}" target="_blank" style="color:#134f5c;text-decoration:none;word-break:break-all;">${url}</a>.`,
        cta: 'Passwort zurücksetzen',
    },
};

const CHANGED: Record<StorefrontLocale, AuthActionCopy> = {
    en: {
        subject: 'Your password was changed',
        title: 'Your password was changed',
        thankYou: 'Thank you for choosing MEALSTOGO',
        bodyHtml: (email, url) =>
            `You received this email because the password for <strong>${email}</strong> was changed. If this was you, no action is needed. Visit the site: <a href="${url}" target="_blank" style="color:#134f5c;text-decoration:none;word-break:break-all;">${url}</a>.`,
        cta: 'Visit our website',
    },
    ua: {
        subject: 'Ваш пароль змінено',
        title: 'Ваш пароль змінено',
        thankYou: 'Дякуємо, що обрали MEALSTOGO',
        bodyHtml: (email, url) =>
            `Ви отримали цей лист, бо пароль для <strong>${email}</strong> було змінено. Якщо це були ви — нічого робити не потрібно. Сайт: <a href="${url}" target="_blank" style="color:#134f5c;text-decoration:none;word-break:break-all;">${url}</a>.`,
        cta: 'Перейти на сайт',
    },
    pl: {
        subject: 'Twoje hasło zostało zmienione',
        title: 'Twoje hasło zostało zmienione',
        thankYou: 'Dziękujemy, że wybierasz MEALSTOGO',
        bodyHtml: (email, url) =>
            `Otrzymałeś tę wiadomość, ponieważ hasło dla <strong>${email}</strong> zostało zmienione. Jeśli to Ty — nic nie musisz robić. Strona: <a href="${url}" target="_blank" style="color:#134f5c;text-decoration:none;word-break:break-all;">${url}</a>.`,
        cta: 'Odwiedź stronę',
    },
    de: {
        subject: 'Ihr Passwort wurde geändert',
        title: 'Ihr Passwort wurde geändert',
        thankYou: 'Danke, dass Sie MEALSTOGO wählen',
        bodyHtml: (email, url) =>
            `Sie erhalten diese E-Mail, weil das Passwort für <strong>${email}</strong> geändert wurde. Wenn Sie das waren, ist nichts zu tun. Website: <a href="${url}" target="_blank" style="color:#134f5c;text-decoration:none;word-break:break-all;">${url}</a>.`,
        cta: 'Website besuchen',
    },
};

const CONFIRMED: Record<StorefrontLocale, AuthCouponCopy> = {
    en: {
        subject: 'Your email is verified',
        title: 'Your email is verified',
        thankYou: 'Thank you for choosing MEALSTOGO',
        bodyHtml: 'Here is your 20% free coupon code.',
    },
    ua: {
        subject: 'Ваш email підтверджено',
        title: 'Ваш email підтверджено',
        thankYou: 'Дякуємо, що обрали MEALSTOGO',
        bodyHtml: 'Ось ваш безкоштовний купон на 20%.',
    },
    pl: {
        subject: 'Twój e-mail został zweryfikowany',
        title: 'Twój e-mail został zweryfikowany',
        thankYou: 'Dziękujemy, że wybierasz MEALSTOGO',
        bodyHtml: 'Oto Twój darmowy kupon 20%.',
    },
    de: {
        subject: 'Ihre E-Mail ist bestätigt',
        title: 'Ihre E-Mail ist bestätigt',
        thankYou: 'Danke, dass Sie MEALSTOGO wählen',
        bodyHtml: 'Hier ist Ihr kostenloser 20%-Gutscheincode.',
    },
};

export function getAccountVerificationCopy(locale?: string) {
    return VERIFICATION[asStorefrontLocale(locale)];
}

export function getForgotPasswordCopy(locale?: string) {
    return FORGOT[asStorefrontLocale(locale)];
}

export function getChangePasswordCopy(locale?: string) {
    return CHANGED[asStorefrontLocale(locale)];
}

export function getEmailConfirmationCopy(locale?: string) {
    return CONFIRMED[asStorefrontLocale(locale)];
}
