import { Prisma } from './generated/client';

/** Prisma unique constraint violation (`P2002`). */
export function isPrismaUniqueConstraintError(
    error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
    return (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
    );
}
