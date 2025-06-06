'use client';

import { useState, useEffect, useRef } from 'react';
import { useApiQuery } from '@/hooks/useApi';
import CardItem from '../molecules/Card/Card';
import { Card } from '@/types/Home.type';
import { useRouter } from 'next/navigation';

interface TodayRecomendationSectionProps {
  title: string;
}

interface ApiResponse {
  content: Card[];
}

const CARD_MIN_WIDTH = 120; // grid min-width 정의와 동일하게
const GAP = 16;            // grid gap(px)
const MAX_ITEMS = 5;       // 최대 5개

const TodayRecomendationSection = ({ title }: TodayRecomendationSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [visibleCount, setVisibleCount] = useState(MAX_ITEMS);

  // container 또는 window 너비에 따라 visibleCount 재계산
  useEffect(() => {
    function updateCount() {
      const width = containerRef.current
        ? containerRef.current.clientWidth
        : window.innerWidth;

      // 한 칸당 필요한 너비 = 카드 최소 너비 + gap
      const slot = CARD_MIN_WIDTH + GAP;
      const count = Math.floor(width / slot) || 1;

      // 최대 MAX_ITEMS로 제한
      setVisibleCount(Math.min(count, MAX_ITEMS));
    }

    updateCount();
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, []);

  const { data } = useApiQuery<ApiResponse>(
    ['homeTodayRecomendation', visibleCount],
    '/api/v1/home/recommendations/today',
    { page: 0, size: visibleCount },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const items = data?.content ?? [];

  return (
    <div ref={containerRef} className="mt-4 mb-4 flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="text-[18px] font-[800] text-[#292A2D]">{title}</div>
        <div
          className="
            cursor-pointer 
            text-[14px] leading-[26px]
            transition-colors duration-200 ease-in-out  
            hover:text-[#FD7A19]                       
            hover:underline                            
          "
          onClick={() => router.push('/combinations/recommendation')}
        >
          더보기
</div>

      </div>
      <div
        className="grid justify-center gap-4"
        style={{
          gridTemplateColumns: `repeat(${items.length}, minmax(${CARD_MIN_WIDTH}px, 1fr))`,
        }}
      >
        {items.map(item => (
          <div key={item.id}>
            <CardItem
              {...item}
              comments={Array.isArray(item.comments) ? item.comments : [item.comments]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayRecomendationSection;
