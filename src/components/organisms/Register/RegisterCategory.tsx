'use client';

import { COLOR_SEMANTIC_PRIMARY_NORMAL } from '@/config/color.config';
import { categories, Category } from '@/types/Home.type';
import React from 'react';

interface RegisterCategoryProps {
  category: Category;
  onChange: (newCategory: Category) => void;
}

const RegisterCategory: React.FC<RegisterCategoryProps> = ({ category, onChange }) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-4">
      <h2 className="text-lg font-semibold">카테고리</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            className={`cursor-pointer rounded-lg px-4 py-2 hover:bg-[#FFD1B3] hover:text-[#FD7A19] ${
              category === cat
                ? `bg-[#FFE4D1] text-[${COLOR_SEMANTIC_PRIMARY_NORMAL}]`
                : 'bg-gray-200 text-gray-700'
            } `}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RegisterCategory;
