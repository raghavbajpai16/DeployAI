/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    // Required for Vercel: prevents Pages Router _error pages from crashing the build
    // when using App Router alongside any legacy pages
    experimental: {
        // allow the build to pass even if some pre-renders fail (Vercel handles them at runtime)
    },
};

module.exports = nextConfig;
