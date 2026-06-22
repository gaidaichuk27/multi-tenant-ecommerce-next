import { baseProcedure, createTRPCRouter } from '../init';

export const greetingRouter = createTRPCRouter({
    sayHello: baseProcedure.query(async () => {
        return [{ hello: 'world' }];
    }),
});
