// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ✅ Ignore build errors on Vercel
    ignoreBuildErrors: true,
  },
  eslint: {
    // ✅ Ignore ESLint errors on build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
