import type { NextConfig } from 'next'
import analyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = analyzer({
  enabled: Boolean(process.env.ANALYZE),
})

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/david-portafolio',
  images: {
    unoptimized: true,
  },
}

export default withBundleAnalyzer(nextConfig)
