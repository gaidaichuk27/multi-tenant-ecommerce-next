import { TRPCClientError } from '@trpc/client';
import {
    ApiError,
    AUTH_T_MESSAGES,
    type CreateGroupInput,
    type GroupDto,
} from '@repo/api';

import { getBrowserTrpcClient } from '@lib/trpc/browser-client';
import { toApiErrorFromTrpc } from '@lib/trpc/map-trpc-error';

export async function createGroup(input: CreateGroupInput): Promise<GroupDto> {
    try {
        return await getBrowserTrpcClient().group.create.mutate(input);
    } catch (error) {
        if (error instanceof TRPCClientError) {
            throw toApiErrorFromTrpc(error);
        }

        throw new ApiError(
            500,
            AUTH_T_MESSAGES.INTERNAL_ERROR,
            'Request failed',
        );
    }
}
