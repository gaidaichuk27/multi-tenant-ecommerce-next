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
export {
    isPrismaUniqueConstraintError,
    isPrismaForeignKeyError,
    isPrismaForeignKeyErrorOnField,
} from './errors';
export type {
    Category,
    Comment,
    Group,
    GroupMembership,
    GroupMembershipRole,
    GroupMembershipStatus,
    GroupSettings,
    GroupVisibility,
    Post,
    PostLike,
    PostType,
    TestUser,
    User,
} from './generated/client';
