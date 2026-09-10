import type { Request } from 'express';
import type { User } from '@repo/database';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            user?: User;
        }
    }
}

export type AuthenticatedRequest = Request & {
    userId: string;
    user: User;
};
