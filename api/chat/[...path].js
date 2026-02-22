import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';

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

// ─── Groq Client ──────────────────────────────────────────────────────────────
const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
});

// ─── Models ───────────────────────────────────────────────────────────────────
const MessageSchema = new mongoose.Schema(
    {
        messageId: { type: String, required: true },
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
        subject: String,
        intent: String,
        timestamp: { type: Date, required: true },
        metadata: { tokens: Number, model: String, confidence: Number, goalId: String },
    },
    { _id: false }
);

const ConversationSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, index: true },
        title: { type: String, required: true, default: 'New Conversation' },
        messages: [MessageSchema],
        summary: String,
        keyTopics: [String],
        lastMessageAt: { type: Date, index: true },
        isArchived: { type: Boolean, default: false },
        isPublic: { type: Boolean, default: false, index: true },
    },
    { timestamps: true }
);

const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);

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

// ─── Classifier ───────────────────────────────────────────────────────────────
async function classifyMessage(content) {
    try {
        const response = await groq.chat.completions.create({
            model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: 'You are a precise classification assistant. Return ONLY valid JSON.' },
                {
                    role: 'user',
                    content: `Classify this academic message. Subject: Mathematics, Science, Literature, History, Computer Science, Economics, Psychology, Other. Intent: Question, Explanation Request, Assignment Help, Exam Prep, General Chat. Return ONLY JSON: {"subject":"...","intent":"...","confidence":0.0}. Message: "${content}"`,
                },
            ],
            temperature: 0.1,
            max_tokens: 100,
            response_format: { type: 'json_object' },
        });
        const result = JSON.parse(response.choices[0]?.message?.content || '{}');
        return { subject: result.subject || 'Other', intent: result.intent || 'Question', confidence: result.confidence || 0.5 };
    } catch {
        return { subject: 'Other', intent: 'Question', confidence: 0 };
    }
}

// ─── Express App ──────────────────────────────────────────────────────────────
const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || process.env.PRODUCTION_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));

