import { Prisma, PrismaClient } from './generated/client';

const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient;
};

export const db =
    globalForPrisma.prisma ??
    new PrismaClient({
        log:
            process.env.NODE_ENV === 'development'
                ? ['error', 'warn']
                : ['error'],
    });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = db;
}

export { Prisma, PrismaClient };
export type {
    Comment,
    Group,
    GroupMembership,
    GroupMembershipRole,
    GroupMembershipStatus,
    GroupSettings,
    GroupVisibility,
    Post,
    PostType,
    TestUser,
    User,
} from './generated/client';
