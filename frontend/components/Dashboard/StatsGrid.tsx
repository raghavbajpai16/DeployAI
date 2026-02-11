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
        className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl flex items-center gap-4 hover:border-white/20 transition-all group"
    >
        <div className={`p-3 rounded-xl ${color} bg-opacity-20 group-hover:scale-110 transition-transform`}>
            <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
            <h3 className="text-zinc-400 text-sm font-medium">{title}</h3>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
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
