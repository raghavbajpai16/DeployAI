import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

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

// ─── Goal Model ───────────────────────────────────────────────────────────────
const GoalSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, index: true },
        title: { type: String, required: true },
        description: String,
        subject: { type: String, required: true },
        progress: { type: Number, default: 0, min: 0, max: 100 },
        milestones: [{ title: { type: String, required: true }, isCompleted: { type: Boolean, default: false } }],
        targetDate: { type: Date, required: true },
        status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active' },
    },
    { timestamps: true }
);

const Goal = mongoose.models.Goal || mongoose.model('Goal', GoalSchema);

// ─── Auth Helper ──────────────────────────────────────────────────────────────
function requireAuth(req, res) {
    const auth = req.headers['authorization'];
    if (!auth?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' });
        return null;
    }
    try {
        return jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    } catch {
        res.status(401).json({ error: 'Token invalid or expired' });
        return null;
    }
}

// ─── Express App ──────────────────────────────────────────────────────────────
const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || process.env.PRODUCTION_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));

// POST /api/goals
app.post('/api/goals', async (req, res) => {
    await connectDB();
    const user = requireAuth(req, res);
    if (!user) return;
    try {
        const { title, description, subject, targetDate, milestones } = req.body;
        let progress = 0;
        if (milestones?.length > 0) {
            progress = Math.round((milestones.filter((m) => m.isCompleted).length / milestones.length) * 100);
        }
        const goal = new Goal({ userId: user.id, title, description, subject, targetDate, milestones: milestones || [], progress, status: progress >= 100 ? 'completed' : 'active' });
        await goal.save();
        res.status(201).json(goal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/goals
app.get('/api/goals', async (req, res) => {
    await connectDB();
    const user = requireAuth(req, res);
    if (!user) return;
    try {
        const goals = await Goal.find({ userId: user.id }).sort({ createdAt: -1 });
        res.json(goals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/goals/:id
app.patch('/api/goals/:id', async (req, res) => {
    await connectDB();
    const user = requireAuth(req, res);
    if (!user) return;
    try {
        const updates = req.body;
        if (updates.milestones) {
            updates.progress = Math.round((updates.milestones.filter((m) => m.isCompleted).length / updates.milestones.length) * 100);
            updates.status = updates.progress >= 100 ? 'completed' : 'active';
        }
        const goal = await Goal.findOneAndUpdate({ _id: req.params.id, userId: user.id }, updates, { new: true });
        if (!goal) return res.status(404).json({ error: 'Goal not found' });
        res.json(goal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/goals/:id
app.delete('/api/goals/:id', async (req, res) => {
    await connectDB();
    const user = requireAuth(req, res);
    if (!user) return;
    try {
        const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: user.id });
        if (!goal) return res.status(404).json({ error: 'Goal not found' });
        res.json({ message: 'Goal deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/goals/:id/progress
app.patch('/api/goals/:id/progress', async (req, res) => {
    await connectDB();
    const user = requireAuth(req, res);
    if (!user) return;
    try {
        const { progress } = req.body;
        const goal = await Goal.findOneAndUpdate(
            { _id: req.params.id, userId: user.id },
            { progress, status: progress >= 100 ? 'completed' : 'active' },
            { new: true }
        );
        if (!goal) return res.status(404).json({ error: 'Goal not found' });
        res.json(goal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default app;
