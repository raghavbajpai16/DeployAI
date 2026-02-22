'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-8xl font-black text-zinc-800 mb-4">500</h1>
                    <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
                    <p className="text-zinc-400 mb-8">An unexpected error occurred. Please try again.</p>
                    <button
                        onClick={reset}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    );
}
