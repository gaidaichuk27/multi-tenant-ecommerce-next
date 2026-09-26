import { TRPCClientError } from '@trpc/client';
import {
    ApiError,
    AUTH_T_MESSAGES,
    type PostDto,
    type PostLikeResultDto,
    type PostPinResultDto,
    type PostReportDto,
    type PostReportResolveActionDto,
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

export async function createPost(
    slug: string,
    body: string,
    categoryId?: string | null,
): Promise<PostDto> {
    return wrapPostMutation(() =>
        getBrowserTrpcClient().post.create.mutate({
            slug,
            body,
            ...(categoryId !== undefined ? { categoryId } : {}),
        }),
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

export async function pinPost(
    slug: string,
    postId: string,
): Promise<PostPinResultDto> {
    return wrapPostMutation(() =>
        getBrowserTrpcClient().post.pin.mutate({ slug, postId }),
    );
}

export async function deletePost(
    slug: string,
    postId: string,
): Promise<{ success: true }> {
    return wrapPostMutation(() =>
        getBrowserTrpcClient().post.delete.mutate({ slug, postId }),
    );
}

export async function updatePost(
    slug: string,
    postId: string,
    body: string,
    categoryId?: string | null,
): Promise<PostDto> {
    return wrapPostMutation(() =>
        getBrowserTrpcClient().post.update.mutate({
            slug,
            postId,
            body,
            ...(categoryId !== undefined ? { categoryId } : {}),
        }),
    );
}

export async function reportPost(
    slug: string,
    postId: string,
    reason?: string,
): Promise<PostReportDto> {
    return wrapPostMutation(() =>
        getBrowserTrpcClient().post.report.mutate({
            slug,
            postId,
            ...(reason !== undefined ? { reason } : {}),
        }),
    );
}

export async function resolvePostReport(
    slug: string,
    reportId: string,
    action: PostReportResolveActionDto,
    note?: string,
): Promise<PostReportDto> {
    return wrapPostMutation(() =>
        getBrowserTrpcClient().post.resolveReport.mutate({
            slug,
            reportId,
            action,
            ...(note !== undefined ? { note } : {}),
        }),
    );
}
