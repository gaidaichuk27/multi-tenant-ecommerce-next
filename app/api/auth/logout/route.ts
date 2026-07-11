import { NextResponse } from 'next/server';
import { AUTH_T_MESSAGES, createApiSuccessResponse } from '@repo/api';
import {
    getAuthCookieOptions,
    JWT_TOKEN_COOKIE_KEY,
} from '@shared/config/auth';

export async function POST() {
    const body = createApiSuccessResponse(
        200,
        AUTH_T_MESSAGES.LOGOUT_SUCCESS,
        'Logout successful',
    );

    const response = NextResponse.json(body, { status: body.status });
    response.cookies.set(JWT_TOKEN_COOKIE_KEY, '', {
        ...getAuthCookieOptions(),
        maxAge: 0,
    });

    return response;
}
