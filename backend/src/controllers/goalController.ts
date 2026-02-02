import { Request, Response } from 'express';
import Goal from '../models/Goal.js';
import { AuthRequest } from '../middleware/auth.js';

export const createGoal = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, subject, targetDate, milestones } = req.body;
        const userId = req.user!.id;

        let progress = 0;
        if (milestones && milestones.length > 0) {
            const completed = milestones.filter((m: any) => m.isCompleted).length;
            progress = Math.round((completed / milestones.length) * 100);
        }

        const goal = new Goal({
            userId,
            title,
            description,
            subject,
            targetDate,
            milestones: milestones || [],
            progress,
            status: progress >= 100 ? 'completed' : 'active'
        });

        await goal.save();
        res.status(201).json(goal);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getGoals = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const goals = await Goal.find({ userId }).sort({ createdAt: -1 });
        res.json(goals);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateGoal = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;
        const updates = req.body;

        if (updates.milestones) {
            const completed = updates.milestones.filter((m: any) => m.isCompleted).length;
            updates.progress = Math.round((completed / updates.milestones.length) * 100);
            updates.status = updates.progress >= 100 ? 'completed' : 'active';
        }

        const goal = await Goal.findOneAndUpdate(
            { _id: id, userId },
            updates,
            { new: true }
        );

        if (!goal) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        res.json(goal);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteGoal = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;

        const goal = await Goal.findOneAndDelete({ _id: id, userId });

        if (!goal) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        res.json({ message: 'Goal deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProgress = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { progress } = req.body;
        const userId = req.user!.id;

        const goal = await Goal.findOneAndUpdate(
            { _id: id, userId },
            {
                progress,
                status: progress >= 100 ? 'completed' : 'active'
            },
            { new: true }
        );

        if (!goal) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        res.json(goal);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
