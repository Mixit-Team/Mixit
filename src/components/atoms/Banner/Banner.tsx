'use client';

import React from 'react';
import Image from 'next/image';

type BannerProps = {
  imagePath: string;
};

const Banner: React.FC<BannerProps> = ({ imagePath }) => {
  return (
    <div className="relative mt-4 mb-4 aspect-[1179/363] w-full overflow-hidden">
      <Image src={imagePath} alt="Banner" fill className="object-cover object-center" priority />
    </div>
  );
};

export default Banner;
