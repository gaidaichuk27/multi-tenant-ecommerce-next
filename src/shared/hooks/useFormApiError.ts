import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { resolveSubmitError } from '@shared/lib/resolveSubmitError';

export function useFormApiError() {
    const { t } = useTranslation(['common']);

    return useCallback((error: unknown) => resolveSubmitError(error, t), [t]);
}
