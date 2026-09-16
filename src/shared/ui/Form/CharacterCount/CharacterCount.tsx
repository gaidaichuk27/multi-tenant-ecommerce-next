'use client';

import { useTranslation } from 'react-i18next';
import { DEFAULT_CHARACTER_LIMIT } from '@shared/config/forms/characterLimit';
import { cn } from '@lib/utils';

interface CharacterCountProps {
    className?: string;
    /** Current field value (length is measured as-is). */
    value: string;
    /** Max characters allowed. Defaults to {@link DEFAULT_CHARACTER_LIMIT}. */
    maxLength?: number;
}

export function CharacterCount({
    className,
    value,
    maxLength = DEFAULT_CHARACTER_LIMIT,
}: CharacterCountProps) {
    const { t } = useTranslation(['common']);
    const current = value.length;
    const isOver = current > maxLength;

    return (
        <p
            className={cn(
                'text-muted-foreground text-xs tabular-nums',
                isOver && 'text-destructive',
                className,
            )}
            aria-live="polite"
        >
            {t('common:form.character_count', {
                current,
                max: maxLength,
            })}
        </p>
    );
}
