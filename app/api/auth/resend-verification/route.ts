import {
    authEmptyApiResponseSchema,
    resendVerificationInputSchema,
} from '@repo/api';
import { createAuthProxyRoute } from '@lib/auth/create-auth-proxy-route';

export const POST = createAuthProxyRoute({
    backendPath: '/api/auth/resend-verification',
    inputSchema: resendVerificationInputSchema,
    backendResponseSchema: authEmptyApiResponseSchema,
    fallbackErrorMessage: 'Failed to resend verification email',
    forwardAuth: true,
});
