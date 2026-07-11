import {
    AUTH_T_MESSAGES,
    authRegisterApiResponseSchema,
    registerInputSchema,
} from '@repo/api';
import { createAuthSessionRoute } from '@lib/auth/create-auth-session-route';

export const POST = createAuthSessionRoute({
    backendPath: '/api/auth/register',
    inputSchema: registerInputSchema,
    backendResponseSchema: authRegisterApiResponseSchema,
    successStatus: 201,
    tMessage: AUTH_T_MESSAGES.REGISTER_SUCCESS,
    successMessage: 'Registration successful',
    fallbackErrorMessage: 'Registration failed',
});
