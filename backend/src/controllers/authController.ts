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
            email: email.toLowerCase(),
            passwordHash: password,
            firstName,
            lastName,
        });

        await user.save();

        const accessToken = jwt.sign(
            { id: user._id.toString(), email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRY || '24h' }
        );

        res.status(201).json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            accessToken,
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
        const user = await User.findOne({ email: email.toLowerCase() }).select(
            '+passwordHash'
        );
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const accessToken = jwt.sign(
            { id: user._id.toString(), email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRY || '24h' }
        );

        res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            accessToken,
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
