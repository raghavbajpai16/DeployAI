'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Calendar, LogOut, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';

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

    const handleLogout = async () => {
        await apiFetch('/auth/logout', { method: 'POST' });
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-8 pt-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    My Profile
                </h1>

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 shadow-xl">
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                        <div className="relative">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.firstName}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-500/20"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-blue-500/10 flex items-center justify-center border-4 border-blue-500/20">
                                    <User className="w-12 h-12 text-blue-400" />
                                </div>
                            )}
                        </div>

                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
                            <p className="text-zinc-400 mt-1">{user.email}</p>
                            <div className="flex items-center gap-2 mt-4 justify-center md:justify-start">
                                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20">
                                    Student
                                </span>
                                {user.googleId && (
                                    <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-sm border border-red-500/20">
                                        Google Linked
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-zinc-800 pt-8">
                        <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                            <div className="flex items-center gap-3 text-zinc-400 mb-1">
                                <Mail size={16} />
                                <span className="text-sm">Email Address</span>
                            </div>
                            <p className="font-medium">{user.email}</p>
                        </div>

                        <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                            <div className="flex items-center gap-3 text-zinc-400 mb-1">
                                <Calendar size={16} />
                                <span className="text-sm">Joined On</span>
                            </div>
                            <p className="font-medium">
                                {new Date(user.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-zinc-800 flex justify-end">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors border border-red-500/20"
                        >
                            <LogOut size={18} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
