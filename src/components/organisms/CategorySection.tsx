'use client';

import { CategoryList } from '@/config/home.config';
import CategoryTabs from '../molecules/CategoryTabs';
import { useState } from 'react';
import { Card, Category } from '@/types/Home.type';
import { useApiQuery } from '@/hooks/useApi';
import CardItem from '../molecules/Card/Card';
import { useRoute } from '@/hooks/useRoute';

export type Sort = 'latest' | 'createdAt' | 'popular';

// const SORT_TYPE = ["latest", "createdAt", "popular"] as const;

export interface FetchParams {
  category: Category;
  size: number;
  page: number;
  sort: Sort;
}

interface ApiResponse {
  content: Card[];
}

export const SORT_TYPE: readonly { label: string; value: Sort }[] = [
  { label: '최신순', value: 'latest' },
  { label: '인기순', value: 'popular' },
] as const;

const CategorySection = () => {
  const [params, setParams] = useState<FetchParams>({
    category: CategoryList[0].value,
    page: 0,
    size: 8,
    sort: 'createdAt',
  });
  const { routerPush } = useRoute();

  const handleChange =
    <K extends keyof FetchParams>(key: K) =>
    (value: FetchParams[K]) =>
      setParams(prev => ({ ...prev, [key]: value }));

  const { data } = useApiQuery<ApiResponse>(
    ['homeCategory', params],
    '/api/v1/home/category',
    { ...params },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  console.log('CategorySection data:', data);
  const items = data?.content ?? [];

  // const {
  //   data,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetchingNextPage,
  // } = useApiInfinite<Card>(
  //   ['category', params.category, params.sort] as QueryKey,
  //   '/api/v1/posts',
  //   params,
  //   (last) => last.nextPage,
  // );

  // const items = (data?.pages ?? []).flatMap((p) => p.data);

  // const sentinelRef = useRef<HTMLDivElement>(null);

  // const handleClickCard = (id: string) => {
  //   routerPush(`/post/${id}`)
  // }

  // useEffect(() => {
  //   if (!sentinelRef.current) return;
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
  //         fetchNextPage();
  //       }
  //     },
  //     { threshold: 0.5 }
  //   );
  //   observer.observe(sentinelRef.current);
  //   return () => observer.disconnect();
  // }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div>
      <CategoryTabs active={params.category} onChange={handleChange('category')} />

      {/* <SortToggle
        flags={SORT_TYPE}
        active={params.sort}
        onChange={(value) => handleChange('sort')(value as Sort)}
      /> */}

      <div className="mt-4 grid grid-cols-[repeat(auto-fill,_minmax(100px,_1fr))] justify-center gap-4">
        {items.map((item: Card) => (
          <CardItem key={item.id} {...item} onClick={() => routerPush(`/post/${item.id}`)} />
        ))}
      </div>

      {/* <div ref={sentinelRef} className="h-1" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <LoadingSpinner />
        </div>
      )} */}
    </div>
  );
};

export default CategorySection;
