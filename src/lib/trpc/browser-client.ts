import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@TRPC/routers/_app';

let browserTrpcClient: ReturnType<typeof createTRPCClient<AppRouter>> | null =
    null;

export function getBrowserTrpcClient() {
    if (!browserTrpcClient) {
        browserTrpcClient = createTRPCClient<AppRouter>({
            links: [
                httpBatchLink({
                    url: '/api/trpc',
                    fetch(url, options) {
                        return fetch(url, {
                            ...options,
                            credentials: 'include',
                        });
                    },
                }),
            ],
        });
    }

    return browserTrpcClient;
}
