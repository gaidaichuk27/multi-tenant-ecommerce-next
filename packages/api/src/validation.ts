import { z } from 'zod';

/** i18n key in `common` namespace — used by Zod and `resolveSubmitError`. */
export const USERNAME_VALIDATION_MESSAGE_KEY =
    'form.validation.username.pattern';

export const PASSWORD_VALIDATION_MESSAGE_KEY =
    'form.validation.password.pattern';

/** Letters, numbers, underscore, hyphen — shared by Zod schemas and client forms. */
export const USERNAME_PATTERN = /^[a-zA-Z0-9_-]+$/;

/**
 * Upper, lower, digit, special (@$!%*?&), min 8 — shared by Zod API contracts and UI forms.
 */
export const PASSWORD_PATTERN =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const usernameFieldSchema = z
    .string()
    .min(1)
    .max(100)
    .regex(USERNAME_PATTERN, { message: USERNAME_VALIDATION_MESSAGE_KEY });

export const passwordFieldSchema = z
    .string()
    .max(128)
    .regex(PASSWORD_PATTERN, { message: PASSWORD_VALIDATION_MESSAGE_KEY });
