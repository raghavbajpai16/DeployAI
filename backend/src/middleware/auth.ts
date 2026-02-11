import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: { id: string; email: string };
}

export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    let token: string | null = null;

    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: string;
            email: string;
        };
        (req as AuthRequest).user = decoded;
        next();
    } catch (error: any) {
        console.error('Token verification failed:', error.message);
        console.log('Token received:', token);
        return res.status(401).json({ error: 'Token invalid or expired: ' + error.message });
    }
};
