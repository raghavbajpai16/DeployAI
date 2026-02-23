import mongoose from 'mongoose';

/**
 * Production MongoDB Connection
 * Features: Connection pooling, event listeners, and fail-fast startup.
 */
const connectDB = async () => {
    // Prevent multiple connection attempts
    if (mongoose.connection.readyState >= 1) return;

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error('✗ MONGODB_URI is missing');
        process.exit(1);
    }

    try {
        mongoose.connection.on('connected', () => {
            console.log('✓ MongoDB Connected Successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('✗ MongoDB Runtime Error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('! MongoDB Disconnected. Attempting reconnection...');
        });

        await mongoose.connect(mongoUri, {
            dbName: process.env.MONGODB_DATABASE,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

    } catch (error: any) {
        console.error('✗ MongoDB Initial Connection Failed:', error.message);
        process.exit(1); // Fail fast at startup
    }
};

export default connectDB;
