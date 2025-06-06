'use client';

import Banner from '../atoms/Banner/Banner';
import Title from '../atoms/Title';
import CategoryDetail from '../organisms/CategoryDetail';

const CategoryTemplate = () => {
  return (
  <div className="mx-auto flex min-h-screen w-full max-w-[767px] flex-col bg-white">
    <div className="flex-1">
        <div className="relative box-border w-full rounded-lg bg-white p-4">
          <Title label="카테고리" />
        </div>
          <Banner imagePath="/images/banner.png" />
        <div className="relative box-border w-full rounded-lg bg-white p-4">
          <CategoryDetail />
        </div>
      </div>
    </div>
  );
};

export default CategoryTemplate;
