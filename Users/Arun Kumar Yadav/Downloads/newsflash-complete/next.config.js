/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
}

module.exports = nextConfig
