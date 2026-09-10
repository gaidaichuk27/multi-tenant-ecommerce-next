import {
    authEmptyApiResponseSchema,
    passwordRestoreInputSchema,
} from '@repo/api';
import { createAuthProxyRoute } from '@lib/auth/create-auth-proxy-route';

export const POST = createAuthProxyRoute({
    backendPath: '/api/auth/password-restore',
    inputSchema: passwordRestoreInputSchema,
    backendResponseSchema: authEmptyApiResponseSchema,
    fallbackErrorMessage: 'Password restore failed',
});
