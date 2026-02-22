'use client';

import { Suspense } from 'react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function GoogleCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('accessToken', token);

            const apiUrl = process.env.NODE_ENV === 'production'
                ? '/api'
                : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

            fetch(`${apiUrl}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.user) {
                        localStorage.setItem('user', JSON.stringify(data.user));
                        router.push('/dashboard');
                    } else {
                        router.push('/login?error=user_fetch_failed');
                    }
                })
                .catch(() => {
                    router.push('/login?error=server_error');
                });
        } else {
            const error = searchParams.get('error');
            if (!searchParams.toString() || error) {
                router.push('/login');
            }
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Authenticating...</h2>
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-zinc-400">Please wait while we log you in.</p>
            </div>
        </div>
    );
}

export default function GoogleCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <GoogleCallbackContent />
        </Suspense>
    );
}
