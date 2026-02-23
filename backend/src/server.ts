import './config/env.js'; // MUST be first
import { validateEnv } from './config/validateEnv.js';
validateEnv(); // Critical: Validate before anything else

import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import goalRoutes from './routes/goal.js';
import analyticsRoutes from './routes/analytics.js';
import passport from 'passport';
import './config/passport.js';



const app = express();
const PORT = process.env.PORT;

// Task 5: Request Timeout & Crash Protection
app.use((req, res, next) => {
    res.setTimeout(25000, () => {
        res.status(408).send('Request Timeout');
    });
    next();
});

// Capture Global Failures
process.on('unhandledRejection', (reason) => {
    console.error('✗ UNHANDLED REJECTION:', reason);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('✗ UNCAUGHT EXCEPTION:', error);
    process.exit(1);
});

// Security Middleware
app.use(helmet());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());


// Production Health Check
app.get('/api/health', (req: Request, res: Response) => {
    const isConnected = mongoose.connection.readyState === 1;
    res.status(isConnected ? 200 : 503).json({
        status: 'ok',
        database: isConnected ? 'connected' : 'disconnected',
        environment: process.env.NODE_ENV,
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use('*', (req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

// Strict Start Sequence for Render
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`\n✓ Production Server active on port ${PORT}`);
        });
    } catch (error) {
        console.error('✗ Server failed to start:', error);
        process.exit(1);
    }
};

startServer();

export default app;
