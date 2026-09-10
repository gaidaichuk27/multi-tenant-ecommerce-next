import { z } from 'zod';
import { apiResponseSchema } from './response';
import { passwordFieldSchema, usernameFieldSchema } from './validation';

export const userRoleSchema = z.enum(['user', 'super-admin']);

export const userSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    username: z.string().min(1),
    name: z.string().nullable(),
    avatarUrl: z.string().nullable(),
    roles: z.array(userRoleSchema),
    isEmailConfirmed: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const authMeDataSchema = z.object({
    user: userSchema,
});

export const authTokenDataSchema = z.object({
    token: z.string(),
    user: userSchema,
});

export const authUserDataSchema = z.object({
    user: userSchema,
});

export const authEmptyDataSchema = z.object({});

/** Verify-email success has no payload (email is not echoed to token holders). */
export const verifyEmailDataSchema = authEmptyDataSchema;

export const authLoginApiResponseSchema =
    apiResponseSchema(authTokenDataSchema);
export const authRegisterApiResponseSchema =
    apiResponseSchema(authTokenDataSchema);
export const authMeApiResponseSchema = apiResponseSchema(authMeDataSchema);
export const authUserApiResponseSchema = apiResponseSchema(authUserDataSchema);
export const authLogoutApiResponseSchema = apiResponseSchema(z.object({}));
export const authEmptyApiResponseSchema =
    apiResponseSchema(authEmptyDataSchema);
export const authVerifyEmailApiResponseSchema =
    apiResponseSchema(authEmptyDataSchema);
export const authPasswordChangeApiResponseSchema =
    apiResponseSchema(authTokenDataSchema);

export const loginInputSchema = z.object({
    email: z.string().email(),
    /** Login keeps min length so legacy weak passwords can still sign in. */
    password: z.string().min(8),
});

export const registerInputSchema = z.object({
    email: z.string().email(),
    password: passwordFieldSchema,
    username: usernameFieldSchema,
    name: z.string().min(1).max(255).optional(),
    locale: z.string().min(2).max(5).optional(),
});

export const passwordForgotInputSchema = z.object({
    email: z.string().email(),
    locale: z.string().min(2).max(5).optional(),
});

export const passwordRestoreInputSchema = z.object({
    token: z.string().min(1),
    password: passwordFieldSchema,
});

export const passwordChangeInputSchema = z.object({
    oldPassword: z.string().min(8),
    newPassword: passwordFieldSchema,
    locale: z.string().min(2).max(5).optional(),
});

export const resendVerificationInputSchema = z.object({
    locale: z.string().min(2).max(5).optional(),
});

export const verifyEmailQuerySchema = z.object({
    token: z.string().min(1),
    locale: z.string().min(2).max(5).optional(),
});

export type UserDto = z.infer<typeof userSchema>;
export type UserRoleDto = z.infer<typeof userRoleSchema>;
export type AuthMeData = z.infer<typeof authMeDataSchema>;
export type AuthTokenData = z.infer<typeof authTokenDataSchema>;
export type AuthUserData = z.infer<typeof authUserDataSchema>;
export type AuthLoginApiResponse = z.infer<typeof authLoginApiResponseSchema>;
export type AuthRegisterApiResponse = z.infer<
    typeof authRegisterApiResponseSchema
>;
export type AuthMeApiResponse = z.infer<typeof authMeApiResponseSchema>;
export type AuthUserApiResponse = z.infer<typeof authUserApiResponseSchema>;
export type AuthLogoutApiResponse = z.infer<typeof authLogoutApiResponseSchema>;
export type AuthEmptyApiResponse = z.infer<typeof authEmptyApiResponseSchema>;
export type AuthVerifyEmailApiResponse = z.infer<
    typeof authVerifyEmailApiResponseSchema
>;
export type AuthPasswordChangeApiResponse = z.infer<
    typeof authPasswordChangeApiResponseSchema
>;
export type VerifyEmailData = z.infer<typeof verifyEmailDataSchema>;

export type LoginInput = z.infer<typeof loginInputSchema>;
export type RegisterInput = z.infer<typeof registerInputSchema>;
export type PasswordForgotInput = z.infer<typeof passwordForgotInputSchema>;
export type PasswordRestoreInput = z.infer<typeof passwordRestoreInputSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeInputSchema>;
export type ResendVerificationInput = z.infer<
    typeof resendVerificationInputSchema
>;
export type VerifyEmailQuery = z.infer<typeof verifyEmailQuerySchema>;

export function serializeUser(user: {
    id: string;
    email: string;
    username: string;
    name: string | null;
    avatarUrl: string | null;
    roles: ('user' | 'super_admin')[];
    isEmailConfirmed: boolean;
    createdAt: Date;
    updatedAt: Date;
}): UserDto {
    return {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        avatarUrl: user.avatarUrl,
        roles: user.roles.map((role) =>
            role === 'super_admin' ? 'super-admin' : role,
        ),
        isEmailConfirmed: user.isEmailConfirmed,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
    };
}
