import { memo } from 'react';
import { Typography } from '@shared/ui/Typography';
import { cn } from '@lib/utils';

interface ErrorMessageProps {
    className?: string;
    error: string;
}

export const ErrorMessage = memo(({ error, className }: ErrorMessageProps) => (
    <Typography
        as={'p'}
        variant="body-3"
        className={cn('mb-2 text-red-500', className)}
    >
        {error}
    </Typography>
));

ErrorMessage.displayName = 'ErrorMessage';
