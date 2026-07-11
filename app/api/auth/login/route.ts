import {
    AUTH_T_MESSAGES,
    authLoginApiResponseSchema,
    loginInputSchema,
} from '@repo/api';
import { createAuthSessionRoute } from '@lib/auth/create-auth-session-route';

export const POST = createAuthSessionRoute({
    backendPath: '/api/auth/login',
    inputSchema: loginInputSchema,
    backendResponseSchema: authLoginApiResponseSchema,
    successStatus: 200,
    tMessage: AUTH_T_MESSAGES.LOGIN_SUCCESS,
    successMessage: 'Login successful',
    fallbackErrorMessage: 'Login failed',
});
