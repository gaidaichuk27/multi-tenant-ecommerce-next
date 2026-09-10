import jwt from 'jsonwebtoken';

const JWT_EXPIRES_IN = '7d';
const EMAIL_VERIFY_EXPIRES_IN = '24h';
const PASSWORD_RESET_EXPIRES_IN = '1h';
const JWT_ALGORITHM = 'HS256' as const;

export type TokenPurpose = 'access' | 'email_verify' | 'password_reset';

function getJwtSecret(): string {
    const secret = process.env.JWT_TOKEN;

    if (!secret) {
        throw new Error('JWT_TOKEN is not configured');
    }

    return secret;
}

export class TokenExpiredError extends Error {
    readonly userId: string;
    readonly expiredAt: Date;

    constructor(userId: string, expiredAt: Date) {
        super('Token expired');
        this.name = 'TokenExpiredError';
        this.userId = userId;
        this.expiredAt = expiredAt;
    }
}

export class InvalidTokenError extends Error {
    constructor() {
        super('Invalid token');
        this.name = 'InvalidTokenError';
    }
}

function decodeUserId(token: string): string | null {
    const payload = jwt.decode(token);

    if (
        typeof payload !== 'object' ||
        payload === null ||
        typeof payload.sub !== 'string'
    ) {
        return null;
    }

    return payload.sub;
}

export function signAccessToken(userId: string, tokenVersion: number): string {
    return jwt.sign({ sub: userId, tv: tokenVersion }, getJwtSecret(), {
        algorithm: JWT_ALGORITHM,
        expiresIn: JWT_EXPIRES_IN,
    });
}

export function signEmailVerifyToken(userId: string): string {
    return jwt.sign({ sub: userId, purpose: 'email_verify' }, getJwtSecret(), {
        algorithm: JWT_ALGORITHM,
        expiresIn: EMAIL_VERIFY_EXPIRES_IN,
    });
}

export function signPasswordResetToken(userId: string): string {
    return jwt.sign(
        { sub: userId, purpose: 'password_reset' },
        getJwtSecret(),
        {
            algorithm: JWT_ALGORITHM,
            expiresIn: PASSWORD_RESET_EXPIRES_IN,
        },
    );
}

export function verifyAccessToken(
    token: string,
): { userId: string; tokenVersion: number } | null {
    try {
        const payload = jwt.verify(token, getJwtSecret(), {
            algorithms: [JWT_ALGORITHM],
        });

        if (
            typeof payload !== 'object' ||
            payload === null ||
            typeof payload.sub !== 'string'
        ) {
            return null;
        }

        if ('purpose' in payload && payload.purpose !== undefined) {
            return null;
        }

        const tokenVersion =
            typeof payload.tv === 'number' && Number.isInteger(payload.tv)
                ? payload.tv
                : null;

        if (tokenVersion === null) {
            return null;
        }

        return { userId: payload.sub, tokenVersion };
    } catch {
        return null;
    }
}

export function verifyPurposeToken(
    token: string,
    expectedPurpose: Exclude<TokenPurpose, 'access'>,
): { userId: string } {
    try {
        const payload = jwt.verify(token, getJwtSecret(), {
            algorithms: [JWT_ALGORITHM],
        });

        if (
            typeof payload !== 'object' ||
            payload === null ||
            typeof payload.sub !== 'string' ||
            payload.purpose !== expectedPurpose
        ) {
            throw new InvalidTokenError();
        }

        return { userId: payload.sub };
    } catch (error) {
        if (error instanceof InvalidTokenError) {
            throw error;
        }

        if (error instanceof jwt.TokenExpiredError) {
            const userId = decodeUserId(token);

            if (!userId) {
                throw new InvalidTokenError();
            }

            throw new TokenExpiredError(userId, error.expiredAt ?? new Date());
        }

        throw new InvalidTokenError();
    }
}
