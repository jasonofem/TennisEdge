/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure proper CSS processing
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'tennis-edge.vercel.app'],
    },
  },
  // Disable strict mode during build to prevent double-rendering issues
  reactStrictMode: true,
};

module.exports = nextConfig;
