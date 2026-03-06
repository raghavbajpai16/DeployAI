'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LayoutDashboard } from 'lucide-react';
import dynamic from 'next/dynamic';
import { apiFetch } from '@/lib/api';

const loadingSpinner = () => <div className="flex items-center justify-center h-40"><Loader2 className="w-6 h-6 text-blue-500 animate-spin" /></div>;

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
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 text-center p-4">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-2">
                    <LayoutDashboard className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Dashboard Offline</h2>
                <p className="text-zinc-400 max-w-xs">We encountered an issue syncing your learning data. Please try signing in again.</p>
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mt-4"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-8 pt-24">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                        <LayoutDashboard className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            Learning Dashboard
                        </h1>
                        <p className="text-zinc-400 mt-1">Track your progress and learning habits</p>
                    </div>
                </div>

                {/* Components Grid */}
                <StatsGrid stats={data.stats} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <ActivityChart data={data.stats.weeklyActivity} />
                    </div>
                    <div>
                        <SubjectCloud subjects={data.stats.topSubjects} />
                    </div>
                </div>

            </div>
        </div>
    );
}
