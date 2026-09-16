import {
    EMAIL_PATTERN,
    GROUP_SLUG_PATTERN,
    PASSWORD_PATTERN,
} from './validationPatterns';
import { DEFAULT_CHARACTER_LIMIT } from './characterLimit';
import { USERNAME_PATTERN } from '@repo/api';
import { TFunction } from 'i18next';

export const USERNAME_VALIDATION = (t: TFunction) => ({
    required: t('common:form.validation.required', {
        field: t('common:form.placeholder.username'),
    }),
    minLength: {
        value: 1,
        message: t('common:form.validation.min.length', {
            field: t('common:form.placeholder.username'),
            length: 1,
        }),
    },
    maxLength: {
        value: 100,
        message: t('common:form.validation.max.length', {
            field: t('common:form.placeholder.username'),
            length: 100,
        }),
    },
    pattern: {
        value: USERNAME_PATTERN,
        message: t('common:form.validation.username.pattern', {
            field: t('common:form.placeholder.username'),
        }),
    },
});

export const EMAIL_VALIDATION = (t: TFunction) => ({
    required: t('common:form.validation.required', {
        field: t('common:form.placeholder.email'),
    }),
    pattern: {
        value: EMAIL_PATTERN,
        message: t('common:form.validation.email.invalid', {
            field: t('common:form.placeholder.email'),
        }),
    },
});

export const PASSWORD_VALIDATION = (t: TFunction) => ({
    required: t('common:form.validation.required', {
        field: t('common:form.placeholder.password'),
    }),
    pattern: {
        value: PASSWORD_PATTERN,
        message: t('common:form.validation.password.pattern', {
            field: t('common:form.placeholder.password'),
        }),
    },
});

/** Login accepts legacy passwords — strength is enforced on register/change/restore. */
export const LOGIN_PASSWORD_VALIDATION = (t: TFunction) => ({
    required: t('common:form.validation.required', {
        field: t('common:form.placeholder.password'),
    }),
    minLength: {
        value: 8,
        message: t('common:form.validation.min.length', {
            field: t('common:form.placeholder.password'),
            length: 8,
        }),
    },
});

export const REPEAT_PASSWORD_VALIDATION = (t: TFunction) => ({
    required: t('common:form.validation.required', {
        field: t('common:form.placeholder.password.repeat'),
    }),
    pattern: {
        value: PASSWORD_PATTERN,
        message: t('common:form.validation.password.pattern', {
            field: t('common:form.placeholder.password.repeat'),
        }),
    },
});

export const GROUP_NAME_VALIDATION = (t: TFunction) => ({
    required: t('common:form.validation.required', {
        field: t('common:group.form.name'),
    }),
    minLength: {
        value: 1,
        message: t('common:form.validation.min.length', {
            field: t('common:group.form.name'),
            length: 1,
        }),
    },
    maxLength: {
        value: 255,
        message: t('common:form.validation.max.length', {
            field: t('common:group.form.name'),
            length: 255,
        }),
    },
});

export const GROUP_SLUG_VALIDATION = (t: TFunction) => ({
    required: t('common:form.validation.required', {
        field: t('common:group.form.slug'),
    }),
    minLength: {
        value: 3,
        message: t('common:form.validation.min.length', {
            field: t('common:group.form.slug'),
            length: 3,
        }),
    },
    maxLength: {
        value: 100,
        message: t('common:form.validation.max.length', {
            field: t('common:group.form.slug'),
            length: 100,
        }),
    },
    pattern: {
        value: GROUP_SLUG_PATTERN,
        message: t('common:form.validation.error', {
            field: t('common:group.form.slug'),
        }),
    },
});

export const GROUP_DESCRIPTION_VALIDATION = (t: TFunction) => ({
    maxLength: {
        value: 5000,
        message: t('common:form.validation.max.length', {
            field: t('common:group.form.description'),
            length: 5000,
        }),
    },
});

/** Shared maxLength rule — override `maxLength` per field (default 2000). */
export const maxLengthValidation = (
    t: TFunction,
    fieldLabel: string,
    maxLength: number = DEFAULT_CHARACTER_LIMIT,
) => ({
    maxLength: {
        value: maxLength,
        message: t('common:form.validation.max.length', {
            field: fieldLabel,
            length: maxLength,
        }),
    },
});

/** Post body: required + trim + max length (default {@link DEFAULT_CHARACTER_LIMIT}). */
export const POST_BODY_VALIDATION = (
    t: TFunction,
    maxLength: number = DEFAULT_CHARACTER_LIMIT,
) => ({
    required: t('common:form.validation.required', {
        field: t('common:group.feed.composer.body'),
    }),
    validate: (value: string) =>
        value.trim().length > 0 ||
        t('common:form.validation.required', {
            field: t('common:group.feed.composer.body'),
        }),
    ...maxLengthValidation(t, t('common:group.feed.composer.body'), maxLength),
});
