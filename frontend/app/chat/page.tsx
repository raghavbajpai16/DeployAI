'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatWindow from '@/components/ChatWindow';
import { apiFetch } from '@/lib/api';
import { MessageSquarePlus, Clock, Search, List, X, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

interface Conversation {
    id: string;
    title: string;
    lastMessageAt: string;
    messageCount: number;
}

export default function ChatPage() {
    const router = useRouter();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const verifyAuth = async () => {
            const response = await apiFetch('/auth/me');
            if (response.success && response.data?.user) {
                setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                fetchConversations();
            } else {
                localStorage.removeItem('user');
                router.push('/login');
            }
            setLoading(false);
        };

        verifyAuth();
    }, [router]);

    const fetchConversations = async () => {
        const response = await apiFetch<Conversation[]>('/chat/conversations');
        if (response.success && response.data) {
            setConversations(response.data);
        }
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] gap-4 transition-colors duration-300">
                <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest italic">Preparing Workspace</p>
            </div>
        );
    }

    const ConversationList = () => (
        <div className="flex flex-col gap-6 h-full overflow-hidden">
            <button
                onClick={() => {
                    setSelectedId(null);
                    setIsSidebarOpen(false);
                }}
                className="btn-primary w-full flex items-center justify-center gap-2 active:scale-95 shadow-brand-500/10"
            >
                <MessageSquarePlus size={18} />
                New Consultation
            </button>

            <div className="glass-card rounded-3xl p-6 flex-1 flex flex-col gap-6 overflow-hidden border-[var(--border-color)]">
                <div className="flex items-center justify-between">
                    <h2 className="font-extrabold text-[var(--foreground)] tracking-tight">Recent Sessions</h2>
                    <Clock size={16} className="text-gray-400" />
                </div>

                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search archives..."
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-[var(--border-color)] rounded-xl text-xs font-semibold focus:bg-white dark:focus:bg-gray-700 focus:border-brand-500 transition-all outline-none text-[var(--foreground)]"
                    />
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                    {conversations.length === 0 ? (
                        <div className="text-center py-10 px-4">
                            <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-300 mx-auto mb-4">
                                <MessageSquarePlus size={24} />
                            </div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">No history found</p>
                        </div>
                    ) : (
                        conversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => {
                                    setSelectedId(conv.id);
                                    setIsSidebarOpen(false);
                                }}
                                className={`group p-4 border rounded-2xl cursor-pointer transition-all duration-300 shadow-sm ${selectedId === conv.id
                                    ? 'bg-brand-50 dark:bg-brand-600/10 border-brand-200 dark:border-brand-900 shadow-brand-500/10'
                                    : 'bg-gray-50/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 border-transparent hover:border-brand-100/50 hover:shadow-brand-500/5'
                                    }`}
                            >
                                <p className={`text-sm font-bold truncate mb-1 transition-colors uppercase tracking-tight ${selectedId === conv.id ? 'text-brand-600 dark:text-brand-400' : 'text-gray-800 dark:text-gray-200 group-hover:text-brand-600 dark:group-hover:text-brand-400'
                                    }`}>{conv.title}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-gray-400">{conv.messageCount} Messages</span>
                                    <span className="text-[10px] font-bold text-brand-500/50 dark:text-brand-400/30">
                                        {new Date(conv.lastMessageAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-screen bg-[var(--background)] transition-colors duration-300 flex flex-col overflow-hidden">
            <Navbar />

            <div className="flex-1 max-w-[1600px] mx-auto w-full flex overflow-hidden pt-16 h-full relative">
                {/* Desktop Sidebar */}
                <aside className="w-80 hidden lg:flex flex-col p-8 pt-10 h-full">
                    <ConversationList />
                </aside>

                {/* Mobile Drawer */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsSidebarOpen(false)}
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80] lg:hidden"
                            />
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-[var(--background)] shadow-2xl z-[90] lg:hidden p-6 pt-20"
                            >
                                <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border-color)]">
                                    <h2 className="text-xl font-black text-[var(--foreground)] tracking-tight">Archives</h2>
                                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400">
                                        <X size={20} />
                                    </button>
                                </div>
                                <ConversationList />
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Primary Chat View */}
                <section className="flex-1 min-w-0 flex flex-col h-full relative">
                    <div className="absolute top-4 left-4 z-10 lg:hidden">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-3 bg-[var(--card-bg)] backdrop-blur-md border border-[var(--border-color)] rounded-2xl text-brand-600 dark:text-brand-400 shadow-premium active:scale-95 transition-all"
                        >
                            <List size={20} />
                        </button>
                    </div>
                    <ChatWindow key={selectedId || 'new'} conversationId={selectedId || undefined} />
                </section>
            </div>
        </div>
    );
}
