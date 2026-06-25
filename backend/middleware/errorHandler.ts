import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
    if (res.headersSent) {
        next(err);
        return;
    }

    console.error(err);

    const status =
        typeof err === 'object' &&
        err !== null &&
        'status' in err &&
        typeof err.status === 'number'
            ? err.status
            : 500;

    const message =
        status === 500 ? 'Internal server error' : String(err.message ?? err);

    res.status(status).json({ error: message });
};
