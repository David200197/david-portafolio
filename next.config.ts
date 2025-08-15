import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/david-portafolio',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
