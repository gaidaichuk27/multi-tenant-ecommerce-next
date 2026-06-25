import { Router } from 'express';
import { serializeTestUser, testUsersResponseSchema } from '@repo/api';
import { db } from '@repo/database';

export const usersRouter = Router();

usersRouter.get('/', async (_req, res, next) => {
    try {
        const users = await db.testUser.findMany({
            orderBy: { id: 'asc' },
        });

        const payload = testUsersResponseSchema.parse({
            users: users.map(serializeTestUser),
        });

        res.status(200).json(payload);
    } catch (error) {
        next(error);
    }
});
