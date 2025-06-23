'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type BannerProps = {
  imagePath: string;
};

const Banner: React.FC<BannerProps> = ({ imagePath }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push('/combinations/popular')}
      className="cursor-pointer relative mt-4 mb-4 aspect-[1179/363] w-full overflow-hidden">
      <Image src={imagePath} alt="Banner" fill className="object-cover object-center" priority />
    </div>
  );
};

export default Banner;
