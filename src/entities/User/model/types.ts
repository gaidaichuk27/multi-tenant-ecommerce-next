/** Authenticated user profile exposed to the app (no secrets). */
export type User = {
    id: string;
    email: string;
    username: string;
    name: string | null;
    avatarUrl: string | null;
    roles: UserRole[];
    createdAt: string;
    updatedAt: string;
};

/** Platform-level roles (not group membership roles). */
export type UserRole = 'user' | 'super-admin';
