'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';

interface AuthFormProps {
    type: 'login' | 'register';
    onSuccess: (token: string) => void;
}

import { Mail, Lock, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';

export default function AuthForm({ type, onSuccess }: AuthFormProps) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const endpoint = type === 'login' ? '/auth/login' : '/auth/register';
        const payload =
            type === 'login'
                ? { email: formData.email, password: formData.password }
                : formData;

        const response = await apiFetch<any>(endpoint, {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        setLoading(false);

        if (response.success && response.data?.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            onSuccess(response.data.accessToken);
        } else {
            setError(response.error || 'Something went wrong');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
            {type === 'register' && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <UserIcon size={16} className="text-brand-500" />
                            First Name
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="John"
                            required
                            className="premium-input"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <UserIcon size={16} className="text-brand-500" />
                            Last Name
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Doe"
                            required
                            className="premium-input"
                        />
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail size={16} className="text-brand-500" />
                    Email Address
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="premium-input"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Lock size={16} className="text-brand-500" />
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="premium-input"
                />
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium animate-shake">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:scale-100"
            >
                {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                ) : (
                    <>
                        {type === 'login' ? 'Sign In' : 'Create Account'}
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </form>
    );
}
