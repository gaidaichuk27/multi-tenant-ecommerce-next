import {
    authEmptyApiResponseSchema,
    passwordForgotInputSchema,
} from '@repo/api';
import { createAuthProxyRoute } from '@lib/auth/create-auth-proxy-route';

export const POST = createAuthProxyRoute({
    backendPath: '/api/auth/password-forgot',
    inputSchema: passwordForgotInputSchema,
    backendResponseSchema: authEmptyApiResponseSchema,
    fallbackErrorMessage: 'Password reset request failed',
});
