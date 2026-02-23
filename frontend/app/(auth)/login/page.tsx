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
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] relative overflow-hidden px-4">
            {/* Abstract Background Shapes */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-200/40 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-[120px]" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-premium mb-6 overflow-hidden">
                        <span className="text-3xl animate-pulse">🤖</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                        Student<span className="text-brand-600">Mentor</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Welcome back! Sign in to continue.</p>
                </div>

                <div className="glass-card rounded-[2rem] p-8 md:p-10 border border-white/40 shadow-premium">
                    <AuthForm type="login" onSuccess={handleSuccess} />

                    <div className="mt-8 text-center border-t border-gray-100 pt-6">
                        <p className="text-gray-500 text-sm font-medium">
                            Don't have an account?{' '}
                            <a href="/register" className="text-brand-600 hover:text-brand-700 font-bold transition-colors">
                                Create an account
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
