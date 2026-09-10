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
    tMessage: AUTH_T_MESSAGES.REGISTER_CHECK_EMAIL,
    successMessage:
        'Registration successful. Check your email to verify your account.',
    fallbackErrorMessage: 'Registration failed',
});
