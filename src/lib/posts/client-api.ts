import { TRPCClientError } from '@trpc/client';
import {
    ApiError,
    AUTH_T_MESSAGES,
    type PostDto,
    type PostLikeResultDto,
} from '@repo/api';

import { getBrowserTrpcClient } from '@lib/trpc/browser-client';
import { toApiErrorFromTrpc } from '@lib/trpc/map-trpc-error';

async function wrapPostMutation<T>(action: () => Promise<T>): Promise<T> {
    try {
        return await action();
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

export async function createPost(slug: string, body: string): Promise<PostDto> {
    return wrapPostMutation(() =>
        getBrowserTrpcClient().post.create.mutate({ slug, body }),
    );
}

export async function togglePostLike(
    slug: string,
    postId: string,
): Promise<PostLikeResultDto> {
    return wrapPostMutation(() =>
        getBrowserTrpcClient().post.like.mutate({ slug, postId }),
    );
}
