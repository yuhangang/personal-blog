import type { NextConfig } from "next";

import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: ['192.168.0.115', 'localhost:3000'],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
