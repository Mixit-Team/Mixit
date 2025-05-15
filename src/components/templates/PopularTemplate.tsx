'use client';

import React, { useEffect, useRef } from 'react';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import CardItem from '@/components/molecules/Card/Card';
import { useApiInfinite } from '@/hooks/useApi';
import { useRoute } from '@/hooks/useRoute';
import type { QueryKey } from '@tanstack/react-query';
import TabNav from '../molecules/TabNav';
import { Card } from '@/types/Home.type';

const PopularTemplate = () => {
  const { routerPush } = useRoute();

  const params = {
    page: 0,
    size: 10,
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useApiInfinite<Card>(
    ['popularCombos', params] as QueryKey,
    '/api/v1/home/popular/combos',
    params
  );

  const items: Card[] = data?.pages.flatMap(p => p.content) ?? [];
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleClickCard = (id: number) => routerPush(`/post/${id}`);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="relative w-full rounded-lg bg-white p-8">
      <TabNav />
      <div className="mt-4 grid w-full grid-cols-[repeat(auto-fill,_minmax(140px,1fr))] gap-4">
        {items.map(item => (
          <CardItem key={item.id} {...item} onClick={() => handleClickCard(item.id)} />
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

export default PopularTemplate;
