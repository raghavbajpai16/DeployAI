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

// ─── Models (must match main models) ─────────────────────────────────────────
const MessageSchema = new mongoose.Schema(
    {
        messageId: String, role: String, content: String, subject: String, intent: String,
        timestamp: Date, metadata: { tokens: Number, model: String, confidence: Number, goalId: String },
    },
    { _id: false }
);

const ConversationSchema = new mongoose.Schema(
    { userId: { type: String, index: true }, title: String, messages: [MessageSchema], keyTopics: [String], lastMessageAt: Date, isArchived: { type: Boolean, default: false }, isPublic: { type: Boolean, default: false } },
    { timestamps: true }
);

const GoalSchema = new mongoose.Schema(
    { userId: { type: String, index: true }, title: String, description: String, subject: String, progress: Number, status: String, milestones: [{ title: String, isCompleted: Boolean }], targetDate: Date },
    { timestamps: true }
);

const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);
const Goal = mongoose.models.Goal || mongoose.model('Goal', GoalSchema);

// ─── Auth Helper ──────────────────────────────────────────────────────────────
function requireAuth(req, res) {
    const auth = req.headers['authorization'];
    if (!auth?.startsWith('Bearer ')) { res.status(401).json({ error: 'No token provided' }); return null; }
    try { return jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET); }
    catch { res.status(401).json({ error: 'Token invalid or expired' }); return null; }
}

// ─── Express App ──────────────────────────────────────────────────────────────
const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || process.env.PRODUCTION_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));

// GET /api/analytics/dashboard
app.get('/api/analytics/dashboard', async (req, res) => {
    await connectDB();
    const user = requireAuth(req, res);
    if (!user) return;

    try {
        const now = new Date();
        const conversations = await Conversation.find({ userId: user.id, 'messages.0': { $exists: true } });
        const allMessages = conversations.flatMap((c) => c.messages.filter((m) => m.role === 'user'));

        const totalMessages = allMessages.length;

        // Subject Breakdown
        const subjectStats = {};
        allMessages.forEach((msg) => {
            if (msg.subject) subjectStats[msg.subject] = (subjectStats[msg.subject] || 0) + 1;
        });
        const topSubjects = Object.entries(subjectStats)
            .map(([subject, count]) => ({ subject, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Streak
        const activityDates = [...new Set(allMessages.map((m) => new Date(m.timestamp).toISOString().split('T')[0]))].sort().reverse();
        let currentStreak = 0;
        if (activityDates.length > 0) {
            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            if (activityDates[0] === today || activityDates[0] === yesterday) {
                currentStreak = 1;
                let checkDate = new Date(activityDates[0]);
                for (let i = 1; i < activityDates.length; i++) {
                    checkDate.setDate(checkDate.getDate() - 1);
                    if (activityDates[i] === checkDate.toISOString().split('T')[0]) { currentStreak++; } else break;
                }
            }
        }

        // Weekly Activity
        const weeklyActivity = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(Date.now() - i * 86400000);
            const dateStr = d.toISOString().split('T')[0];
            const count = allMessages.filter((m) => new Date(m.timestamp).toISOString().split('T')[0] === dateStr).length;
            weeklyActivity.push({ date: dateStr, count });
        }

        // Goals
        const goals = await Goal.find({ userId: user.id });
        const completedGoals = goals.filter((g) => g.status === 'completed' || g.progress >= 100).length;

        res.json({
            stats: {
                totalMessages, currentStreak, topSubjects, weeklyActivity,
                goals: { total: goals.length, completed: completedGoals, active: goals.length - completedGoals },
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default app;
