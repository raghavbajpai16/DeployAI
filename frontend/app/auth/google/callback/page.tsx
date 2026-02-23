'use client';

import { Suspense } from 'react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';

function GoogleCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Since the backend sets an HttpOnly cookie, we just fetch /auth/me
        apiFetch('/auth/me')
            .then(response => {
                if (response.success && response.data?.user) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    router.push('/dashboard');
                } else {
                    const error = searchParams?.get('error');
                    router.push(`/login?error=${error || 'auth_failed'}`);
                }
            })
            .catch(() => {
                router.push('/login?error=server_error');
            });
    }, [router, searchParams]);

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
