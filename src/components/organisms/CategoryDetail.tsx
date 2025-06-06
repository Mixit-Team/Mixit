'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { CategoryList } from '@/config/home.config';
import CategoryTabs from '../molecules/CategoryTabs';
import CardItem from '../molecules/Card/Card';
import LoadingSpinner from '../atoms/LoadingSpinner';
import { useApiInfinite } from '@/hooks/useApi';
import type { Card, Category } from '@/types/Home.type';

export type Sort = 'latest' | 'createdAt' | 'popular';
export interface FetchParams {
  category: Category;
  size: number;
  page: number;
  sort: Sort;
}

const COL_WIDTH = 140;         
const DEFAULT_ROWS = 2;       
const calcPageSize = () => {
  const cols = Math.max(1, Math.floor(window.innerWidth / COL_WIDTH));
  return cols * DEFAULT_ROWS;
};

const CategoryDetail = () => {
  /* refs & router */
  const sentinelRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  const [pageSize, setPageSize] = useState<number>(() =>
    typeof window !== 'undefined' ? calcPageSize() : 8,
  );

  const [params, setParams] = useState<FetchParams>({
    category: CategoryList[0].value,
    page: 0,
    size: pageSize,
    sort: 'createdAt',
  });

  useEffect(() => {
    const onResize = () => setPageSize(calcPageSize());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    setParams(prev => ({ ...prev, size: pageSize, page: 0 }));
    // 캐시 비우고 새로 가져오기
    queryClient.removeQueries({ queryKey: ['category'] });
  }, [pageSize, queryClient]);

  /* ⑥ 카테고리/정렬 변경 핸들러 */
  const handleChange =
    <K extends keyof FetchParams>(key: K) =>
    (value: FetchParams[K]) => {
      setParams(prev => ({ ...prev, [key]: value, page: 0 }));
      queryClient.removeQueries({ queryKey: ['category'] });
    };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useApiInfinite<Card>(
    ['category', params.category, params.sort, pageSize],
    '/api/v1/home/category',
    params,
  );

  const items: Card[] = data?.pages.flatMap(p => p.content) ?? [];
  console.log('items', items);
  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 },
    );

    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div>
      <CategoryTabs active={params.category} onChange={handleChange('category')} />

      <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
        {items.map((card) => (
          <CardItem
            key={card.id}
            {...card}
            comments={Array.isArray(card.comments) ? card.comments : card.comments ? [card.comments] : []}
            onClick={() => router.push(`/post/${card.id}`)}
          />
        ))}
      </div>

      <div ref={sentinelRef} className="h-1" />

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default CategoryDetail;
