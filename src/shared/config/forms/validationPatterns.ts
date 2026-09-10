export { PASSWORD_PATTERN } from '@repo/api';

/** Allow plus-addressing and multi-part TLDs (aligned with Zod `.email()` on the API). */
export const EMAIL_PATTERN =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export const NAME_PATTERN =
    /^([a-zA-Z]{2,}(?:\s[a-zA-Z]{1,}(?:['-][a-zA-Z]{2,})?\s?([a-zA-Z]{1,})?)?)$/;

export const GROUP_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
