'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Goal, MessageSquare, Zap, Target } from 'lucide-react';

interface StatsProps {
    stats: {
        totalMessages: number;
        currentStreak: number;
        goals: {
            total: number;
            completed: number;
            active: number;
        }
    }
}

const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="glass-card border border-[var(--border-color)] p-6 rounded-2xl flex items-center gap-4 hover:border-brand-500/30 transition-all group"
    >
        <div className={`p-3 rounded-xl ${color} bg-opacity-20 group-hover:scale-110 transition-transform`}>
            <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
            <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">{title}</h3>
            <p className="text-3xl font-black text-[var(--foreground)] mt-1">{value}</p>
        </div>
    </motion.div>
);

export default function StatsGrid({ stats }: StatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
                title="Total Messages"
                value={stats.totalMessages}
                icon={MessageSquare}
                color="bg-blue-500"
                delay={0.1}
            />
            <StatCard
                title="Current Streak"
                value={`${stats.currentStreak} Days`}
                icon={Zap}
                color="bg-yellow-500"
                delay={0.2}
            />
            <StatCard
                title="Active Goals"
                value={stats.goals.active}
                icon={Target}
                color="bg-green-500"
                delay={0.3}
            />
            <StatCard
                title="Goals Completed"
                value={stats.goals.completed}
                icon={Goal}
                color="bg-purple-500"
                delay={0.4}
            />
        </div>
    );
}
