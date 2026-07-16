import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:7090/api/';
    // Strip trailing slash if present for rewrite destination compatibility
    const target = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
    return [
      {
        source: '/api/:path*',
        destination: `${target}/:path*`,
      },
    ];
  },
};

export default nextConfig;
