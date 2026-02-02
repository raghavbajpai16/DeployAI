'use client';

import { useState, useEffect } from 'react';
import { X, Target, Calendar, BookOpen, Layers } from 'lucide-react';

interface GoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: any;
}

const SUBJECTS = [
    'Mathematics', 'Science', 'Literature', 'History',
    'Computer Science', 'Economics', 'Psychology', 'Other'
];

export default function GoalModal({ isOpen, onClose, onSubmit, initialData }: GoalModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject: 'Mathematics',
        targetDate: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                subject: initialData.subject || 'Mathematics',
                targetDate: initialData.targetDate ? new Date(initialData.targetDate).toISOString().split('T')[0] : '',
            });
        } else {
            setFormData({
                title: '',
                description: '',
                subject: 'Mathematics',
                targetDate: '',
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="glass-card w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
                        <Target size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900">
                            {initialData ? 'Edit Learning Goal' : 'Create New Goal'}
                        </h2>
                        <p className="text-gray-500 text-sm font-medium">Define your academic milestones</p>
                    </div>
                </div>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit(formData);
                }} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Goal Title</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Master Calculus Integration"
                            className="premium-input h-12"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Description</label>
                        <textarea
                            placeholder="What exactly do you want to achieve?"
                            className="premium-input min-h-[100px] py-3"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Subject</label>
                            <select
                                className="premium-input h-12 appearance-none"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            >
                                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Target Date</label>
                            <input
                                type="date"
                                required
                                className="premium-input h-12"
                                value={formData.targetDate}
                                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary w-full h-14 text-lg mt-4"
                    >
                        {initialData ? 'Update Goal' : 'Launch Goal'}
                    </button>
                </form>
            </div>
        </div>
    );
}
