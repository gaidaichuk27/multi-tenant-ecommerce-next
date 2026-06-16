import {
    EMAIL_PATTERN,
    NAME_PATTERN,
    PASSWORD_PATTERN,
} from './validationPatterns';
import { TFunction } from 'i18next';

export const USERNAME_VALIDATION = (t: TFunction) => ({
    required: t('common:form.validation.required', {
        field: t('common:form.placeholder.username'),
    }),
    minLength: {
        value: 3,
        message: t('common:form.validation.min.length', {
            field: t('common:form.placeholder.username'),
            length: 3,
        }),
    },
    maxLength: {
        value: 30,
        message: t('common:form.validation.max.length', {
            field: t('common:form.placeholder.username'),
            length: 30,
        }),
    },
    pattern: {
        value: NAME_PATTERN,
        message: t('common:form.validation.error', {
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
