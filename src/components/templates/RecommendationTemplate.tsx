'use client';

import React, { useEffect, useRef } from 'react';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import CardItem from '@/components/molecules/Card/Card';
import { useApiInfinite } from '@/hooks/useApi';
import type { QueryKey } from '@tanstack/react-query';
import TabNav from '../molecules/TabNav';
import DefaultHeader from '../organisms/DefaultHeader';
import { Card } from '@/types/Home.type';
import { useRouter } from 'next/navigation';

const RecommendationTemplate = () => {
  const router = useRouter();

  // const [params, setParams] = useState<ListParams>({
  //   page: 1,
  //   size: 8,
  // });

  const params = {
    page: 1,
    size: 8,
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useApiInfinite<Card>(
    ['popularCombos', params] as QueryKey,
    '/api/v1/home/recommendations/today',

    params
  );

  const items = data?.pages[0]?.content ?? [];
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleClickCard = (id: number) => {
    router.push(`/post/${id}`);
  };

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
    <div className="relative flex w-full flex-col gap-6 rounded-lg bg-white p-8">
      <DefaultHeader />
      <TabNav />

      <div className="mt-4 grid w-full grid-cols-[repeat(auto-fill,_minmax(140px,1fr))] gap-4">
        {items.map((item: Card) => (
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

export default RecommendationTemplate;
