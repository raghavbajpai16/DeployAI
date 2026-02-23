import { Router } from 'express';
import { register, login, logout, getMe, googleCallback } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import passport from 'passport';

const router = Router();

// Cast handlers to any to resolve Request type conflicts
router.post('/register', register as any);
router.post('/login', login as any);
router.post('/logout', logout as any);
router.get('/me', protect as any, getMe as any);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false, state: true as any }));
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login` }),
    googleCallback as any
);

export default router;
