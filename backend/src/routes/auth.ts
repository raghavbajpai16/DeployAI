import { Router } from 'express';
import { register, login, getMe, googleCallback } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import passport from 'passport';

const router = Router();

// Cast handlers to any to resolve Request type conflicts
router.post('/register', register as any);
router.post('/login', login as any);
router.get('/me', protect as any, getMe as any);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    googleCallback as any
);

export default router;
