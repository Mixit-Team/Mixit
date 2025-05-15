'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useApiQuery } from '@/hooks/useApi';
import { QueryKey, UseQueryOptions } from '@tanstack/react-query';

interface Card {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  category: string;
}

export function SearchBar() {
  const [keyword, setKeyword] = useState('');
  const debounced = useDebounce(keyword, 1000);

  const { data, isFetching, isError } = useApiQuery<Card[]>(
    ['search', debounced] as QueryKey,
    '/search',
    { q: debounced },
    {
      enabled: debounced.length > 0,
      keepPreviousData: true,
      staleTime: 60_000,
    } as Omit<UseQueryOptions<Card[]>, 'queryKey' | 'queryFn'>
  );

  console.log(data, isFetching, isError);

  return (
    <div className="flex items-center rounded-xl bg-gray-100 px-4 py-2">
      <Search className="h-5 w-5 text-gray-500" />
      <input
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        type="text"
        placeholder="검색어를 입력해주세요"
        className="ml-2 flex-1 bg-transparent placeholder-gray-400 focus:outline-none"
      />
    </div>
  );
}
