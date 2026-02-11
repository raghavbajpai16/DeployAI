import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Conversation from '../models/Conversation.js';
import { AuthRequest } from '../middleware/auth.js';
import groq from '../config/groq.js';
import { classifyMessage } from '../config/classifier.js';


export const sendMessage = async (req: AuthRequest, res: Response) => {
    const { content, subject: manualSubject, intent: manualIntent, goalId } = req.body;
    const userId = req.user!.id;

    if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Message content required' });
    }

    try {
        // Week 4: Classify message if no manual override
        const classification = await classifyMessage(content);
        const finalSubject = manualSubject || classification.subject;
        const finalIntent = manualIntent || classification.intent;

        // Find latest active conversation or create new
        let conversation = await Conversation.findOne({
            userId,
            isArchived: false,
        }).sort({ lastMessageAt: -1 });

        if (!conversation) {
            conversation = new Conversation({
                userId,
                title: 'Conversation ' + new Date().toLocaleDateString(),
                messages: [],
                isArchived: false,
            });
        }

        // Create and add message
        const message = {
            messageId: uuidv4(),
            role: 'user' as const,
            content: content.trim(),
            subject: finalSubject,
            intent: finalIntent,
            timestamp: new Date(),
            metadata: {
                confidence: classification.confidence,
                goalId: goalId || undefined
            }
        };

        conversation.messages.push(message);
        conversation.lastMessageAt = new Date();

        // Update key topics
        const subjects = conversation.messages
            .filter((m) => m.subject)
            .map((m) => m.subject!)
            .filter((s, i, arr) => arr.indexOf(s) === i);
        conversation.keyTopics = subjects.slice(-5);

        await conversation.save();

        res.json({
            success: true,
            conversation: {
                id: conversation._id,
                title: conversation.title,
                message,
                totalMessages: conversation.messages.length,
            },
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to send message' });
    }
};

export const getConversations = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    try {
        const conversations = await Conversation.find({
            userId,
            isArchived: false,
        })
            .sort({ lastMessageAt: -1 })
            .select('_id title lastMessageAt createdAt messages')
            .limit(20);

        const simplified = conversations.map((conv) => ({
            id: conv._id,
            title: conv.title,
            lastMessageAt: conv.lastMessageAt,
            createdAt: conv.createdAt,
            messageCount: conv.messages.length,
        }));

        res.json(simplified);
    } catch (error: any) {
        res
            .status(500)
            .json({ error: error.message || 'Failed to fetch conversations' });
    }
};

export const getConversation = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;

    try {
        const conversation = await Conversation.findOne({
            _id: id,
            userId,
        });

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        res.json({
            id: conversation._id,
            title: conversation.title,
            messages: conversation.messages,
            createdAt: conversation.createdAt,
            lastMessageAt: conversation.lastMessageAt,
            isPublic: conversation.isPublic,
        });
    } catch (error: any) {
        res
            .status(500)
            .json({ error: error.message || 'Failed to fetch conversation' });
    }
};

export const getAiResponse = async (req: AuthRequest, res: Response) => {
    const { conversationId } = req.body;
    const userId = req.user!.id;

    try {
        const conversation = await Conversation.findOne({
            _id: conversationId,
            userId,
        });

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        const messages = conversation.messages.map((m) => ({
            role: m.role,
            content: m.content,
        }));

        // Set up streaming
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        console.log('Sending messages to Groq:', JSON.stringify(messages, null, 2));

        const stream = await groq.chat.completions.create({
            model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: 'You are StudentMentor AI, a helpful and knowledgeable academic assistant. Provide clear, accurate, and encouraging help to students.',
                },
                ...messages as any,
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

        // Save AI response to DB
        const aiMessage = {
            messageId: uuidv4(),
            role: 'assistant' as const,
            content: fullContent,
            timestamp: new Date(),
            metadata: {
                model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
            }
        };

        conversation.messages.push(aiMessage);
        conversation.lastMessageAt = new Date();
        await conversation.save();

        res.write(`data: [DONE]\n\n`);
        res.end();
    } catch (error: any) {
        console.error('Groq AI Error:', error);
        res.write(`data: ${JSON.stringify({ error: 'AI failed to respond' })}\n\n`);
        res.end();
    }
};

export const updateMessageMetadata = async (req: AuthRequest, res: Response) => {
    const { id, messageId } = req.params;
    const { subject, intent } = req.body;
    const userId = req.user!.id;

    try {
        const conversation = await Conversation.findOne({ _id: id, userId });
        if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

        const message = conversation.messages.find(m => m.messageId === messageId);
        if (!message) return res.status(404).json({ error: 'Message not found' });

        if (subject) message.subject = subject;
        if (intent) message.intent = intent;

        await conversation.save();
        res.json({ success: true, message });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getChatStats = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    try {
        const conversations = await Conversation.find({ userId });
        const stats = {
            subjects: {} as Record<string, number>,
            intents: {} as Record<string, number>,
            totalMessages: 0
        };

        conversations.forEach(conv => {
            conv.messages.forEach(msg => {
                if (msg.role === 'user') {
                    stats.totalMessages++;
                    if (msg.subject) stats.subjects[msg.subject] = (stats.subjects[msg.subject] || 0) + 1;
                    if (msg.intent) stats.intents[msg.intent] = (stats.intents[msg.intent] || 0) + 1;
                }
            });
        });

        res.json(stats);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const togglePublicStatus = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const { isPublic } = req.body;

    try {
        const conversation = await Conversation.findOne({ _id: id, userId });
        if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

        conversation.isPublic = isPublic;
        await conversation.save();

        res.json({ success: true, isPublic: conversation.isPublic });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getPublicConversation = async (req: any, res: Response) => {
    const { id } = req.params;

    try {
        const conversation = await Conversation.findById(id);

        if (!conversation || !conversation.isPublic) {
            return res.status(404).json({ error: 'Conversation not found or private' });
        }

        // Return limited data for public view
        res.json({
            id: conversation._id,
            title: conversation.title,
            messages: conversation.messages.map(m => ({
                role: m.role,
                content: m.content,
                timestamp: m.timestamp
            })),
            createdAt: conversation.createdAt,
            lastMessageAt: conversation.lastMessageAt,
            isPublic: conversation.isPublic
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch conversation' });
    }
};
