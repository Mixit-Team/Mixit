'use client';

import { CategoryList } from '@/config/home.config';
import CategoryItem from '../atoms/CategoryItem/CategoryItem';
import { Category } from '@/types/Home.type';

interface CategoryTabsProps {
  active: string;
  onChange: (value: Category) => void;
}

const CategoryTabs = ({ active, onChange }: CategoryTabsProps) => {
  return (
    <div className="flex justify-center">
      <div className="flex justify-around max-w-[300px] w-100 mx-auto">
        {CategoryList.map(({ label, value, logo }) => (
          <button
          key={label}
          onClick={() => onChange(value)}
          className="flex w-[48px] cursor-pointer flex-col items-center focus:outline-none"
          >
            <div>
              <CategoryItem label={label} logo={logo} active={active === value} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
