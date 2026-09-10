import { authVerifyEmailApiResponseSchema } from '@repo/api';
import { createAuthProxyRoute } from '@lib/auth/create-auth-proxy-route';

export const GET = createAuthProxyRoute({
    backendPath: '/api/auth/verify-email',
    method: 'GET',
    backendResponseSchema: authVerifyEmailApiResponseSchema,
    fallbackErrorMessage: 'Email verification failed',
});
