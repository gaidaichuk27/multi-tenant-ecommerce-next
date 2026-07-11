import { testUsersResponseSchema } from '@repo/api';
import { backendFetch } from '@lib/backend-client';
import { baseProcedure, createTRPCRouter } from '../init';

export const usersRouter = createTRPCRouter({
    list: baseProcedure.query(async () => {
        const data = await backendFetch('/api/users', {
            schema: testUsersResponseSchema,
        });

        return data.users;
    }),
});
