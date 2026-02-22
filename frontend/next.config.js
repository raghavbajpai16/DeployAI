/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    // Ensure we are explicitly using App Router features if needed, 
    // but the default is usually fine.
};

module.exports = nextConfig;
