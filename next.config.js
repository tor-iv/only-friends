/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use the pages directory for the 404 page
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
