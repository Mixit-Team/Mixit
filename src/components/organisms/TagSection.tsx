'use client';

import React from 'react';
import { useApiQuery } from '@/hooks/useApi';
import Tag from '../atoms/Tag';
import Title from '../atoms/Title';
import { useRouter } from 'next/navigation';

interface TagItem {
  tag: string;
  useCount: number;
}

interface PopularTagsResponse {
  data: TagItem[];
}

const TagSection: React.FC = () => {
  const router = useRouter();
  const { data, isLoading, error } = useApiQuery<PopularTagsResponse>(
    ['homeTags'],
    '/api/v1/home/tags/popular',
    {},
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  if (isLoading) return <div>태그를 불러오는 중...</div>;
  if (error) return <div>태그 로드 중 오류가 발생했습니다</div>;

  const tags: TagItem[] = data?.data || [];


  return (
    <section>
      <Title label="인기 태그" />
      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map(({ tag }) => (
          <Tag key={tag} tag={tag} onClick={()=> router.push(`/search?keyword=${tag}`) } />
        ))}
      </div>
    </section>
  );
};

export default TagSection;
