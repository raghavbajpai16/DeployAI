'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AuthForm from '@/components/AuthForm';

export default function RegisterPage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            router.replace('/chat');
        }
    }, [router]);

    const handleSuccess = () => {
        router.push('/chat');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] relative overflow-hidden px-4 py-20">
            {/* Abstract Background Shapes */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-200/40 rounded-full blur-[120px]" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-premium mb-6 animate-bounce-slow">
                        <span className="text-3xl">🚀</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                        Student<span className="text-brand-600">Mentor</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Start your academic journey today.</p>
                </div>

                <div className="glass-card rounded-[2rem] p-8 md:p-10 border border-white/40 shadow-premium">
                    <AuthForm type="register" onSuccess={handleSuccess} />

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm font-medium">
                            Already have an account?{' '}
                            <a href="/login" className="text-brand-600 hover:text-brand-700 font-bold transition-colors">
                                Sign in instead
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
