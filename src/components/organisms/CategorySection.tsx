'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryList } from '@/config/home.config';
import CategoryTabs from '../molecules/CategoryTabs';
import { useApiQuery } from '@/hooks/useApi';
import { Card, Category } from '@/types/Home.type';
import CardList from '../molecules/Card/CardList';

export type Sort = 'latest' | 'createdAt' | 'popular';

export interface FetchParams {
  [key: string]: unknown;  
  category: Category;
  size: number;
  page: number;
  sort: Sort;
}

interface ApiResponse {
  content: Card[];
}

export const SORT_TYPE = [
  { label: '최신순', value: 'latest' },
  { label: '인기순', value: 'popular' },
] as const;

const CategorySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(1);

  const [params, setParams] = useState<FetchParams>({
    category: CategoryList[0].value,
    page: 0,
    size: visibleCount,
    sort: 'createdAt',
  });
console.log('visibleCount ',visibleCount)
  useEffect(() => {
    function updateVisibleCount() {
      const containerWidth = containerRef.current
        ? containerRef.current.clientWidth
        : window.innerWidth;
      const CARD_MIN_WIDTH = 120;
      const GAP = 16;             
      const total = CARD_MIN_WIDTH + GAP;
      const count = Math.floor(containerWidth / total) || 1;
      setVisibleCount(count);
    }

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  useEffect(() => {
    setParams(prev => ({ ...prev, size: visibleCount }));
  }, [visibleCount]);

  const { data } = useApiQuery<ApiResponse>(
    ['homeCategory', params],
    '/api/v1/home/category',
    params,  
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );


  const items = data?.content ?? [];
  const router = useRouter();

  console.log('category ',items)
  return (
    <div ref={containerRef}>
      <CategoryTabs
        active={params.category}
        onChange={value => setParams(prev => ({ ...prev, category: value, page: 0 }))}
      />

      <div
        className="mt-4 grid"
        style={{
          gridTemplateColumns: `repeat(${visibleCount}, minmax(100px, 1fr))`,
          gap: '16px',
        }}
      >
        {items.map(item => (
          <CardList
            key={item.id}
            {...item}
            content={item.content ?? ''}
            onClick={() => router.push(`/post/${item.id}`)}
          />
        ))}
      </div>

      <div
        className="
          mt-10
          cursor-pointer
          text-[#292A2D] font-bold
          flex justify-center items-center
          box-border h-[40px] rounded-sm
          px-20 w-full
          border border-[#DBDCDF]
          transition-colors duration-200 ease-in-out  
          hover:bg-[#F7F7F8]                        
          hover:border-[#C2C4C8]                   
          hover:text-[#1F2023]                      
          hover:shadow-sm                          
        "
        onClick={() => router.push('/category')}
      >
        더보기
      </div>


    </div>
  );
};

export default CategorySection;
