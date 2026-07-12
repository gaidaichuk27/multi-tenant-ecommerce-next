import { z } from 'zod';

/** i18n key in `common` namespace — used by Zod and `resolveSubmitError`. */
export const USERNAME_VALIDATION_MESSAGE_KEY =
    'form.validation.username.pattern';

/** Letters, numbers, underscore, hyphen — shared by Zod schemas and client forms. */
export const USERNAME_PATTERN = /^[a-zA-Z0-9_-]+$/;

export const usernameFieldSchema = z
    .string()
    .min(1)
    .max(100)
    .regex(USERNAME_PATTERN, { message: USERNAME_VALIDATION_MESSAGE_KEY });
