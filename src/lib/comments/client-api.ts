import { TRPCClientError } from '@trpc/client';
import { ApiError, AUTH_T_MESSAGES, type CommentDto } from '@repo/api';

import { getBrowserTrpcClient } from '@lib/trpc/browser-client';
import { toApiErrorFromTrpc } from '@lib/trpc/map-trpc-error';

async function wrapCommentMutation<T>(action: () => Promise<T>): Promise<T> {
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

export async function createComment(input: {
    slug: string;
    postId: string;
    body: string;
    parentId?: string;
}): Promise<CommentDto> {
    return wrapCommentMutation(() =>
        getBrowserTrpcClient().comment.create.mutate({
            slug: input.slug,
            postId: input.postId,
            body: input.body,
            parentId: input.parentId,
        }),
    );
}
