export default function NotFound() {
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
            <div className="text-center">
                <h1 className="text-8xl font-black text-zinc-800 mb-4">404</h1>
                <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
                <p className="text-zinc-400 mb-8">The page you are looking for does not exist.</p>
                <a
                    href="/"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                >
                    Go Home
                </a>
            </div>
        </div>
    );
}