// GET /api/chat/public/:id — Public conversation (no auth)
app.get('/api/chat/public/:id', async (req, res) => {
    await connectDB();
    try {
        const conversation = await Conversation.findById(req.params.id);
        if (!conversation || !conversation.isPublic) {
            return res.status(404).json({ error: 'Conversation not found or private' });
        }
        res.json({
            id: conversation._id,
            title: conversation.title,
            messages: conversation.messages.map((m) => ({ role: m.role, content: m.content, timestamp: m.timestamp })),
            createdAt: conversation.createdAt,
            lastMessageAt: conversation.lastMessageAt,
            isPublic: conversation.isPublic,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/chat/message
app.post('/api/chat/message', async (req, res) => {
    await connectDB();
    const user = requireAuth(req, res);
    if (!user) return;

    const { content, subject: manualSubject, intent: manualIntent, goalId } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: 'Message content required' });

    try {
        const classification = await classifyMessage(content);
        const finalSubject = manualSubject || classification.subject;
        const finalIntent = manualIntent || classification.intent;

        let conversation = await Conversation.findOne({ userId: user.id, isArchived: false }).sort({ lastMessageAt: -1 });
        if (!conversation) {
            conversation = new Conversation({
                userId: user.id,
                title: 'Conversation ' + new Date().toLocaleDateString(),
                messages: [],
                isArchived: false,
            });
        }

        const message = {
            messageId: uuidv4(),
            role: 'user',
            content: content.trim(),
            subject: finalSubject,
            intent: finalIntent,
            timestamp: new Date(),
            metadata: { confidence: classification.confidence, goalId: goalId || undefined },
        };

        conversation.messages.push(message);
        conversation.lastMessageAt = new Date();
        const subjects = conversation.messages.filter((m) => m.subject).map((m) => m.subject).filter((s, i, a) => a.indexOf(s) === i);
        conversation.keyTopics = subjects.slice(-5);
        await conversation.save();

        res.json({ success: true, conversation: { id: conversation._id, title: conversation.title, message, totalMessages: conversation.messages.length } });
    } catch (err) {
        res.status(500).json({ error: err.message || 'Failed to send message' });
    }
});

// POST /api/chat/ai  (streaming SSE)
app.post('/api/chat/ai', async (req, res) => {
    await connectDB();
    const user = requireAuth(req, res);
    if (!user) return;

    const { conversationId } = req.body;
    try {
        const conversation = await Conversation.findOne({ _id: conversationId, userId: user.id });
        if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

        const messages = conversation.messages.map((m) => ({ role: m.role, content: m.content }));

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const stream = await groq.chat.completions.create({
            model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: 'You are StudentMentor AI, a helpful and knowledgeable academic assistant. Provide clear, accurate, and encouraging help to students.' },
                ...messages,
            ],
            stream: true,
        });

        let fullContent = '';
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                fullContent += content;
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
        }

        conversation.messages.push({ messageId: uuidv4(), role: 'assistant', content: fullContent, timestamp: new Date(), metadata: { model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile' } });
        conversation.lastMessageAt = new Date();
        await conversation.save();

        res.write(`data: [DONE]\n\n`);
        res.end();
    } catch (err) {
        res.write(`data: ${JSON.stringify({ error: 'AI failed to respond' })}\n\n`);
        res.end();
    }
});

// GET /api/chat/conversations
app.get('/api/chat/conversations', async (req, res) => {
    await connectDB();
    const user = requireAuth(req, res);
    if (!user) return;
    try {
        const conversations = await Conversation.find({ userId: user.id, isArchived: false })
            .sort({ lastMessageAt: -1 })
            .select('_id title lastMessageAt createdAt messages')
            .limit(20);
        res.json(conversations.map((c) => ({ id: c._id, title: c.title, lastMessageAt: c.lastMessageAt, createdAt: c.createdAt, messageCount: c.messages.length })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/chat/conversations/:id
app.get('/api/chat/conversations/:id', async (req, res) => {
    await connectDB();
    const user = requireAuth(req, res);
    if (!user) return;
    try {
        const conversation = await Conversation.findOne({ _id: req.params.id, userId: user.id });
        if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
        res.json({ id: conversation._id, title: conversation.title, messages: conversation.messages, createdAt: conversation.createdAt, lastMessageAt: conversation.lastMessageAt, isPublic: conversation.isPublic });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/chat/conversations/:id/public
app.post('/api/chat/conversations/:id/public', async (req, res) => {
    await connectDB();
    const user = requireAuth(req, res);
    if (!user) return;
    try {
        const conversation = await Conversation.findOne({ _id: req.params.id, userId: user.id });
        if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
        conversation.isPublic = req.body.isPublic;
        await conversation.save();
        res.json({ success: true, isPublic: conversation.isPublic });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/chat/conversations/:id/messages/:messageId
app.patch('/api/chat/conversations/:id/messages/:messageId', async (req, res) => {
    await connectDB();
    const user = requireAuth(req, res);
    if (!user) return;
    try {
        const conversation = await Conversation.findOne({ _id: req.params.id, userId: user.id });
        if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
        const message = conversation.messages.find((m) => m.messageId === req.params.messageId);
        if (!message) return res.status(404).json({ error: 'Message not found' });
        if (req.body.subject) message.subject = req.body.subject;
        if (req.body.intent) message.intent = req.body.intent;
        await conversation.save();
        res.json({ success: true, message });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/chat/stats
app.get('/api/chat/stats', async (req, res) => {
    await connectDB();
    const user = requireAuth(req, res);
    if (!user) return;
    try {
        const conversations = await Conversation.find({ userId: user.id });
        const stats = { subjects: {}, intents: {}, totalMessages: 0 };
        conversations.forEach((conv) => {
            conv.messages.forEach((msg) => {
                if (msg.role === 'user') {
                    stats.totalMessages++;
                    if (msg.subject) stats.subjects[msg.subject] = (stats.subjects[msg.subject] || 0) + 1;
                    if (msg.intent) stats.intents[msg.intent] = (stats.intents[msg.intent] || 0) + 1;
                }
            });
        });
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default app;
