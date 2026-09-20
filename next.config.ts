import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    transpilePackages: ['@repo/api', '@repo/database', '@repo/mailer'],
};

export default nextConfig;
