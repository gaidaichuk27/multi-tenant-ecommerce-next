import { TRPCError } from '@trpc/server';

export function getTrpcErrorCode(error: unknown): string | null {
    if (error instanceof TRPCError) {
        return error.code;
    }

    if (typeof error === 'object' && error !== null) {
        if ('code' in error && typeof error.code === 'string') {
            return error.code;
        }

        if (
            'data' in error &&
            typeof error.data === 'object' &&
            error.data !== null &&
            'code' in error.data &&
            typeof (error.data as { code?: unknown }).code === 'string'
        ) {
            return (error.data as { code: string }).code;
        }
    }

    return null;
}

export function isTrpcErrorCode(error: unknown, code: string): boolean {
    return getTrpcErrorCode(error) === code;
}

export function getTrpcErrorMessage(error: unknown): string | null {
    if (error instanceof TRPCError) {
        return error.message;
    }

    if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message: unknown }).message === 'string'
    ) {
        return (error as { message: string }).message;
    }

    return null;
}
