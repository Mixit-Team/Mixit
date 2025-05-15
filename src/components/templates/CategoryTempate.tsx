'use client';

import Banner from '../atoms/Banner/Banner';
import Title from '../atoms/Title';
import CategorySection from '../organisms/CategorySection';

const CategoryTemplate = () => {
  return (
    <div className="relative mx-auto w-full max-w-md rounded-lg bg-white p-8 shadow-md">
      <Title label="카테고리" />
      <Banner imagePath="/images/sample.png" />
      <CategorySection />
    </div>
  );
};

export default CategoryTemplate;
