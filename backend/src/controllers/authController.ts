import { Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';

export const register = async (req: AuthRequest, res: Response) => {
    const { email, password, firstName, lastName } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'All fields required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const user = new User({
            email: (email as string).toLowerCase(),
            passwordHash: password,
            firstName,
            lastName,
        });

        await user.save();

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }

        const accessToken = jwt.sign(
            { id: user._id.toString(), email: user.email },
            secret,
            { expiresIn: process.env.JWT_EXPIRY as any }
        );

        // Task 1: Enforce Cookie-Only JWT Strategy
        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: Number(process.env.JWT_EXPIRY) * 1000
        });

        res.status(201).json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Registration failed' });
    }
};

export const login = async (req: AuthRequest, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    try {
        const user = await User.findOne({ email: (email as string).toLowerCase() }).select(
            '+passwordHash'
        );
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }

        const accessToken = jwt.sign(
            { id: user._id.toString(), email: user.email },
            secret,
            { expiresIn: process.env.JWT_EXPIRY as any }
        );

        // Task 1: Enforce Cookie-Only JWT Strategy
        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: Number(process.env.JWT_EXPIRY) * 1000
        });

        res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Login failed' });
    }
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user!.id);
        res.json({ user });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

export const googleCallback = (req: any, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }

        const accessToken = jwt.sign(
            { id: user._id.toString(), email: user.email },
            secret,
            { expiresIn: process.env.JWT_EXPIRY as any }
        );

        // Task 1 & 7: Enforce Cookie-Only JWT Strategy + Redirect to Dashboard
        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: Number(process.env.JWT_EXPIRY) * 1000
        });

        res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
};

export const logout = (req: AuthRequest, res: Response) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none'
    });
    res.json({ success: true, message: 'Logged out successfully' });
};
