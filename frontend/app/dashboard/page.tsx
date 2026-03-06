'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Loader2,
    LayoutDashboard,
    MessageSquare,
    Target,
    User,
    Sparkles,
    ArrowRight
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { apiFetch } from '@/lib/api';

import Navbar from '@/components/Navbar';

const loadingSpinner = () => <div className="flex items-center justify-center h-40"><Loader2 className="w-6 h-6 text-brand-500 animate-spin" /></div>;

const StatsGrid = dynamic(() => import('../../components/Dashboard/StatsGrid'), { ssr: false, loading: loadingSpinner });
const ActivityChart = dynamic(() => import('../../components/Dashboard/ActivityChart'), { ssr: false, loading: loadingSpinner });
const SubjectCloud = dynamic(() => import('../../components/Dashboard/SubjectCloud'), { ssr: false, loading: loadingSpinner });

interface DashboardData {
    stats: {
        totalMessages: number;
        currentStreak: number;
        topSubjects: { subject: string; count: number }[];
        weeklyActivity: { date: string; count: number }[];
        goals: {
            total: number;
            completed: number;
            active: number;
        };
    };
}

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchDashboardData = async () => {
            const response = await apiFetch<DashboardData>('/analytics/dashboard');
            if (response.success && response.data) {
                setData(response.data);
            } else {
                // If dashboard fails, user is likely not authenticated properly
                localStorage.removeItem('user');
                router.push('/login');
            }
            setLoading(false);
        };

        fetchDashboardData();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest italic">Syncing Learning Data</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-6 text-center p-4">
                <Navbar />
                <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-2 shadow-sm">
                    <LayoutDashboard className="w-10 h-10 text-red-400" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Sync Delayed</h2>
                <p className="text-gray-500 font-medium max-w-xs leading-relaxed">We encountered an issue syncing your learning habits. Please try refreshing your session.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="btn-primary"
                >
                    Refresh Dashboard
                </button>
            </div>
        );
    }

    const quickActions = [
        {
            title: 'AI Consultation',
            desc: 'Get instant answers and academic guidance.',
            icon: MessageSquare,
            color: 'bg-brand-600',
            path: '/chat',
            badge: 'Active'
        },
        {
            title: 'Learning Goals',
            desc: 'Track and manage your academic milestones.',
            icon: Target,
            color: 'bg-blue-600',
            path: '/goals',
            badge: `${data.stats.goals.active} Active`
        },
        {
            title: 'Student Profile',
            desc: 'Personalize your learning experience.',
            icon: User,
            color: 'bg-purple-600',
            path: '/profile'
        }
    ];

    return (
        <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-12 md:pb-20 space-y-8 md:space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 md:gap-5">
                        <div className="p-3 md:p-4 bg-brand-600 rounded-xl md:rounded-2xl text-white shadow-xl shadow-brand-500/20">
                            <LayoutDashboard className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-[var(--foreground)] tracking-tight leading-none italic">
                                Insights <span className="text-brand-600">Overview</span>
                            </h1>
                            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium mt-1 md:mt-2">Visualizing your academic growth journey</p>
                        </div>
                    </div>

                    <div className="self-start md:self-auto flex items-center gap-2 px-4 py-1.5 md:py-2 bg-brand-50 dark:bg-brand-600/10 rounded-full border border-brand-100 dark:border-brand-900/30 text-brand-700 dark:text-brand-400 shadow-sm animate-pulse">
                        <Sparkles size={12} className="md:size-14" />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-none">Global Learning Standard</span>
                    </div>
                </div>

                {/* Quick Access Hub */}
                <section className="space-y-4 md:space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Quick Access Hub</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <div
                                    key={action.path}
                                    onClick={() => router.push(action.path)}
                                    className="glass-card group p-8 rounded-[2.5rem] border border-[var(--border-color)] hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-500 cursor-pointer relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-600/5 rounded-bl-[5rem] -mr-8 -mt-8 group-hover:bg-brand-600/10 transition-colors" />

                                    <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform duration-500`}>
                                        <Icon size={24} />
                                    </div>

                                    {action.badge && (
                                        <span className="absolute top-8 right-8 px-3 py-1 bg-[var(--background)] rounded-full text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest border border-[var(--border-color)] shadow-sm">
                                            {action.badge}
                                        </span>
                                    )}

                                    <h3 className="text-xl font-black text-[var(--foreground)] mb-2 tracking-tight group-hover:text-brand-600 transition-colors">{action.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed mb-6">{action.desc}</p>

                                    <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                        Enter Service
                                        <ArrowRight size={14} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Main Content Sections */}
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Learning Analytics</h2>
                        <StatsGrid stats={data.stats} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2">
                            <ActivityChart data={data.stats.weeklyActivity} />
                        </div>
                        <div className="flex flex-col gap-10">
                            <SubjectCloud subjects={data.stats.topSubjects} />

                            <div className="glass-card p-8 rounded-[2.5rem] bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-xl relative overflow-hidden group border-none">
                                <Sparkles className="absolute top-[-20px] right-[-20px] w-32 h-32 text-white/10 group-hover:scale-125 transition-transform duration-1000" />
                                <h3 className="text-xl font-black mb-4 tracking-tight">Daily Inspiration</h3>
                                <p className="text-brand-50/80 font-medium leading-relaxed italic mb-6 relative z-10">
                                    "The beautiful thing about learning is that no one can take it away from you."
                                </p>
                                <span className="text-xs font-bold uppercase tracking-widest opacity-60 relative z-10">— B.B. King</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
