'use client';

import React, { useState, KeyboardEvent } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';


export function SearchBar() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');


  const handleSearch = () => {
    if (keyword.trim() === '') return;
    router.push(`/search?query=${encodeURIComponent(keyword.trim())}`);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="flex items-center rounded-xl bg-gray-100 px-4 py-2">
      <button
        onClick={handleSearch}
        aria-label="검색"
        className="flex h-5 w-5 items-center justify-center text-gray-500"
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
  );
}
