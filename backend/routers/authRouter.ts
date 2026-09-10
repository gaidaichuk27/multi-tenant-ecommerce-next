import { Router } from 'express';
import { controllers } from '../controllers/auth/authControllers';
import { requireAuth } from '../middleware/requireAuth';
import {
    authRouteLimiter,
    authSensitiveLimiter,
} from '../middleware/rateLimit';

export const authRouter = Router();

authRouter.use(authRouteLimiter);

authRouter.post('/register', authSensitiveLimiter, controllers.postRegister);
authRouter.post('/login', authSensitiveLimiter, controllers.postLogin);
authRouter.get('/me', requireAuth, controllers.getMe);
authRouter.get(
    '/verify-email',
    authSensitiveLimiter,
    controllers.getVerifyEmail,
);
authRouter.post(
    '/password-forgot',
    authSensitiveLimiter,
    controllers.postForgotPassword,
);
authRouter.post(
    '/password-restore',
    authSensitiveLimiter,
    controllers.postRestorePassword,
);
authRouter.post(
    '/password-change',
    requireAuth,
    authSensitiveLimiter,
    controllers.postChangePassword,
);
authRouter.post(
    '/resend-verification',
    requireAuth,
    authSensitiveLimiter,
    controllers.postResendVerification,
);
