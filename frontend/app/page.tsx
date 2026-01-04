import Link from 'next/link';
import { Sparkles, ArrowRight, BookOpen, Zap, Bot, GraduationCap } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-200/30 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/30 rounded-full blur-[120px]" />

            {/* Navigation Placeholder */}
            <nav className="relative z-10 px-6 py-8 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <GraduationCap size={24} />
                    </div>
                    <span className="text-xl font-extrabold text-gray-900 tracking-tight">Student<span className="text-brand-600">Mentor</span></span>
                </div>
                <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-brand-600 transition-colors uppercase tracking-widest">
                    Members Entry
                </Link>
            </nav>

            <div className="relative z-10 flex flex-col items-center justify-center pt-20 pb-32 px-4 text-center">
                {/* Hero Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 rounded-full border border-brand-100 mb-8 animate-in fade-in zoom-in duration-1000">
                    <Sparkles size={14} className="text-brand-600" />
                    <span className="text-[10px] font-extrabold text-brand-700 uppercase tracking-[0.2em]">Next-Gen Learning Platform</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-8 max-w-4xl leading-[0.9]">
                    Master your academics with <span className="text-transparent bg-clip-text bg-premium-gradient">AI Intelligence.</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mb-12 leading-relaxed">
                    StudentMentor is your 24/7 personal academic companion. Get instant answers, study plans, and deep conceptual clarity in seconds.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-md">
                    <Link
                        href="/register"
                        className="btn-primary flex items-center justify-center gap-2 group text-lg px-8 py-5 h-16"
                    >
                        Start Learning Free
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/login"
                        className="flex items-center justify-center px-8 py-5 h-16 bg-white border border-gray-200 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 hover:border-brand-300 transition-all duration-300 shadow-sm"
                    >
                        Sign In
                    </Link>
                </div>

                {/* Features Grid */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
                    <div className="glass-card p-10 rounded-[2.5rem] border border-white/40 text-left hover:scale-[1.02] transition-transform duration-500">
                        <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6 shadow-sm">
                            <Bot size={28} />
                        </div>
                        <h3 className="text-xl font-extrabold text-gray-900 mb-4 tracking-tight">Personalized AI Tutor</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Context-aware tutoring that understands your specific curriculum and learning pace.
                        </p>
                    </div>

                    <div className="glass-card p-10 rounded-[2.5rem] border border-white/40 text-left hover:scale-[1.02] transition-transform duration-500">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 shadow-sm">
                            <BookOpen size={28} />
                        </div>
                        <h3 className="text-xl font-extrabold text-gray-900 mb-4 tracking-tight">Omni-Subject Support</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            From Quantum Physics to Renaissance Art, get expert-level insights across all academic disciplines.
                        </p>
                    </div>

                    <div className="glass-card p-10 rounded-[2.5rem] border border-white/40 text-left hover:scale-[1.02] transition-transform duration-500">
                        <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 shadow-sm">
                            <Zap size={28} />
                        </div>
                        <h3 className="text-xl font-extrabold text-gray-900 mb-4 tracking-tight">Instant Clarity</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Stop getting stuck. Get high-fidelity explanations that make even the hardest topics feel simple.
                        </p>
                    </div>
                </div>

                {/* Social Proof Placeholder */}
                <div className="mt-32 border-t border-gray-200 pt-16 w-full">
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.3em] mb-8">Trusted by students worldwide</p>
                    <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale">
                        {/* Mock Logos */}
                        <span className="font-black text-2xl tracking-tighter">STANFORD</span>
                        <span className="font-black text-2xl tracking-tighter">HARVARD</span>
                        <span className="font-black text-2xl tracking-tighter">MIT</span>
                        <span className="font-black text-2xl tracking-tighter">OXFORD</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
