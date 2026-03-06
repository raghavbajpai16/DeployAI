'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import GoalCard from '@/components/GoalCard';
import GoalModal from '@/components/GoalModal';
import {
    LayoutDashboard,
    Plus,
    Target,
    ArrowLeft,
    Trophy,
    Flame,
    TrendingUp,
    LogOut
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function GoalsPage() {
    const router = useRouter();
    const [goals, setGoals] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            const response = await apiFetch('/auth/me');
            if (response.success && response.data?.user) {
                setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                fetchGoals();
            } else {
                router.push('/login');
            }
        };

        verifyAuth();
    }, [router]);

    const fetchGoals = async () => {
        const response = await apiFetch<any[]>('/goals');
        if (response.success && response.data) {
            setGoals(response.data);
        }
        setLoading(false);
    };

    const handleCreateOrUpdate = async (formData: any) => {
        const url = editingGoal ? `/goals/${editingGoal._id}` : '/goals';
        const method = editingGoal ? 'PATCH' : 'POST';

        const response = await apiFetch(url, {
            method,
            body: JSON.stringify(formData),
        });

        if (response.success) {
            fetchGoals();
            handleCloseModal();
        } else {
            alert(response.error || 'Failed to save goal');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this goal?')) return;
        const response = await apiFetch(`/goals/${id}`, { method: 'DELETE' });
        if (response.success) {
            fetchGoals();
        }
    };

    const handleUpdateProgress = async (id: string, progress: number) => {
        const response = await apiFetch(`/goals/${id}/progress`, {
            method: 'PATCH',
            body: JSON.stringify({ progress }),
        });
        if (response.success) {
            fetchGoals();
        }
    };

    const handleOpenModal = (goal: any = null) => {
        setEditingGoal(goal);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingGoal(null);
        setIsModalOpen(false);
    };

    const completedGoals = goals.filter(g => g.progress >= 100).length;
    const avgProgress = goals.length > 0
        ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length)
        : 0;

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
                <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Aspirations</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-12 md:pb-20">
                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
                    <div className="glass-card p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex items-center gap-4 md:gap-6">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-50 dark:bg-brand-600/10 rounded-2xl md:rounded-3xl flex items-center justify-center text-brand-600 dark:text-brand-400">
                            <Target size={24} className="md:size-[32px]" />
                        </div>
                        <div>
                            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Total Goals</p>
                            <h3 className="text-2xl md:text-3xl font-black text-[var(--foreground)]">{goals.length}</h3>
                        </div>
                    </div>

                    <div className="glass-card p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex items-center gap-4 md:gap-6">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-green-50 dark:bg-green-600/10 rounded-2xl md:rounded-3xl flex items-center justify-center text-green-600 dark:text-green-400">
                            <Trophy size={24} className="md:size-[32px]" />
                        </div>
                        <div>
                            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Completed</p>
                            <h3 className="text-2xl md:text-3xl font-black text-[var(--foreground)]">{completedGoals}</h3>
                        </div>
                    </div>

                    <div className="glass-card p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex items-center gap-4 md:gap-6">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-50 dark:bg-orange-600/10 rounded-2xl md:rounded-3xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <TrendingUp size={24} className="md:size-[32px]" />
                        </div>
                        <div>
                            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Avg Progress</p>
                            <h3 className="text-2xl md:text-3xl font-black text-[var(--foreground)]">{avgProgress}%</h3>
                        </div>
                    </div>
                </div>

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-[var(--foreground)] tracking-tight mb-1 italic">Active <span className="text-brand-600">Milestones</span></h2>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">Track and update your learning objectives</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="btn-primary flex items-center justify-center gap-2 h-12 px-8 w-full md:w-auto"
                    >
                        <Plus size={20} />
                        Define Goal
                    </button>
                </div>

                {/* Goals Grid */}
                {goals.length === 0 ? (
                    <div className="glass-card rounded-[3rem] py-32 flex flex-col items-center justify-center text-center px-6 border-[var(--border-color)]">
                        <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-[2.5rem] flex items-center justify-center text-gray-200 dark:text-gray-700 mb-8">
                            <Flame size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-[var(--foreground)] mb-2">No goals set yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm mb-10">
                            What are you planning to master this week? Set your first goal to start tracking progress.
                        </p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="btn-primary"
                        >
                            Set Your First Goal
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {goals.map((goal) => (
                            <GoalCard
                                key={goal._id}
                                goal={goal}
                                onUpdateProgress={handleUpdateProgress}
                                onEdit={handleOpenModal}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </main>

            <GoalModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleCreateOrUpdate}
                initialData={editingGoal}
            />
        </div>
    );
}
