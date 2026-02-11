'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatWindow from '@/components/ChatWindow';
import { apiFetch } from '@/lib/api';

interface Conversation {
    id: string;
    title: string;
    lastMessageAt: string;
    messageCount: number;
}

import { LogOut, LayoutDashboard, MessageSquarePlus, Clock, Search, Target, User as UserIcon } from 'lucide-react';

export default function ChatPage() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const userData = localStorage.getItem('user');

        if (!accessToken) {
            router.push('/login');
            return;
        }

        setToken(accessToken);
        if (userData) {
            setUser(JSON.parse(userData));
        }

        fetchConversations(accessToken);
        setLoading(false);
    }, [router]);

    const fetchConversations = async (token: string) => {
        const response = await apiFetch<Conversation[]>('/chat/conversations');
        if (response.success && response.data) {
            setConversations(response.data);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (loading || !token) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
                <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Preparing Workspace</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col">
            {/* Nav Header */}
            <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100 px-6 py-4">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                            <LayoutDashboard size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
                                Student<span className="text-brand-600">Mentor</span>
                            </h1>
                            {user && <p className="text-[10px] font-bold text-brand-600/60 uppercase tracking-wide">Academic Portal • {user.firstName}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex items-center gap-2 px-4 py-2 text-gray-500 font-bold text-sm hover:text-brand-600 transition-colors group"
                        >
                            <LayoutDashboard size={18} className="group-hover:scale-110 transition-transform" />
                            Dashboard
                        </button>
                        <button
                            onClick={() => router.push('/goals')}
                            className="flex items-center gap-2 px-4 py-2 text-gray-500 font-bold text-sm hover:text-brand-600 transition-colors group"
                        >
                            <Target size={18} className="group-hover:scale-110 transition-transform" />
                            Academic Goals
                        </button>
                        <button
                            onClick={() => router.push('/profile')}
                            className="flex items-center gap-2 px-4 py-2 text-gray-500 font-bold text-sm hover:text-brand-600 transition-colors group"
                        >
                            <UserIcon size={18} className="group-hover:scale-110 transition-transform" />
                            Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-gray-500 font-bold text-sm hover:text-red-500 transition-colors group"
                        >
                            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 py-8 flex gap-8">
                {/* Modern Sidebar */}
                <aside className="w-80 hidden lg:flex flex-col gap-6">
                    <button
                        onClick={() => {
                            // Reset to new conversation
                            // Ideally handled by passing null ID
                            window.location.reload();
                        }}
                        className="btn-primary w-full flex items-center justify-center gap-2 active:scale-95 shadow-brand-500/10"
                    >
                        <MessageSquarePlus size={18} />
                        New Consultation
                    </button>

                    <div className="glass-card rounded-3xl p-6 flex-1 flex flex-col gap-6 overflow-hidden">
                        <div className="flex items-center justify-between">
                            <h2 className="font-extrabold text-gray-900 tracking-tight">Recent Sessions</h2>
                            <Clock size={16} className="text-gray-400" />
                        </div>

                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search archives..."
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold focus:bg-white focus:border-brand-500 transition-all outline-none"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                            {conversations.length === 0 ? (
                                <div className="text-center py-10 px-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mx-auto mb-4">
                                        <MessageSquarePlus size={24} />
                                    </div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">No history found</p>
                                </div>
                            ) : (
                                conversations.map((conv) => (
                                    <div
                                        key={conv.id}
                                        onClick={() => setSelectedId(conv.id)}
                                        className={`group p-4 border rounded-2xl cursor-pointer transition-all duration-300 shadow-sm ${selectedId === conv.id
                                            ? 'bg-brand-50 border-brand-200 shadow-brand-500/10'
                                            : 'bg-gray-50/50 hover:bg-white border-transparent hover:border-brand-100 hover:shadow-brand-500/5'
                                            }`}
                                    >
                                        <p className={`text-sm font-bold truncate mb-1 transition-colors uppercase tracking-tight ${selectedId === conv.id ? 'text-brand-600' : 'text-gray-800 group-hover:text-brand-600'
                                            }`}>{conv.title}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-gray-400">{conv.messageCount} Messages</span>
                                            <span className="text-[10px] font-bold text-brand-500/50">
                                                {new Date(conv.lastMessageAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </aside>

                {/* Primary Chat View */}
                <section className="flex-1 min-w-0">
                    <ChatWindow key={selectedId || 'new'} token={token} conversationId={selectedId || undefined} />
                </section>
            </main>
        </div>
    );
}
