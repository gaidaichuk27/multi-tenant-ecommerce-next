import { TRPCClientError } from '@trpc/client';
import { ApiError, AUTH_T_MESSAGES, type CategoryDto } from '@repo/api';

import { getBrowserTrpcClient } from '@lib/trpc/browser-client';
import { toApiErrorFromTrpc } from '@lib/trpc/map-trpc-error';

async function wrapCategoryMutation<T>(action: () => Promise<T>): Promise<T> {
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

export async function createCategory(
    slug: string,
    name: string,
): Promise<CategoryDto> {
    return wrapCategoryMutation(() =>
        getBrowserTrpcClient().category.create.mutate({ slug, name }),
    );
}

export async function updateCategory(
    slug: string,
    categoryId: string,
    name: string,
): Promise<CategoryDto> {
    return wrapCategoryMutation(() =>
        getBrowserTrpcClient().category.update.mutate({
            slug,
            categoryId,
            name,
        }),
    );
}

export async function deleteCategory(
    slug: string,
    categoryId: string,
): Promise<{ success: true }> {
    return wrapCategoryMutation(() =>
        getBrowserTrpcClient().category.delete.mutate({ slug, categoryId }),
    );
}

export async function reorderCategories(
    slug: string,
    orderedIds: string[],
): Promise<CategoryDto[]> {
    return wrapCategoryMutation(() =>
        getBrowserTrpcClient().category.reorder.mutate({ slug, orderedIds }),
    );
}
