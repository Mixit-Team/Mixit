'use client';

import React, { useState, KeyboardEvent, ChangeEvent, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useApiQuery } from '@/hooks/useApi';
import { QueryKey,  } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';

interface RegisterTagsProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  maxTagLength?: number;
}

const RegisterTags: React.FC<RegisterTagsProps> = ({
  tags,
  onChange,
  maxTags = 10,
  maxTagLength = 10,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const debounced = useDebounce(inputValue, 1000);
  const { data, isFetched } = useApiQuery<{ data?: string[]  }>(
    ['autocomplete', debounced] as QueryKey,
    '/api/v1/tags/autocomplete',
    { prefix: debounced },
    {
      enabled: debounced.length > 0,
      staleTime: 60_000,
    }
  );

  const suggestions: string[] = data?.data ?? [];
  console.log('RegisterTags suggestions:', suggestions, data);
  const addTag = (value: string) => {
    const trimmed = value.trim();
    console.log('addTag:', trimmed);
    if (!trimmed) return;
    if (tags.includes(trimmed)) {
      setError('이미 추가된 태그입니다.');
      return;
    }
    if (tags.length >= maxTags) {
      setError(`최대 ${maxTags}개까지 등록 가능합니다.`);
      return;
    }
    if (trimmed.length > maxTagLength) {
      setError(`${maxTagLength}자 이내로 입력해주세요.`);
      return;
    }
    onChange([...tags, trimmed]);
    setInputValue('');
    setError(null);
    setShowSuggestions(false);
  };

  const removeTag = (idx: number) => {
    onChange(tags.filter((_, i) => i !== idx));
    setError(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setShowSuggestions(true);
    } else if (e.key === 'Backspace' && !inputValue && tags.length) {
      removeTag(tags.length - 1);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length <= maxTagLength) {
      setInputValue(val);
      setError(null);
      setShowSuggestions(true);
    }
  };

  // 클릭 외부 감지로 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-white p-4" ref={containerRef}>
      <h2 className="text-lg font-semibold">
        태그 ({tags.length}/{maxTagLength})
      </h2>
      {tags.length < maxTags && (
        <div className="flex flex-col gap-1">
          <div className="relative flex h-[48px] items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onFocus={() => setShowSuggestions(true)}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={`태그를 입력해주세요 (${maxTagLength}자 이내)`}
              className="h-full flex-1 rounded-lg border border-gray-200 px-3 placeholder-gray-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => addTag(inputValue)}
              disabled={!inputValue.trim() || tags.length >= maxTags}
              className="h-full w-[90px] rounded-lg bg-[#FD7A19] font-semibold text-white hover:bg-[#e06517] disabled:bg-[#F4F4F5] disabled:text-[#C2C4C8]"
            >
              추가
            </button>
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <ul className="top-full left-0 z-999 max-h-40 w-full rounded-b-lg border border-gray-200 bg-white shadow-md">
              {suggestions.map(s => (
                <li
                  key={s}
                  onClick={() => addTag(s)}
                  className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
          {showSuggestions && suggestions.length === 0 && isFetched && (
            <ul className="top-full left-0 z-999 max-h-40 w-full rounded-b-lg border border-gray-200 bg-white shadow-md">
                <li
                  key={'No suggestions'}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  추천 태그가 없습니다.
                </li>
            </ul>
          )}
        </div>
      )}

      <div className="mt-2 flex flex-wrap gap-2">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm"
          >
            #{tag}
            <button type="button" className="ml-1" onClick={() => removeTag(idx)}>
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </span>
        ))}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default RegisterTags;
