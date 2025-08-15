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
  experimental: {
    // Disable static optimization for error pages to avoid SSR issues
    optimizePackageImports: ['react-markdown', 'rehype-highlight']
  },
  /* config options here */
};

export default nextConfig;
