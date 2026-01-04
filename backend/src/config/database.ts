import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI!, {
            dbName: process.env.MONGODB_DATABASE,
        });
        console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error('✗ DB Connection Error:', error);
        process.exit(1);
    }
};

export default connectDB;
