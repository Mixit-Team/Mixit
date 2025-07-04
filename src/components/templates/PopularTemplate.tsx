'use client';

import React, { useEffect, useRef } from 'react';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import CardItem from '@/components/molecules/Card/Card';
import { useApiInfinite } from '@/hooks/useApi';
import type { QueryKey } from '@tanstack/react-query';
import TabNav from '../molecules/TabNav';
import { Card } from '@/types/Home.type';
import DefaultHeader from '../organisms/DefaultHeader';
import { useRouter } from 'next/navigation';

const PopularTemplate = () => {
  const router = useRouter();
  const params = {
    page: 0,
    size: 20,
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useApiInfinite<Card>(
    ['popularCombos', params] as QueryKey,
    '/api/v1/home/popular/combos',
    params
  );

  const items: Card[] = data?.pages.flatMap(p => p.content) ?? [];
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleClickCard = (id: number) => router.push(`/post/${id}`);

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
  console.log('items ', items);

  return (
    <div className="relative flex w-full flex-col gap-6 rounded-lg bg-white p-8">
      <DefaultHeader />
      <TabNav />
      <div className="mt-4 grid w-full grid-cols-[repeat(auto-fill,_minmax(140px,1fr))] gap-4">
        {items.map(item => (
          <CardItem
            authorNickname={null} key={item.id}
            {...item}
            comments={Array.isArray(item.comments) ? item.comments : item.comments ? [item.comments] : []}
            onClick={() => handleClickCard(item.id)}
            isDetail={true}          />
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
