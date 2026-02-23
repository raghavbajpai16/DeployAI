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

    const handleLogout = async () => {
        await apiFetch('/auth/logout', { method: 'POST' });
        localStorage.removeItem('user');
        router.push('/login');
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
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Nav Header */}
            <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-gray-100 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/chat')}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="h-8 w-[1px] bg-gray-200" />
                        <div>
                            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Academic <span className="text-brand-600">Goals</span></h1>
                            {user && <p className="text-[10px] font-bold text-brand-600/60 uppercase tracking-wide">{user.firstName}'s Journey</p>}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="glass-card p-8 rounded-[2.5rem] flex items-center gap-6">
                        <div className="w-16 h-16 bg-brand-50 rounded-3xl flex items-center justify-center text-brand-600">
                            <Target size={32} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Goals</p>
                            <h3 className="text-3xl font-black text-gray-900">{goals.length}</h3>
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-[2.5rem] flex items-center gap-6">
                        <div className="w-16 h-16 bg-green-50 rounded-3xl flex items-center justify-center text-green-600">
                            <Trophy size={32} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Completed</p>
                            <h3 className="text-3xl font-black text-gray-900">{completedGoals}</h3>
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-[2.5rem] flex items-center gap-6">
                        <div className="w-16 h-16 bg-orange-50 rounded-3xl flex items-center justify-center text-orange-600">
                            <TrendingUp size={32} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Avg Progress</p>
                            <h3 className="text-3xl font-black text-gray-900">{avgProgress}%</h3>
                        </div>
                    </div>
                </div>

                {/* Section Header */}
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Active Milestones</h2>
                        <p className="text-gray-500 font-medium">Track and update your learning objectives</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="btn-primary flex items-center gap-2 h-12 px-6"
                    >
                        <Plus size={20} />
                        Define Goal
                    </button>
                </div>

                {/* Goals Grid */}
                {goals.length === 0 ? (
                    <div className="glass-card rounded-[3rem] py-32 flex flex-col items-center justify-center text-center px-6">
                        <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200 mb-8">
                            <Flame size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">No goals set yet</h3>
                        <p className="text-gray-500 font-medium max-w-sm mb-10">
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
