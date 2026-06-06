/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'http://localhost:4001/api/auth/:path*',
      },
      {
        source: '/api/products/:path*',
        destination: 'http://localhost:4002/api/products/:path*',
      },
      {
        source: '/api/categories/:path*',
        destination: 'http://localhost:4002/api/categories/:path*',
      },
      {
        source: '/api/orders/:path*',
        destination: 'http://localhost:4003/api/orders/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
