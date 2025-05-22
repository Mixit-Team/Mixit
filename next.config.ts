import type { NextConfig } from 'next'
import { config as loadDotenvFlow } from 'dotenv-flow'

loadDotenvFlow({
  node_env: process.env.NODE_ENV || 'development',
})

const nextConfig: NextConfig = {
  images: {
    domains: [
      'mixit-local.s3.ap-northeast-2.amazonaws.com',
    ],
  },
}

export default nextConfig
