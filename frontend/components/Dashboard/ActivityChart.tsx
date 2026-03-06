'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

interface ActivityProps {
    data: { date: string; count: number }[];
}

export default function ActivityChart({ data }: ActivityProps) {
    console.log("Chart Data:", data);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[var(--card-bg)] border border-[var(--border-color)] backdrop-blur-md p-3 rounded-lg shadow-xl">
                    <p className="text-gray-500 text-xs mb-1">{label}</p>
                    <p className="text-[var(--foreground)] font-bold">{payload[0].value} Messages</p>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card border border-[var(--border-color)] p-8 rounded-[2.5rem] h-[500px] flex flex-col shadow-premium transition-colors"
        >
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-[var(--foreground)] tracking-tight">Weekly Activity</h3>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-brand-500 rounded-full" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">User Engagement</span>
                </div>
            </div>

            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis
                            dataKey="date"
                            stroke="#94a3b8"
                            fontSize={11}
                            fontWeight={700}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                            tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { weekday: 'short' })}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            fontSize={11}
                            fontWeight={700}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(64,96,255,0.05)' }} />
                        <Bar
                            dataKey="count"
                            radius={[6, 6, 0, 0]}
                            barSize={32}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill="url(#colorGradient)" />
                            ))}
                        </Bar>
                        <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#4060ff" stopOpacity={1} />
                                <stop offset="100%" stopColor="#263df3" stopOpacity={0.8} />
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
