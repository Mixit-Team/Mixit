'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { CategoryList } from '@/config/home.config';
import CategoryTabs from '../molecules/CategoryTabs';
import CardItem from '../molecules/Card/Card';
import LoadingSpinner from '../atoms/LoadingSpinner';
import type { Card, Category } from '@/types/Home.type';
import { useApiInfinite } from '@/hooks/useApi';

export type Sort = 'latest' | 'createdAt' | 'popular';

export interface FetchParams {
  category: Category;
  size: number;
  sort: Sort;
}

const COL_WIDTH = 140;
const DEFAULT_ROWS = 2;
const calcPageSize = () => {
  const cols = Math.max(1, Math.floor(window.innerWidth / COL_WIDTH));
  return cols * DEFAULT_ROWS;
};

const CategoryDetail = () => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  const [pageSize, setPageSize] = useState<number>(() =>
    typeof window !== 'undefined' ? calcPageSize() : 8,
  );

  const [params, setParams] = useState<FetchParams>({
    category: CategoryList[0].value,
    size: pageSize,
    sort: 'createdAt',
  });

  useEffect(() => {
    const onResize = () => {
      const newSize = calcPageSize();
      setPageSize(newSize);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    setParams((prev) => ({ ...prev, size: pageSize }));
    queryClient.removeQueries({ queryKey: ['category'] });
    window.scrollTo({ top: 0 });
  }, [pageSize, queryClient]);

  const handleChange =
    <K extends keyof FetchParams>(key: K) =>
    (value: FetchParams[K]) => {
      setParams((prev) => ({ ...prev, [key]: value }));
      queryClient.removeQueries({ queryKey: ['category'] });
      window.scrollTo({ top: 0 });
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

  const items: Card[] = data?.pages.flatMap((p) => p.content) ?? [];

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNextPage) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    io.observe(el);
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
            authorNickname={card.authorNickname ?? null}
            isDetail
            comments={Array.isArray(card.comments)
              ? card.comments
              : card.comments
              ? [card.comments]
              : []}
            onClick={() => router.push(`/post/${card.id}`)}
          />
        ))}
      </div>

      {/* sentinel */}
      <div ref={sentinelRef} className="h-1" />

      {/* 로딩 스피너 */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default CategoryDetail;
