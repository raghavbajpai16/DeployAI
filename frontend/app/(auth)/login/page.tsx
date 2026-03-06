'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            router.replace('/chat');
        }
    }, [router]);

    const handleSuccess = () => {
        router.push('/chat');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] transition-colors duration-300 relative overflow-hidden px-4">
            {/* Dynamic Abstract Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl shadow-premium mb-8 overflow-hidden group border border-[var(--border-color)]">
                        <span className="text-4xl group-hover:scale-125 transition-transform duration-500">🎓</span>
                    </div>
                    <h1 className="text-5xl font-black text-[var(--foreground)] tracking-tighter mb-4 italic">
                        Mentor<span className="text-brand-600">AI</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                        The Ultimate Student Companion
                    </p>
                </div>

                <div className="glass-card rounded-[3rem] p-10 border border-[var(--border-color)] shadow-premium relative bg-[var(--card-bg)]">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-600/5 rounded-bl-[4rem] -mr-4 -mt-4" />
                    <AuthForm type="login" onSuccess={handleSuccess} />

                    <div className="mt-10 text-center border-t border-[var(--border-color)] pt-8">
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">
                            New here?{' '}
                            <a href="/register" className="text-brand-600 dark:text-brand-400 hover:scale-105 inline-block transition-transform font-black">
                                Create Passport
                            </a>
                        </p>
                    </div>
                </div>

                <p className="mt-10 text-center text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em]">
                    SECURE ACCESS • PRIVATE • ENCRYPTED
                </p>
            </div>
        </div>
    );
}
