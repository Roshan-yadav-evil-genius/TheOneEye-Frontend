import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '7878',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '7878',
        pathname: '/media/**',
      },
    ],
  },
  // Allow cross-origin requests from localhost during development
  allowedDevOrigins: ['127.0.0.1'],
};

export default nextConfig;
