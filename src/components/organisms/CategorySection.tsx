'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryList } from '@/config/home.config';
import CategoryTabs from '../molecules/CategoryTabs';
import CardItem from '../molecules/Card/Card';
import { useApiQuery } from '@/hooks/useApi';
import { Card, Category } from '@/types/Home.type';

export type Sort = 'latest' | 'createdAt' | 'popular';

export interface FetchParams {
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
    {},  
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );


  const items = data?.content ?? [];
  const router = useRouter();

  return (
    <div ref={containerRef} className="px-4">
      <CategoryTabs
        active={params.category}
        onChange={value => setParams(prev => ({ ...prev, category: value, page: 0 }))}
      />

      <div
        className="mt-4 grid"
        style={{
          gridTemplateColumns: `repeat(${items.length}, minmax(100px, 1fr))`,
          gap: '16px',
        }}
      >
        {items.map(item => (
          <CardItem
            key={item.id}
            {...item}
            onClick={() => router.push(`/post/${item.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
