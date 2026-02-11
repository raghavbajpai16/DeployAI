'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GoogleCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('accessToken', token);

            // Fetch user data to store in localStorage
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            fetch(`${apiUrl}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.user) {
                        localStorage.setItem('user', JSON.stringify(data.user));
                        router.push('/dashboard');
                    } else {
                        console.error('Failed to fetch user data');
                        router.push('/login?error=user_fetch_failed');
                    }
                })
                .catch((err) => {
                    console.error('Auth error:', err);
                    router.push('/login?error=server_error');
                });

        } else {
            // No token found
            const error = searchParams.get('error');
            if (error) {
                // If backend redirected with error param
                console.error('Auth failed:', error);
            }
            // If we are just landing here without token (and maybe without error param yet), wait or redirect
            if (!searchParams.toString()) {
                // Maybe user navigated here manually?
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
