'use client';

import React, { useEffect, useState, KeyboardEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useApiQuery } from '@/hooks/useApi';
import { QueryKey, UseQueryOptions } from '@tanstack/react-query';
import { Card } from '@/types/Home.type';
import CardItem from '../molecules/Card/Card';
import { withAuth } from '../withAuth';
import { useDebounce } from '@/hooks/useDebounce';

const PAGE_SIZE = 20;

interface SearchResponse {
  content: Card[];
  totalPages: number;
  totalElements: number;
}

const SearchTemplate: React.FC = () => {
  const router = useRouter();
  const params = useSearchParams();

  const initialKeyword = params.get('keyword') ?? '';
  const initialPage    = Number(params.get('page')    ?? '0');
  const initialSize    = Number(params.get('size')    ?? PAGE_SIZE);
  const initialCategory= params.get('category')       ?? 'CAFE';
  const initialSortBy  = params.get('sortBy')         ?? 'createdAt';

  const [keyword,  setKeyword]  = useState<string>(initialKeyword);
  const debouncedKeyword = useDebounce(keyword, 1000);
  const [list,     setList]     = useState<Card[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [page]     = useState<number>(initialPage);
  const [size]     = useState<number>(initialSize);
  const [category] = useState<string>(initialCategory);
  const [sortBy]   = useState<string>(initialSortBy);

  // 3) URL 동기화
  useEffect(() => {
    setKeyword(initialKeyword);
  }, [initialKeyword]);

  // 4) 검색 실행
  const pushSearch = (q: string) => {
    router.push(
      `/search?keyword=${encodeURIComponent(q)}&page=${page}&size=${size}` +
      `&category=${category}&sortBy=${sortBy}`
    );
  };

  // 5) 키 입력
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const q = keyword.trim();
      if (q) {
        setErrorMsg(null);
        pushSearch(q);
      }
    }
  };

  // 6) API 호출
  const { data, isFetching, isError } = useApiQuery<SearchResponse>(
    ['search', debouncedKeyword, page, size, category, sortBy] as QueryKey,
    '/api/v1/posts/search',
    {
      page:     page.toString(),
      size:     size.toString(),
      category,
      sortBy,
      keyword:  debouncedKeyword,
    },
    {
      enabled:         debouncedKeyword.length > 0,
      keepPreviousData:true,
      staleTime: 60_000,
      onError: (error: unknown) => {
        console.error('검색 API 오류:', error);
        setErrorMsg('검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } as Omit<UseQueryOptions<SearchResponse>, 'queryKey' | 'queryFn'>
  );

  useEffect(() => {
    if (Array.isArray(data?.content) && data?.content?.length > 0) {
      setList(data.content);
    } else {
      setList([]);
    }
  }, [data]);


  return (
    <div className="relative mx-auto flex h-screen w-full max-w-[767px] flex-col bg-white">
      <div className="box-border w-full rounded-lg bg-white p-5">
        <div className="relative flex w-full items-center justify-center py-4">
          <Link href="/home" className="absolute left-4 top-1/2 -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          <div className="flex w-full max-w-[500px] items-center rounded-xl bg-gray-100 px-4 py-2">
            <button
              onClick={() => keyword.trim() && pushSearch(keyword.trim())}
              className="cursor-pointer text-gray-500"
              aria-label="검색"
            >
              <Search className="h-5 w-5" />
            </button>
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={onKeyDown}
              type="text"
              placeholder="검색어를 입력해주세요"
              className="ml-2 flex-1 bg-transparent placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 결과 영역 */}
      <div className="flex-1 overflow-auto p-5">
        {isFetching && <p className="text-center text-gray-500">로딩 중...</p>}
        {(isError || errorMsg) && <p className="text-center text-red-500">{errorMsg}</p>}
        {!isFetching && !isError && list.length === 0 && (
          <p className="text-center text-gray-500">검색 결과가 없습니다.</p>
        )}

        <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
          {list.map((card: Card) => (
            <CardItem
              key={card.id}
              {...card}
              onClick={() => router.push(`/post/${card.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default withAuth(SearchTemplate);
