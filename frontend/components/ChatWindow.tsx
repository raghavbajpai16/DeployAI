'use client';

import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '@/lib/api';

interface Message {
    messageId: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    isStreaming?: boolean;
}

interface ChatWindowProps {
    token: string;
    conversationId?: string;
}

import { Send, Sparkles, User, AlertCircle } from 'lucide-react';

export default function ChatWindow({ token, conversationId }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        const content = input.trim();
        if (!content) return;

        setInput('');
        setError('');
        setLoading(true);

        const userMessage: Message = {
            messageId: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMessage]);

        try {
            const response = await apiFetch<any>('/chat/message', {
                method: 'POST',
                body: JSON.stringify({ content, subject: 'general' }),
            });

            if (!response.success) throw new Error(response.error || 'Failed to send message');

            const convId = response.data.conversation.id;
            const aiMessageId = (Date.now() + 1).toString();
            const placeholderAiMessage: Message = {
                messageId: aiMessageId,
                role: 'assistant',
                content: '',
                timestamp: new Date().toISOString(),
                isStreaming: true,
            };
            setMessages((prev) => [...prev, placeholderAiMessage]);

            const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const aiResponse = await fetch(`${API_BASE}/chat/ai`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({ conversationId: convId }),
            });

            if (!aiResponse.ok) throw new Error('AI request failed');

            const reader = aiResponse.body?.getReader();
            const decoder = new TextDecoder();
            let fullAiContent = '';

            if (reader) {
                setLoading(false);
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const dataStr = line.replace('data: ', '').trim();
                            if (dataStr === '[DONE]') continue;

                            try {
                                const data = JSON.parse(dataStr);
                                if (data.content) {
                                    fullAiContent += data.content;
                                    setMessages((prev) =>
                                        prev.map((msg) =>
                                            msg.messageId === aiMessageId
                                                ? { ...msg, content: fullAiContent }
                                                : msg
                                        )
                                    );
                                }
                                if (data.error) setError(data.error);
                            } catch (e) { }
                        }
                    }
                }
            }

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.messageId === aiMessageId ? { ...msg, isStreaming: false } : msg
                )
            );
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-160px)] glass-card rounded-[2rem] overflow-hidden border border-white/40 shadow-premium">
            {/* Header Area */}
            <div className="px-6 py-4 border-b border-gray-100 bg-white/30 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 leading-tight">AI Academic Mentor</h3>
                        <p className="text-xs font-semibold text-green-500 uppercase tracking-wider">Online & Ready</p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 bg-[#fcfdfe]">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-1000">
                        <div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center text-brand-500 mb-6 shadow-premium">
                            <Sparkles size={40} />
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">How can I help you today?</h2>
                        <p className="text-gray-500 max-w-sm font-medium">
                            I can help you with study schedules, complex topics, or proofreading your essays.
                        </p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.messageId}
                            className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2 duration-500`}
                        >
                            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-brand-600 text-white' : 'bg-white border border-gray-100 text-brand-600'
                                }`}>
                                {msg.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
                            </div>

                            <div className={`max-w-[75%] space-y-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                <div
                                    className={`inline-block px-5 py-3.5 rounded-[1.5rem] shadow-sm font-medium text-[15px] leading-relaxed ${msg.role === 'user'
                                            ? 'bg-brand-600 text-white rounded-tr-none shadow-brand-500/10'
                                            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap">
                                        {msg.content}
                                        {msg.isStreaming && (
                                            <span className="inline-flex gap-1 ml-2">
                                                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
                                                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse delay-75" />
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter block px-1">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white/50 backdrop-blur-md border-t border-gray-100">
                {error && (
                    <div className="flex items-center gap-2 text-red-600 text-xs font-bold mb-4 bg-red-50 p-3 rounded-xl border border-red-100">
                        <AlertCircle size={14} />
                        {error}
                    </div>
                )}
                <div className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your academic question here..."
                        disabled={loading}
                        className="premium-input pr-16 h-14"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        className="absolute right-2 top-2 h-10 w-10 flex items-center justify-center bg-brand-600 text-white rounded-xl hover:bg-brand-700 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-30 disabled:hover:scale-100 disabled:bg-gray-400"
                    >
                        <Send size={18} />
                    </button>
                </div>
                <p className="mt-3 text-[10px] text-center font-bold text-gray-400 uppercase tracking-widest">
                    AI can make mistakes. Check important info.
                </p>
            </div>
        </div>
    );
}
