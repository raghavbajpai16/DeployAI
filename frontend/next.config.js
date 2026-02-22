/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: 'standalone',
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // Required for Vercel if using some Pages Router features or mixed modes
    experimental: {
        // bails out of static generation if missing data but continues build
        missingSuspenseWithCSRBailout: false,
    },
};

module.exports = nextConfig;
