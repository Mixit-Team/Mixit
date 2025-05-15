'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
interface ImageType {
  src: string;
  id: number;
}

interface ImageSliderProps {
  images?: ImageType[];
  width?: number | string;
  height?: number | string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images = [],
  width = '100%',
  height = '256px',
}) => {
  const [current, setCurrent] = useState(0);
  const count = images.length;

  const prev = () => setCurrent(prev => (prev - 1 + count) % count);
  const next = () => setCurrent(prev => (prev + 1) % count);

  if (count === 0) {
    return (
      <div className="w-full" style={{ height }}>
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-100 text-gray-400">
          아직 사진이 없어요 :)
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg" style={{ width, height }}>
      <Image src={images[current].src} alt={`image-${current}`} fill className="object-contain" />
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="bg-opacity-30 absolute top-1/2 left-2 -translate-y-1/2 transform rounded-full bg-black p-2"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            type="button"
            onClick={next}
            className="bg-opacity-30 absolute top-1/2 right-2 -translate-y-1/2 transform rounded-full bg-black p-2"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </>
      )}
      <div className="bg-opacity-40 absolute right-2 bottom-2 rounded bg-black px-2 py-1 text-xs text-white">
        {current + 1}/{count}
      </div>
    </div>
  );
};

export default ImageSlider;
