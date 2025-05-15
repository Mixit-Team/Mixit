'use client';

import React from 'react';
import Image from 'next/image';

type BannerProps = {
  imagePath: string;
};

const Banner: React.FC<BannerProps> = ({ imagePath }) => {
  return (
    <div className="relative mt-4 mb-4 h-[100px] w-full overflow-hidden bg-blue-600">
      <Image src={imagePath} alt="Banner" fill style={{ objectFit: 'contain' }} priority />
    </div>
  );
};

export default Banner;
