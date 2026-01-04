/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f0f4ff',
                    100: '#e1e9ff',
                    200: '#c7d6ff',
                    300: '#a1baff',
                    400: '#7190ff',
                    500: '#4060ff',
                    600: '#263df3',
                    700: '#1b2cdb',
                    800: '#1a28af',
                    900: '#1b288b',
                    950: '#111854',
                },
                surface: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'premium-gradient': 'linear-gradient(135deg, #4060ff 0%, #1b2cdb 100%)',
                'glass-gradient': 'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))',
            },
            boxShadow: {
                'premium': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
            }
        },
    },
    plugins: [],
}
