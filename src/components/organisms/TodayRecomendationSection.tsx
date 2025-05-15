'use client';

import { useApiQuery } from '@/hooks/useApi';
import CardItem from '../molecules/Card/Card';
import { Card } from '@/types/Home.type';

interface TodayRecomendationSectionProps {
  title: string;
}

interface ApiResponse {
  content: Card[];
}

const TodayRecomendationSection = ({ title }: TodayRecomendationSectionProps) => {
  const { data } = useApiQuery<ApiResponse>(
    ['homeTodayRecomendation'],
    '/api/v1/home/recommendations/today',
    { page: 0, size: 3 },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
  const items = data?.content ?? [];
  console.log('TodayRecomendationSection data:', data?.content, items);

  return (
    <div className="mt-4 mb-4 flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="text-[18px] font-[800] text-[#6366F1]">{title}</div>
        <div className="align-center cursor-pointer text-[14px] text-[#6366F1]">더보기</div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(100px,_1fr))] justify-center gap-4">
        {items.map((item: Card) => {
          return (
            <div key={item.id}>
              <CardItem {...item} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodayRecomendationSection;
