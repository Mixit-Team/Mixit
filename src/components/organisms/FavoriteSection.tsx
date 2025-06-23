'use client';

import Title from '../atoms/Title';
import CardItem from '../molecules/Card/Card';
import { useApiQuery } from '@/hooks/useApi';
import { Card } from '@/types/Home.type';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface FavoriteSectionProps {
  title: string;
}

interface ApiResponse {
  content: Card[];
}

export interface FetchParams {
    [key: string]: unknown;  

  size: number;
  page: number;
}

const FavoriteSection = ({ title }: FavoriteSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [visibleCount, setVisibleCount] = useState(1);

  const [params, setParams] = useState<FetchParams>({
    page: 0,
    size: visibleCount,
  });

    useEffect(() => {
      function updateVisibleCount() {
        const containerWidth = containerRef.current
          ? containerRef.current.clientWidth
          : window.innerWidth;
        const CARD_MIN_WIDTH = 120;
        const GAP = 16;             
        const total = CARD_MIN_WIDTH + GAP;
        const count = Math.floor(containerWidth / total) || 1;
        setVisibleCount(count);
      }

      updateVisibleCount();
      window.addEventListener('resize', updateVisibleCount);
      return () => window.removeEventListener('resize', updateVisibleCount);
    }, []);

  
  useEffect(() => {
    setParams(prev => ({...prev, size:visibleCount}))
  },[visibleCount])

  const { data } = useApiQuery<ApiResponse>(
    ['homePopularCombos', params],
    '/api/v1/home/popular/combos',
    params,
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );



  const handleClickCard = (id: number) => {
    router.push(`/post/${id}`);
  };

  const items = data?.content ?? [];
  console.log('fav ',items)

  return (
    <div ref={containerRef} className='mt-10'>
      <div className="flex justify-between">
        <Title label={title} />
        <div
          className="
            cursor-pointer 
            text-[14px] leading-[26px]
            transition-colors duration-200 ease-in-out 
            hover:text-[#FD7A19]                      
            hover:underline                        
          "
          onClick={() => router.push('/combinations/popular')}
        >
          더보기
        </div>

      </div>
      <div className="mt-2 grid grid-cols-[repeat(auto-fill,_minmax(120px,_1fr))] justify-center gap-4">
        {items.map((item: Card, index: number) => (
          <div key={item.id}>
            <div className="text-xl text-[#F86885]">{index + 1}</div>
            <CardItem
              {...item}
                authorNickname={item.authorNickname ?? null}
              comments={Array.isArray(item.comments) ? item.comments : [item.comments]}
              onClick={() => handleClickCard(item.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteSection;
