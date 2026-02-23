/**
 * Environment Variable Validation
 * Ensures the application fails fast if critical configuration is missing.
 */
const REQUIRED_ENV_VARS = [
    'PORT',
    'NODE_ENV',
    'MONGODB_URI',
    'MONGODB_DATABASE',
    'JWT_SECRET',
    'JWT_EXPIRY',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_CALLBACK_URL',
    'FRONTEND_URL',
    'GROQ_API_KEY',
    'GROQ_MODEL'
];

export const validateEnv = () => {
    const missing = REQUIRED_ENV_VARS.filter(key => !process.env[key]);

    if (missing.length > 0) {
        console.error('\n✗ CRITICAL: Missing required environment variables:');
        missing.forEach(key => console.error(`  - ${key}`));
        console.error('\nApplication shutting down to prevent silent failure.\n');
        process.exit(1);
    }

    // Task 2: Strict FRONTEND_URL validation
    const frontendUrl = process.env.FRONTEND_URL!;
    if (frontendUrl.endsWith('/')) {
        console.error('\n✗ CRITICAL: FRONTEND_URL must NOT end with a trailing slash.');
        process.exit(1);
    }

    if (process.env.NODE_ENV === 'production' && !frontendUrl.startsWith('https://')) {
        console.error('\n✗ CRITICAL: FRONTEND_URL must use HTTPS in production.');
        process.exit(1);
    }
};
