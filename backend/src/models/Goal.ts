import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
    userId: string;
    title: string;
    description: string;
    subject: string;
    progress: number; // 0 to 100
    targetDate: Date;
    milestones: { title: string; isCompleted: boolean }[];
    status: 'active' | 'completed' | 'archived';
    createdAt: Date;
    updatedAt: Date;
}

const GoalSchema: Schema = new Schema(
    {
        userId: { type: String, required: true, index: true },
        title: { type: String, required: true },
        description: { type: String },
        subject: { type: String, required: true },
        progress: { type: Number, default: 0, min: 0, max: 100 },
        milestones: [
            {
                title: { type: String, required: true },
                isCompleted: { type: Boolean, default: false },
            },
        ],
        targetDate: { type: Date, required: true },
        status: {
            type: String,
            enum: ['active', 'completed', 'archived'],
            default: 'active',
        },
    },
    { timestamps: true }
);

export default mongoose.model<IGoal>('Goal', GoalSchema);
