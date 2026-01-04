import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Conversation from '../models/Conversation.js';
import { AuthRequest } from '../middleware/auth.js';
import openai from '../config/openai.js';

export const sendMessage = async (req: AuthRequest, res: Response) => {
    const { content, subject } = req.body;
    const userId = req.user!.id;

    if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Message content required' });
    }

    try {
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
            subject: subject || 'general',
            type: 'question' as const,
            timestamp: new Date(),
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

        const stream = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are StudentMentor AI, a helpful and knowledgeable academic assistant. Provide clear, accurate, and encouraging help to students.',
                },
                ...messages,
            ],
            stream: true,
        });

        let fullContent = '';
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            fullContent += content;
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }

        // Save AI response to DB
        const aiMessage = {
            messageId: uuidv4(),
            role: 'assistant' as const,
            content: fullContent,
            timestamp: new Date(),
        };

        conversation.messages.push(aiMessage);
        conversation.lastMessageAt = new Date();
        await conversation.save();

        res.write(`data: [DONE]\n\n`);
        res.end();
    } catch (error: any) {
        console.error('AI Error:', error);
        res.write(`data: ${JSON.stringify({ error: 'AI failed to respond' })}\n\n`);
        res.end();
    }
};
