import mongoose, { Schema, Document } from 'mongoose';

interface IMessage {
    messageId: string;
    role: 'user' | 'assistant';
    content: string;
    subject?: string;
    type?: 'question' | 'assignment_help' | 'exam_prep';
    timestamp: Date;
    metadata?: {
        tokens?: number;
        model?: string;
    };
}

export interface IConversation extends Document {
    userId: string;
    title: string;
    messages: IMessage[];
    summary?: string;
    keyTopics?: string[];
    createdAt: Date;
    lastMessageAt: Date;
    isArchived: boolean;
}

const MessageSchema: Schema = new Schema(
    {
        messageId: { type: String, required: true },
        role: {
            type: String,
            enum: ['user', 'assistant'],
            required: true,
        },
        content: { type: String, required: true },
        subject: String,
        type: {
            type: String,
            enum: ['question', 'assignment_help', 'exam_prep'],
        },
        timestamp: { type: Date, required: true },
        metadata: {
            tokens: Number,
            model: String,
        },
    },
    { _id: false }
);

const ConversationSchema: Schema = new Schema(
    {
        userId: { type: String, required: true, index: true },
        title: { type: String, required: true, default: 'New Conversation' },
        messages: [MessageSchema],
        summary: String,
        keyTopics: [String],
        lastMessageAt: { type: Date, index: true },
        isArchived: { type: Boolean, default: false },
    },
    { timestamps: true }
);

ConversationSchema.index({ userId: 1, lastMessageAt: -1 });
ConversationSchema.index({ createdAt: -1 });

export default mongoose.model<IConversation>('Conversation', ConversationSchema);
