import { Prisma } from './generated/client';

/**
 * Prisma unique constraint violation (`P2002`).
 * Duck-type `code` — `instanceof` fails across duplicate Prisma package copies.
 */
export function isPrismaUniqueConstraintError(
    error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return error.code === 'P2002';
    }

    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: unknown }).code === 'P2002'
    );
}

/**
 * Prisma foreign key constraint violation (`P2003`).
 * Duck-type `code` — same cross-package caveat as {@link isPrismaUniqueConstraintError}.
 */
export function isPrismaForeignKeyError(
    error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return error.code === 'P2003';
    }

    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: unknown }).code === 'P2003'
    );
}

/**
 * True when `error` is a P2003 whose meta points at `field` (e.g. `categoryId`).
 * Prisma may put the column in `field_name` or `constraint` as camelCase,
 * snake_case (`category_id`), or a constraint name (`posts_category_id_fkey`).
 */
export function isPrismaForeignKeyErrorOnField(
    error: unknown,
    field: string,
): boolean {
    if (!isPrismaForeignKeyError(error)) {
        return false;
    }

    const meta = error.meta;
    if (!meta || typeof meta !== 'object') {
        return false;
    }

    const normalize = (value: string) =>
        value.toLowerCase().replace(/[^a-z0-9]/g, '');

    const needles = new Set<string>([normalize(field)]);
    // Also probe snake_case so `categoryId` matches `category_id` meta.
    const snake = field.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
    needles.add(normalize(snake));

    const candidates = [meta.field_name, meta.constraint, meta.fieldName];

    return candidates.some((value) => {
        if (typeof value !== 'string') return false;
        const haystack = normalize(value);
        for (const needle of needles) {
            if (needle.length > 0 && haystack.includes(needle)) {
                return true;
            }
        }
        return false;
    });
}
