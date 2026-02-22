'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SubjectProps {
    subjects: { subject: string; count: number }[];
}

export default function SubjectCloud({ subjects }: SubjectProps) {
    const maxCount = Math.max(...subjects.map(s => s.count), 1);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl"
        >
            <h3 className="text-lg font-semibold text-white mb-6">Top Subjects</h3>
            <div className="flex flex-wrap gap-3">
                {subjects.map((item, index) => {
                    const size = 1 + (item.count / maxCount) * 0.5; // Scale between 1 and 1.5rem

                    return (
                        <motion.div
                            key={index}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="relative group cursor-default"
                        >
                            <div
                                className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-300 hover:border-emerald-500/60 transition-all flex items-center gap-2"
                                style={{ fontSize: `${size}rem` }}
                            >
                                <span className="font-medium text-sm">{item.subject}</span>
                                <span className="bg-emerald-500/20 text-xs px-2 py-0.5 rounded-full text-emerald-200">
                                    {item.count}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}

                {subjects.length === 0 && (
                    <p className="text-zinc-500 italic">No subjects detected yet. Start chatting!</p>
                )}
            </div>
        </motion.div>
    );
}
