import { z } from 'zod';

export const testUserSchema = z.object({
    id: z.number().int(),
    name: z.string().min(1),
    email: z.string().email(),
    createdAt: z.string().nullable(),
});

export const testUsersResponseSchema = z.object({
    users: z.array(testUserSchema),
});

export type TestUserDto = z.infer<typeof testUserSchema>;
export type TestUsersResponse = z.infer<typeof testUsersResponseSchema>;

export function serializeTestUser(user: {
    id: number;
    name: string;
    email: string;
    createdAt: Date | null;
}): TestUserDto {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt?.toISOString() ?? null,
    };
}
