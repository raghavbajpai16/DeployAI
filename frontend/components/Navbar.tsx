import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    MessageSquare,
    Target,
    LogOut,
    GraduationCap,
    User as UserIcon,
    Moon,
    Sun,
    Menu,
    X,
    ChevronRight
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (storedTheme) {
            setTheme(storedTheme);
            document.documentElement.classList.toggle('dark', storedTheme === 'dark');
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

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

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-[100] bg-[var(--card-bg)] backdrop-blur-xl border-b border-[var(--border-color)] flex justify-center h-16 shadow-premium transition-colors duration-300">
            <div className="max-w-[1600px] w-full px-4 md:px-6 flex items-center justify-between h-full">
                {/* Mobile Menu Button - Left on mobile */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden p-2 text-[var(--foreground)] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Logo Section */}
                <div
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-3 cursor-pointer group absolute left-1/2 -translate-x-1/2 lg:relative lg:left-0 lg:translate-x-0"
                >
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:rotate-12 transition-transform duration-300">
                        <GraduationCap size={20} />
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="text-lg md:text-xl font-black text-[var(--foreground)] leading-none tracking-tight">
                            Mentor<span className="text-brand-600">AI</span>
                        </h1>
                    </div>
                </div>

                {/* Desktop Navigation Links */}
                <nav className="hidden lg:flex items-center gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => router.push(item.path)}
                                className={`flex items-center gap-2 px-5 py-2 rounded-xl transition-all duration-300 font-bold text-sm ${isActive
                                    ? 'bg-brand-50 text-brand-600 shadow-sm shadow-brand-500/5 dark:bg-brand-600/10 dark:text-brand-400'
                                    : 'text-gray-500 hover:text-[var(--foreground)] hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <Icon size={18} className={isActive ? 'animate-pulse' : ''} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center gap-1.5 md:gap-3">
                    <button
                        onClick={toggleTheme}
                        className="p-2 md:p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-brand-600 rounded-xl transition-all duration-300"
                        title="Toggle Theme"
                    >
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>
                    <button
                        onClick={() => router.push('/profile')}
                        className={`p-2 md:p-2.5 rounded-xl transition-all duration-300 ${pathname === '/profile'
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-600/10 dark:text-blue-400'
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-[var(--foreground)] hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        title="Profile"
                    >
                        <UserIcon size={18} />
                    </button>
                    <button
                        onClick={handleLogout}
                        className="hidden md:flex p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 group"
                        title="Sign Out"
                    >
                        <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMobileMenu}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-[80%] max-w-xs bg-[var(--background)] shadow-2xl z-[100] lg:hidden p-6 pt-24"
                        >
                            <div className="space-y-6">
                                <div className="pb-6 border-b border-[var(--border-color)]">
                                    <h2 className="text-2xl font-black text-[var(--foreground)] tracking-tight italic">
                                        Navi<span className="text-brand-600">gation</span>
                                    </h2>
                                </div>
                                <div className="space-y-2">
                                    {navItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = pathname === item.path;
                                        return (
                                            <button
                                                key={item.path}
                                                onClick={() => {
                                                    router.push(item.path);
                                                    closeMobileMenu();
                                                }}
                                                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all font-black uppercase tracking-widest text-xs ${isActive
                                                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                                                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <Icon size={20} />
                                                    {item.label}
                                                </div>
                                                <ChevronRight size={16} className={isActive ? 'opacity-100' : 'opacity-0'} />
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="pt-6 mt-10 border-t border-[var(--border-color)]">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-4 p-4 text-red-500 font-black uppercase tracking-widest text-xs hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all"
                                    >
                                        <LogOut size={20} />
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
