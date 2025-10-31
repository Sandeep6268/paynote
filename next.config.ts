import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    // ✅ Ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
}

export default nextConfig
