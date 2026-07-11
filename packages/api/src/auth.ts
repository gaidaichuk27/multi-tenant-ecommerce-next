import { z } from 'zod';
import { apiResponseSchema } from './response';
import { usernameFieldSchema } from './validation';

export const userRoleSchema = z.enum(['user', 'super-admin']);

export const userSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    username: z.string().min(1),
    name: z.string().nullable(),
    avatarUrl: z.string().nullable(),
    roles: z.array(userRoleSchema),
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

export const authLoginApiResponseSchema =
    apiResponseSchema(authTokenDataSchema);
export const authRegisterApiResponseSchema =
    apiResponseSchema(authTokenDataSchema);
export const authMeApiResponseSchema = apiResponseSchema(authMeDataSchema);
export const authUserApiResponseSchema = apiResponseSchema(authUserDataSchema);
export const authLogoutApiResponseSchema = apiResponseSchema(z.object({}));

export const loginInputSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const registerInputSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    username: usernameFieldSchema,
    name: z.string().min(1).max(255).optional(),
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

export type LoginInput = z.infer<typeof loginInputSchema>;
export type RegisterInput = z.infer<typeof registerInputSchema>;

export function serializeUser(user: {
    id: string;
    email: string;
    username: string;
    name: string | null;
    avatarUrl: string | null;
    roles: ('user' | 'super_admin')[];
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
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
    };
}
