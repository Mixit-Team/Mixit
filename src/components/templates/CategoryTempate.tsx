'use client';

import Banner from '../atoms/Banner/Banner';
import Title from '../atoms/Title';
import CategorySection from '../organisms/CategorySection';

const CategoryTemplate = () => {
  return (
    <div className="mx-auto flex h-screen w-full max-w-[767px] flex-col bg-white">
      <div className="flex-1 overflow-auto">
        <div className="relative box-border w-full rounded-lg bg-white p-5">
          <Title label="카테고리" />
          <Banner imagePath="/images/banner.png" />
          <CategorySection />
        </div>
      </div>
    </div>
  );
};

export default CategoryTemplate;
