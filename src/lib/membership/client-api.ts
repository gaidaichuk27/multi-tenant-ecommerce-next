import { TRPCClientError } from '@trpc/client';
import { ApiError, AUTH_T_MESSAGES, type MembershipDto } from '@repo/api';

import { getBrowserTrpcClient } from '@lib/trpc/browser-client';
import { toApiErrorFromTrpc } from '@lib/trpc/map-trpc-error';
import type { Language } from '@shared/config/locales/types';

async function wrapMembershipMutation<T>(action: () => Promise<T>): Promise<T> {
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

export async function requestJoinGroup(
    slug: string,
    locale: Language,
): Promise<MembershipDto> {
    return wrapMembershipMutation(() =>
        getBrowserTrpcClient().membership.requestJoin.mutate({ slug, locale }),
    );
}

export async function leaveGroup(slug: string): Promise<{ success: true }> {
    return wrapMembershipMutation(() =>
        getBrowserTrpcClient().membership.leave.mutate({ slug }),
    );
}

export async function approveMembership(
    slug: string,
    userId: string,
    locale: Language,
): Promise<MembershipDto> {
    return wrapMembershipMutation(() =>
        getBrowserTrpcClient().membership.approve.mutate({
            slug,
            userId,
            locale,
        }),
    );
}

export async function declineMembership(
    slug: string,
    userId: string,
    locale: Language,
    declineReason?: string,
): Promise<{ success: true }> {
    return wrapMembershipMutation(() =>
        getBrowserTrpcClient().membership.decline.mutate({
            slug,
            userId,
            locale,
            declineReason,
        }),
    );
}
