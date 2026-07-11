import jwt from 'jsonwebtoken';

const JWT_EXPIRES_IN = '7d';

function getJwtSecret(): string {
    const secret = process.env.JWT_TOKEN;

    if (!secret) {
        throw new Error('JWT_TOKEN is not configured');
    }

    return secret;
}

export function signAccessToken(userId: string): string {
    return jwt.sign({ sub: userId }, getJwtSecret(), {
        expiresIn: JWT_EXPIRES_IN,
    });
}

export function verifyAccessToken(token: string): { userId: string } | null {
    try {
        const payload = jwt.verify(token, getJwtSecret());

        if (
            typeof payload !== 'object' ||
            payload === null ||
            typeof payload.sub !== 'string'
        ) {
            return null;
        }

        return { userId: payload.sub };
    } catch {
        return null;
    }
}
