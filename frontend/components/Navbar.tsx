'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    MessageSquare,
    Target,
    LogOut,
    GraduationCap,
    User as UserIcon
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;

    const handleLogout = async () => {
        await apiFetch('/auth/logout', { method: 'POST' });
        localStorage.removeItem('user');
        router.push('/login');
    };

    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Chat', path: '/chat', icon: MessageSquare },
        { label: 'Goals', path: '/goals', icon: Target },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100 flex justify-center h-16 shadow-premium">
            <div className="max-w-[1600px] w-full px-6 flex items-center justify-between h-full">
                {/* Logo Section */}
                <div
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
                        <GraduationCap size={22} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-gray-900 leading-none">
                            Student<span className="text-brand-600">Mentor</span>
                        </h1>
                        {user && (
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                {user.firstName}'s Portal
                            </p>
                        )}
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => router.push(item.path)}
                                className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all duration-300 font-bold text-sm ${isActive
                                        ? 'bg-brand-50 text-brand-600 shadow-sm shadow-brand-500/5'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon size={18} className={isActive ? 'animate-pulse' : ''} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* User Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/profile')}
                        className={`p-2.5 rounded-xl transition-all duration-300 ${pathname === '/profile'
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                        title="Profile"
                    >
                        <UserIcon size={20} />
                    </button>
                    <button
                        onClick={handleLogout}
                        className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 group"
                        title="Sign Out"
                    >
                        <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </header>
    );
}
