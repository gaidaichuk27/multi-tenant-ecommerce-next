import { TRPCClientError } from '@trpc/client';
import { ApiError } from '@repo/api';
import type { AppRouter } from '@TRPC/routers/_app';

const TRPC_ERROR_STATUS_BY_CODE = {
    UNAUTHORIZED: 401,
    CONFLICT: 409,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
} as const;

type TrpcErrorCode = keyof typeof TRPC_ERROR_STATUS_BY_CODE;

export function mapTrpcErrorCodeToStatus(code: string | undefined): number {
    if (code && code in TRPC_ERROR_STATUS_BY_CODE) {
        return TRPC_ERROR_STATUS_BY_CODE[code as TrpcErrorCode];
    }

    return 500;
}

export function toApiErrorFromTrpc(
    error: TRPCClientError<AppRouter>,
): ApiError {
    const tMessage = error.message;

    return new ApiError(
        mapTrpcErrorCodeToStatus(error.data?.code),
        tMessage,
        tMessage,
    );
}
