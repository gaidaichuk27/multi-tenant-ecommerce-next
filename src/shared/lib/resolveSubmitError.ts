import { AUTH_T_MESSAGES, isApiError } from '@repo/api';
import { TRPCClientError } from '@trpc/client';
import type { TFunction } from 'i18next';

function translateMessageKey(
    t: TFunction,
    key: string,
    fallback?: string,
): string {
    return t(`common:${key}`, { defaultValue: fallback ?? key });
}

export function resolveSubmitError(error: unknown, t: TFunction): string {
    if (isApiError(error)) {
        if (error.tMessage === AUTH_T_MESSAGES.VALIDATION_ERROR) {
            // TODO: API should return structured validation errors
            // ({ key, field, params }) instead of issues[0].message so each
            // form gets the correct {{field}} label — not only register username.
            const fieldMessage = t(`common:${error.message}`, {
                field: t('common:form.placeholder.username'),
                defaultValue: error.message,
            });

            if (fieldMessage !== error.message) {
                return fieldMessage;
            }

            return t('common:form.validation.error');
        }

        return translateMessageKey(t, error.tMessage, error.message);
    }

    if (error instanceof TRPCClientError) {
        return translateMessageKey(t, error.message);
    }

    return t('common:error.global');
}
