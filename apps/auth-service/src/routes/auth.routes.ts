import { Router } from 'express';
import { register, login, refreshToken, googleCallback, getProfile, getSystemStatus, setup2FA, verify2FA, disable2FA, login2FA } from '../controllers/auth.controller';
import passport from '../config/passport';
import authMiddleware from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/login/2fa', login2FA);
router.post('/refresh', refreshToken);

// OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);

// Protected Routes
router.get('/profile', authMiddleware, authorize(['user:read']), getProfile);
router.get('/system-status', authMiddleware, authorize(['system:manage']), getSystemStatus);

// 2FA Routes
router.post('/2fa/setup', authMiddleware, setup2FA);
router.post('/2fa/verify', authMiddleware, verify2FA);
router.post('/2fa/disable', authMiddleware, disable2FA);

export default router;
