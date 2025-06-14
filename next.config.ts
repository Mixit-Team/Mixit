import type { NextConfig } from 'next'
import { config as loadDotenvFlow } from 'dotenv-flow'

loadDotenvFlow({
  node_env: process.env.NODE_ENV || 'production',
})

const nextConfig: NextConfig = {
   async redirects() {
    return [
      {
        source: '/',      
        destination: '/home',
        permanent: false,   
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mixit-local.s3.ap-northeast-2.amazonaws.com',
        port: '',        
        pathname: '/**',  
      },
    ],
  },
}

export default nextConfig
