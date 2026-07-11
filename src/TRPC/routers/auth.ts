import { baseProcedure, createTRPCRouter } from '../init';

export const authRouter = createTRPCRouter({
    me: baseProcedure.query(({ ctx }) => ctx.user),
});
