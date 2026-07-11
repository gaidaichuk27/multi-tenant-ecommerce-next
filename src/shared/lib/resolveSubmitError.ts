import { isApiError } from '@repo/api';
import { TRPCClientError } from '@trpc/client';
import type { TFunction } from 'i18next';

export function resolveSubmitError(error: unknown, t: TFunction): string {
    if (isApiError(error)) {
        return t(`common:${error.tMessage}`, {
            defaultValue: error.message,
        });
    }

    if (error instanceof TRPCClientError) {
        return t(`common:${error.message}`, { defaultValue: error.message });
    }

    return t('common:error.global');
}
