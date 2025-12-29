import type { NextConfig } from 'next'
import analyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = analyzer({
  enabled: Boolean(process.env.ANALYZE),
  openAnalyzer: true,
  analyzerMode: 'json',
})

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/david-portafolio',
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-separator',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-avatar',
      'react-hot-toast',
    ],
  },
  webpack: (config) => {
    config.ignoreWarnings = [{ module: /node_modules\/awilix/ }]
    return config
  },
}

export default withBundleAnalyzer(nextConfig)
