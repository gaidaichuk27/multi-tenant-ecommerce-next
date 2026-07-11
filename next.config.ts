import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    transpilePackages: ['@repo/api', '@repo/database'],
};

export default nextConfig;
