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
            className="glass-card border border-[var(--border-color)] p-8 rounded-[2.5rem] shadow-premium transition-colors"
        >
            <h3 className="text-xl font-black text-[var(--foreground)] mb-6 tracking-tight">Top Interests</h3>
            <div className="flex flex-wrap gap-3">
                {subjects.map((item, index) => {
                    const size = 1 + (item.count / maxCount) * 0.5; // Scale between 1 and 1.5rem

                    return (
                        <motion.div
                            key={index}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="group cursor-default"
                        >
                            <div
                                className="px-4 py-2 rounded-xl bg-brand-50 dark:bg-brand-600/10 border border-brand-100 dark:border-brand-900/30 text-brand-600 dark:text-brand-400 hover:scale-105 transition-all flex items-center gap-2 shadow-sm"
                            >
                                <span className="font-bold text-xs uppercase tracking-wider">{item.subject}</span>
                                <span className="bg-brand-600/10 dark:bg-brand-400/10 text-[10px] px-2 py-0.5 rounded-lg font-black">
                                    {item.count}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}

                {subjects.length === 0 && (
                    <p className="text-gray-400 italic text-sm text-center w-full py-4 uppercase font-bold tracking-widest">No subjects detected yet.</p>
                )}
            </div>
        </motion.div>
    );
}
