'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LayoutDashboard, MessageSquare } from 'lucide-react';
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

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-brand-600 rounded-2xl text-white shadow-xl shadow-brand-500/20">
                            <LayoutDashboard className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
                                Insights <span className="text-brand-600">Overview</span>
                            </h1>
                            <p className="text-gray-500 font-medium mt-2">Visualizing your academic growth journey</p>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/chat')}
                        className="btn-primary h-14 px-8 flex items-center gap-2 group"
                    >
                        Resume Consultation
                        <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                </div>

                {/* Main Content Sections */}
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                    <StatsGrid stats={data.stats} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2">
                            <ActivityChart data={data.stats.weeklyActivity} />
                        </div>
                        <div className="flex flex-col gap-10">
                            <SubjectCloud subjects={data.stats.topSubjects} />

                            <div className="glass-card p-8 rounded-[2.5rem] bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-xl">
                                <h3 className="text-xl font-black mb-4 tracking-tight">Daily Inspiration</h3>
                                <p className="text-brand-50/80 font-medium leading-relaxed italic mb-6">
                                    "The beautiful thing about learning is that no one can take it away from you."
                                </p>
                                <span className="text-xs font-bold uppercase tracking-widest opacity-60">— B.B. King</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
