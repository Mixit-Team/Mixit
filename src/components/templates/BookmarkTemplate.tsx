'use client';

import { useEffect, useRef, useState } from 'react';
import Title from '../atoms/Title';
import SortToggle from '../molecules/SortToggle';
import CardItem from '../molecules/Card/Card';
import LoadingSpinner from '../atoms/LoadingSpinner';
import { useApiInfinite } from '@/hooks/useApi';
import { Card } from '@/types/Home.type';
import { Sort, SORT_TYPE } from '../organisms/CategorySection';
import { useRouter } from 'next/navigation';
import { withAuth } from '../withAuth';

interface FetchParams {
  size: number;
  page: number;
  sort: Sort;
}

const BookmarkTemplate = () => {
  const [params, setParams] = useState<FetchParams>({
    page: 0,
    size: 10,
    sort: 'latest',
  });

  const router = useRouter();
  const handleChange =
    <K extends keyof FetchParams>(key: K) =>
    (value: FetchParams[K]) =>
      setParams(prev => ({ ...prev, [key]: value }));

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useApiInfinite<Card>(
    ['bookmark', params.sort],
    '/api/v1/users/me/bookmarks',
    { size: 10, sort: params.sort }
  );

  console.log('북마크 데이터:', data);
  const items: Card[] = data?.pages.flatMap(p => p.content) ?? [];

  const sentinelRef = useRef<HTMLDivElement>(null);
  console.log('hasNextPage', hasNextPage);
  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  /* ------------------------------ 렌더 ------------------------------ */
  return (
    <div className="relative mx-auto w-full rounded-lg bg-white p-8">
      <Title label="북마크" />

      <SortToggle
        flags={SORT_TYPE}
        active={params.sort}
        onChange={value => handleChange('sort')(value as Sort)}
      />

      {items.length > 0 ? (
        <div className="mt-4 grid grid-cols-[repeat(auto-fill,_minmax(120px,_1fr))] justify-center gap-4">
          {items.map(item => (
            <CardItem {...item} key={item.id} onClick={() => router.push(`/post/${item.id}`)} />
          ))}
        </div>
      ) : (
        <div className="flex h-32 flex-col items-center text-sm text-gray-500">
          <p className="text-center">
            북마크한 조합이 없어요.
            <br />
            다양한 조합을 찾아보세요.
          </p>

          <button className="mt-6 rounded-lg border border-orange-500 px-7 py-3 text-xs text-orange-500">
            더 많은 조합 보러가기
          </button>
        </div>
      )}

      <div ref={sentinelRef} className="h-1" />

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default withAuth(BookmarkTemplate);
