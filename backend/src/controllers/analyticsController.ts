import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import Conversation from '../models/Conversation.js';
import Goal from '../models/Goal.js';
import mongoose from 'mongoose';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

        // 1. Fetch Conversations & Messages
        const conversations = await Conversation.find({
            userId,
            'messages.0': { $exists: true }
        });

        // Flatten messages for easier analysis
        const allMessages = conversations.flatMap(c => c.messages.filter(m => m.role === 'user'));

        // 2. Calculate Total Messages
        const totalMessages = allMessages.length;

        // 3. Calculate Subject Breakdown
        const subjectStats: Record<string, number> = {};
        allMessages.forEach(msg => {
            if (msg.subject) {
                subjectStats[msg.subject] = (subjectStats[msg.subject] || 0) + 1;
            }
        });

        // Convert to array and sort
        const topSubjects = Object.entries(subjectStats)
            .map(([subject, count]) => ({ subject, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // 4. Calculate Streak (Consecutive days with at least one message)
        // Extract unique dates (YYYY-MM-DD)
        const activityDates = [...new Set(allMessages.map(m => new Date(m.timestamp).toISOString().split('T')[0]))].sort().reverse();

        let currentStreak = 0;
        if (activityDates.length > 0) {
            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];

            // Check if active today or yesterday (to maintain streak)
            if (activityDates[0] === today || activityDates[0] === yesterday) {
                currentStreak = 1;
                let checkDate = new Date(activityDates[0]);

                for (let i = 1; i < activityDates.length; i++) {
                    checkDate.setDate(checkDate.getDate() - 1);
                    const expectedDate = checkDate.toISOString().split('T')[0];
                    if (activityDates[i] === expectedDate) {
                        currentStreak++;
                    } else {
                        break;
                    }
                }
            }
        }

        // 5. Weekly Activity (Last 7 days)
        const weeklyActivity = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const count = allMessages.filter(m => new Date(m.timestamp).toISOString().split('T')[0] === dateStr).length;
            weeklyActivity.push({ date: dateStr, count });
        }

        // 6. Goal Stats
        const goals = await Goal.find({ userId });
        const totalGoals = goals.length;
        const completedGoals = goals.filter(g => g.status === 'completed' || g.progress >= 100).length;
        const activeGoals = totalGoals - completedGoals;

        res.json({
            stats: {
                totalMessages,
                currentStreak,
                topSubjects,
                weeklyActivity,
                goals: {
                    total: totalGoals,
                    completed: completedGoals,
                    active: activeGoals
                }
            }
        });

    } catch (error: any) {
        console.error('Analytics Error:', error);
        res.status(500).json({ error: error.message });
    }
};
