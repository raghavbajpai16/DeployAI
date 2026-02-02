'use client';

import { IGoal } from '@/types';
import { Target, Calendar, CheckCircle, Trash2, Edit2 } from 'lucide-react';

interface GoalCardProps {
    goal: any;
    onUpdateProgress: (id: string, progress: number) => void;
    onEdit: (goal: any) => void;
    onDelete: (id: string) => void;
}

export default function GoalCard({ goal, onUpdateProgress, onEdit, onDelete }: GoalCardProps) {
    const isCompleted = goal.progress >= 100 || goal.status === 'completed';

    return (
        <div className="glass-card p-6 rounded-[2rem] transition-all duration-300 hover:shadow-premium group">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl ${isCompleted ? 'bg-green-50 text-green-600' : 'bg-brand-50 text-brand-600'}`}>
                        <Target size={24} />
                    </div>
                    <div>
                        <h3 className={`text-lg font-bold ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                            {goal.title}
                        </h3>
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-500">
                            {goal.subject}
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(goal)}
                        className="p-2 text-gray-400 hover:text-brand-600 transition-colors"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(goal._id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                {goal.description}
            </p>

            <div className="space-y-4">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-xs font-bold text-gray-400 uppercase">Progress</span>
                    <span className="text-sm font-bold text-brand-600">{goal.progress}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ease-out rounded-full ${isCompleted ? 'bg-green-500' : 'bg-brand-500'}`}
                        style={{ width: `${goal.progress}%` }}
                    />
                </div>

                <div className="flex justify-between items-center text-xs font-semibold text-gray-400 pt-2">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>Deadline: {new Date(goal.targetDate).toLocaleDateString()}</span>
                    </div>
                    {isCompleted && (
                        <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle size={14} />
                            <span>Achieved</span>
                        </div>
                    )}
                </div>

                {!isCompleted && (
                    <div className="flex gap-2 pt-2">
                        {[25, 50, 75, 100].map((p) => (
                            <button
                                key={p}
                                onClick={() => onUpdateProgress(goal._id, p)}
                                className="flex-1 py-1.5 text-[10px] font-extrabold rounded-lg bg-white border border-gray-100 text-gray-400 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all"
                            >
                                {p}%
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
