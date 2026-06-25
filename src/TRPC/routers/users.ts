import { fetchTestUsersFromBackend } from '@services/backendClient';
import { baseProcedure, createTRPCRouter } from '../init';

export const usersRouter = createTRPCRouter({
    list: baseProcedure.query(async () => {
        return fetchTestUsersFromBackend();
    }),
});
