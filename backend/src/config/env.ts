import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// Critical fix: Sanitize environment variables for production (removes hidden newlines/spaces)
Object.keys(process.env).forEach((key) => {
    if (process.env[key]) {
        process.env[key] = process.env[key]!.trim();
    }
});
