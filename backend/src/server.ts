import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
    })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Export app for Vercel
export default app;

// 404 handler
app.use('*', (req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server (Only if not in Vercel/Production environment)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const startServer = async () => {
        try {
            await connectDB();
            app.listen(PORT, () => {
                console.log(`\n✓ Server running on http://localhost:${PORT}`);
                console.log(`✓ Environment: ${process.env.NODE_ENV}`);
                console.log('\nAvailable endpoints:');
                console.log('  POST   /api/auth/register');
                console.log('  POST   /api/auth/login');
                console.log('  GET    /api/auth/me');
                console.log('  POST   /api/chat/message');
                console.log('  GET    /api/chat/conversations');
                console.log('  GET    /api/chat/conversations/:id\n');
            });
        } catch (error) {
            console.error('✗ Failed to start server:', error);
            process.exit(1);
        }
    };
    startServer();
} else {
    // In production/Vercel, we still need to connect to DB
    connectDB().catch(err => console.error('DB Connection Error:', err));
}
