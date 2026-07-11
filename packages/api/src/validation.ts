import { z } from 'zod';

/** Letters, numbers, underscore, hyphen — shared by Zod schemas and client forms. */
export const USERNAME_PATTERN = /^[a-zA-Z0-9_-]+$/;

export const usernameFieldSchema = z
    .string()
    .min(1)
    .max(100)
    .regex(USERNAME_PATTERN);
