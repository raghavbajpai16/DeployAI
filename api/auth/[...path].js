import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// ─── DB Connection (cached for serverless) ────────────────────────────────────
let cached = global._mongooseCache;
if (!cached) cached = global._mongooseCache = { conn: null, promise: null };

async function connectDB() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.MONGODB_DATABASE || 'StudentMentor-AI',
            bufferCommands: false,
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

// ─── User Model ───────────────────────────────────────────────────────────────
const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, select: false },
        googleId: { type: String, unique: true, sparse: true },
        avatar: { type: String, default: '' },
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

UserSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash') || !this.passwordHash) return next();
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
    next();
});

UserSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.passwordHash);
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// ─── Passport Setup ───────────────────────────────────────────────────────────
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            callbackURL: `${process.env.PRODUCTION_URL || ''}/api/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });
                if (user) return done(null, user);

                const email = profile.emails?.[0]?.value;
                if (email) {
                    user = await User.findOne({ email });
                    if (user) {
                        user.googleId = profile.id;
                        if (!user.avatar) user.avatar = profile.photos?.[0]?.value;
                        await user.save();
                        return done(null, user);
                    }
                }

                user = await User.create({
                    googleId: profile.id,
                    email,
                    firstName: profile.name?.givenName || 'User',
                    lastName: profile.name?.familyName || '',
                    avatar: profile.photos?.[0]?.value,
                });
                done(null, user);
            } catch (error) {
                done(error, undefined);
            }
        }
    )
);

// ─── Express App ──────────────────────────────────────────────────────────────
const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || process.env.PRODUCTION_URL || '*',
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(passport.initialize());

// ─── Auth Routes ──────────────────────────────────────────────────────────────

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
    await connectDB();
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'All fields required' });
    }
    try {
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) return res.status(409).json({ error: 'User already exists' });

        const user = new User({ email: email.toLowerCase(), passwordHash: password, firstName, lastName });
        await user.save();

        const accessToken = jwt.sign(
            { id: user._id.toString(), email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRY || '24h' }
        );

        res.status(201).json({
            success: true,
            user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName },
            accessToken,
        });
    } catch (err) {
        res.status(500).json({ error: err.message || 'Registration failed' });
    }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
    await connectDB();
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    try {
        const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const accessToken = jwt.sign(
            { id: user._id.toString(), email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRY || '24h' }
        );

        res.json({
            success: true,
            user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName },
            accessToken,
        });
    } catch (err) {
        res.status(500).json({ error: err.message || 'Login failed' });
    }
});

// GET /api/auth/me
app.get('/api/auth/me', async (req, res) => {
    await connectDB();
    const auth = req.headers['authorization'];
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ user });
    } catch (err) {
        res.status(401).json({ error: 'Token invalid or expired' });
    }
});

// GET /api/auth/google
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// GET /api/auth/google/callback
app.get(
    '/api/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        try {
            const user = req.user;
            if (!user) return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);

            const accessToken = jwt.sign(
                { id: user._id.toString(), email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRY || '24h' }
            );

            const frontendUrl = process.env.FRONTEND_URL || process.env.PRODUCTION_URL || '';
            res.redirect(`${frontendUrl}/auth/google/callback?token=${accessToken}`);
        } catch (err) {
            res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
        }
    }
);

export default app;
