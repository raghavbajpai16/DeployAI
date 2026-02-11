'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Sparkles, User, LayoutDashboard, Calendar, Clock, Lock } from 'lucide-react';
import Link from 'next/link';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

interface PublicConversation {
    id: string;
    title: string;
    messages: Message[];
    createdAt: string;
    isPublic: boolean;
}

export default function PublicSharePage() {
    const params = useParams();
    const [conversation, setConversation] = useState<PublicConversation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                const res = await fetch(`${API_BASE}/chat/public/${params.id}`);

                if (res.ok) {
                    const data = await res.json();
                    setConversation(data);
                } else {
                    const errData = await res.json();
                    setError(errData.error || 'Failed to load conversation');
                }
            } catch (err) {
                setError('Network error');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchConversation();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !conversation) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-500 mb-4">
                    <Lock size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                <p className="text-gray-500 max-w-md mb-8">
                    {error || 'This conversation is private or does not exist.'}
                </p>
                <Link
                    href="/login"
                    className="px-6 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20"
                >
                    Return Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                            <LayoutDashboard size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                                Student<span className="text-brand-600">Mentor</span>
                            </h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Shared Conversation</p>
                        </div>
                    </div>

                    <Link
                        href="/login"
                        className="text-sm font-bold text-gray-500 hover:text-brand-600 transition-colors"
                    >
                        Login to create your own
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-6 py-12">
                {/* Conversation Meta */}
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4">{conversation.title}</h2>
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-500 font-medium">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-brand-500" />
                            {new Date(conversation.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-brand-500" />
                            {conversation.messages.length} Messages
                        </div>
                    </div>
                </div>

                {/* Messages List */}
                <div className="space-y-8">
                    {conversation.messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-brand-600 text-white' : 'bg-white border border-gray-100 text-brand-600'
                                }`}>
                                {msg.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
                            </div>

                            <div className={`max-w-[80%] space-y-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                <div
                                    className={`inline-block px-6 py-4 rounded-[2rem] shadow-sm font-medium text-[15px] leading-relaxed ${msg.role === 'user'
                                            ? 'bg-brand-600 text-white rounded-tr-none shadow-brand-500/10'
                                            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                </div>
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter block px-1">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
