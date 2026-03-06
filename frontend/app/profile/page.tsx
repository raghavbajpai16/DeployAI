'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Calendar, LogOut, Loader2, Award, ShieldCheck } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await apiFetch<any>('/auth/me');
            if (response.success && response.data) {
                setUser(response.data.user);
            } else {
                router.push('/login');
            }
            setLoading(false);
        };

        fetchProfile();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
                        <User size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight italic">
                            Personal <span className="text-blue-600">Profile</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Manage your student identity</p>
                    </div>
                </div>

                <div className="glass-card border border-[var(--border-color)] rounded-[2.5rem] p-10 shadow-premium relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-bl-[5rem] -mr-8 -mt-8" />

                    <div className="flex flex-col md:flex-row items-center gap-10 mb-10 border-b border-[var(--border-color)] pb-10">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-brand-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500" />
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.firstName}
                                    className="relative w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl"
                                />
                            ) : (
                                <div className="relative w-32 h-32 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-xl">
                                    <User className="w-12 h-12 text-blue-500" />
                                </div>
                            )}
                        </div>

                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tight leading-none mb-3">
                                {user.firstName} {user.lastName}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-6 inline-block bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-700">
                                Student ID: {user._id.slice(-8).toUpperCase()}
                            </p>

                            <div className="flex items-center gap-2 justify-center md:justify-start">
                                <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/30">
                                    <Award size={14} />
                                    Active Student
                                </span>
                                {user.googleId && (
                                    <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-black uppercase tracking-widest border border-red-100 dark:border-red-900/30">
                                        <ShieldCheck size={14} />
                                        Google Linked
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-6 rounded-3xl bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 transition-all hover:border-blue-500/20">
                            <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500 mb-2">
                                <Mail size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Email Address</span>
                            </div>
                            <p className="font-bold text-[var(--foreground)] truncate">{user.email}</p>
                        </div>

                        <div className="p-6 rounded-3xl bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 transition-all hover:border-blue-500/20">
                            <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500 mb-2">
                                <Calendar size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Joined On</span>
                            </div>
                            <p className="font-bold text-[var(--foreground)]">
                                {new Date(user.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Session ID: {Math.random().toString(36).substring(7).toUpperCase()}
                        </p>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline"
                        >
                            Return to Hub
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
