import Link from 'next/link';
import { Sparkles, ArrowRight, BookOpen, Zap, Bot, GraduationCap, ChevronRight, GraduationCap as LogoIcon } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-[var(--background)] transition-colors duration-500 relative overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-[140px] animate-pulse" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[140px] animate-pulse delay-1000" />

            {/* Premium Header */}
            <nav className="relative z-50 px-6 md:px-8 py-6 md:py-10 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-premium-gradient rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-500/20 group hover:rotate-12 transition-transform duration-500">
                        <LogoIcon size={22} className="md:size-[26px]" />
                    </div>
                    <span className="text-xl md:text-2xl font-black text-[var(--foreground)] tracking-tighter italic">
                        Mentor<span className="text-brand-600">AI</span>
                    </span>
                </div>
                <div className="flex items-center gap-4 md:gap-8">
                    <Link href="/login" className="text-[10px] md:text-xs font-black text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors uppercase tracking-[0.2em] hidden sm:block">
                        Student Access
                    </Link>
                    <Link href="/register" className="btn-primary px-5 md:px-6 py-2 md:py-2.5 h-auto text-[10px] md:text-xs font-black uppercase tracking-widest leading-none">
                        Get Started
                    </Link>
                </div>
            </nav>

            <main className="relative z-10 flex flex-col items-center justify-center pt-16 md:pt-24 pb-24 md:pb-40 px-4 md:px-6 text-center">
                {/* Hero Badge */}
                <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-white dark:bg-gray-800 rounded-full border border-[var(--border-color)] mb-10 md:mb-12 shadow-sm animate-in fade-in zoom-in duration-1000">
                    <Sparkles size={12} className="text-brand-600 animate-pulse" />
                    <span className="text-[9px] md:text-[10px] font-black text-brand-700 dark:text-brand-400 uppercase tracking-[0.3em]">Master Anything Anywhere</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-[7.5rem] font-black text-[var(--foreground)] tracking-tighter mb-8 md:mb-10 max-w-5xl leading-[0.9] md:leading-[0.85] animate-in slide-in-from-bottom-5 duration-1000">
                    The Smartest Way <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-premium-gradient px-2">To Master Everything.</span>
                </h1>

                <p className="text-base md:text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl mb-12 md:mb-14 leading-relaxed px-4">
                    Elevate your academic performance with MentorAI. Get personalized tutoring, deep conceptual insights, and adaptive study plans powered by advanced AI.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center w-full max-w-lg mb-24 md:mb-40 px-4">
                    <Link
                        href="/register"
                        className="btn-primary flex items-center justify-center gap-3 text-base md:text-lg px-8 md:px-10 py-5 md:py-6 group"
                    >
                        Start Journey Free
                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
                    </Link>
                    <Link
                        href="/login"
                        className="flex items-center justify-center px-8 md:px-10 py-5 md:py-6 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl font-black text-[var(--foreground)] hover:border-brand-500 dark:hover:border-brand-400 transition-all duration-300 shadow-sm active:scale-95 text-base md:text-lg"
                    >
                        Member Portal
                    </Link>
                </div>

                {/* Powerful Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full">
                    {[
                        { icon: Bot, title: "AI Academic Mentor", desc: "A recursive learning companion that adapts to your unique neurobiology and study habits.", color: "bg-brand-50 text-brand-600 dark:bg-brand-600/10 dark:text-brand-400" },
                        { icon: BookOpen, title: "Deep Insight Engine", desc: "Break down complex multivariable calculus or literal analysis with extreme high-fidelity explanations.", color: "bg-blue-50 text-blue-600 dark:bg-blue-600/10 dark:text-blue-400" },
                        { icon: Zap, title: "Instant Mastery", desc: "Accelerate your learning curve by 3x with our adaptive feedback loops and cognitive reinforcements.", color: "bg-purple-50 text-purple-600 dark:bg-purple-600/10 dark:text-purple-400" }
                    ].map((feature, idx) => (
                        <div key={idx} className="glass-card p-12 rounded-[3.5rem] border border-[var(--border-color)] text-left hover:scale-[1.02] transition-all duration-700 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 dark:bg-gray-800 rounded-bl-[6rem] -mr-10 -mt-10 group-hover:bg-brand-500/5 transition-colors" />
                            <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:rotate-6 transition-transform`}>
                                <feature.icon size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-[var(--foreground)] mb-4 tracking-tight leading-none italic">{feature.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Global Trust */}
                <div className="mt-40 pt-20 border-t border-[var(--border-color)] w-full max-w-7xl">
                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.4em] mb-12 animate-pulse">
                        INTEGRATED WITH GLOBAL ACADEMIC STANDARDS
                    </p>
                    <div className="flex flex-wrap justify-center gap-16 opacity-30 grayscale dark:opacity-20 hover:opacity-50 transition-opacity duration-1000">
                        <span className="font-black text-3xl tracking-tighter italic">STANFORD</span>
                        <span className="font-black text-3xl tracking-tighter italic">HARVARD</span>
                        <span className="font-black text-3xl tracking-tighter italic">MIT</span>
                        <span className="font-black text-3xl tracking-tighter italic">OXFORD</span>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 pt-20 pb-10 border-t border-[var(--border-color)] text-center">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-600 tracking-widest uppercase">
                    © 2026 MentorAI Labs • Built for the future of learning
                </p>
            </footer>
        </div>
    );
}
