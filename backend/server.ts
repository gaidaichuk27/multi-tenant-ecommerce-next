import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import { db } from '@repo/database';
import { authRouter } from './routers/authRouter';
import { usersRouter } from './routers/usersRouter';
import { getCorsOptions } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';

// Root .env (DATABASE_URL) + backend/.env (PORT, JWT, etc.)
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const app: Express = express();
const server = http.createServer(app);

const PORT = Number(process.env.API_PORT ?? process.env.PORT ?? 8080);
const SHUTDOWN_TIMEOUT_MS = 10_000;

let isShuttingDown = false;

app.use(cors(getCorsOptions()));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({ message: `API listening on port ${PORT}` });
});

app.get('/api/health/db', async (_req, res, next) => {
    try {
        await db.$queryRaw`SELECT 1`;
        const userCount = await db.testUser.count();
        res.status(200).json({ ok: true, userCount });
    } catch (error) {
        next(error);
    }
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

async function start() {
    try {
        await db.$connect();
        console.log('PostgreSQL connected via Prisma');

        server.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

async function shutdown(signal: string) {
    if (isShuttingDown) {
        return;
    }

    isShuttingDown = true;
    console.log(`Received ${signal}, shutting down...`);

    const forceExitTimer = setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
    forceExitTimer.unref();

    try {
        await db.$disconnect();
        server.close(() => {
            clearTimeout(forceExitTimer);
            process.exit(0);
        });
    } catch (error) {
        console.error('Shutdown error:', error);
        process.exit(1);
    }
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

void start();
