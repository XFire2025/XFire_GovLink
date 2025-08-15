import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '67ed7bdab3fd8706347809322d8ffbf0.r2.cloudflarestorage.com',
        port: '',
        pathname: '/govlink/**',
      },
    ],
  },
  // Remove experimental features that might cause build issues
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  /* config options here */
};

export default nextConfig;
