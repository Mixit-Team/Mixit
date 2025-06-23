'use client';

import React from 'react';
import {
  COLOR_ATOMIC_ORANGE_95,
  COLOR_SEMANTIC_FILL_NORMAL,
  COLOR_SEMANTIC_LABEL_NORMAL,
  COLOR_SEMANTIC_PRIMARY_NORMAL,
} from '@/config/color.config';
import Image from 'next/image';

interface CategoryItemProps {
  label: string;
  active: boolean;
  logo: string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ label, active, logo }) => {
  return (
    <div className="flex h-full w-full cursor-pointer flex-col items-center justify-center">
      <div
        className="flex h-[48px] w-[48px] items-center justify-center rounded-xl"
        style={{
          backgroundColor: active ? COLOR_ATOMIC_ORANGE_95 : COLOR_SEMANTIC_FILL_NORMAL,
          border: `1px solid ${
            active ? COLOR_SEMANTIC_PRIMARY_NORMAL : COLOR_SEMANTIC_FILL_NORMAL
          }`,
        }}
      >
        <Image
          src={logo}
          width={40}
          height={40}
          alt={`${label}_image`}
          unoptimized
          className="object-contain"
        />
      </div>
      <span
        className="mt-2 text-xs whitespace-nowrap"
        style={{
          color: active ? COLOR_SEMANTIC_PRIMARY_NORMAL : COLOR_SEMANTIC_LABEL_NORMAL, // 예: 700 수준 투명도
        }}
      >
        {label}
      </span>
    </div>
  );
};
export default CategoryItem;
