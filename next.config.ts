import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'mixit-local.s3.ap-northeast-2.amazonaws.com',
      // 다른 이미지 도메인도 필요시 추가
    ],
  },
  /* config options here */
};

export default nextConfig;
