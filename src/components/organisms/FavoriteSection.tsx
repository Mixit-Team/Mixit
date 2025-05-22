'use client';

import Title from '../atoms/Title';
import CardItem from '../molecules/Card/Card';
import { useApiQuery } from '@/hooks/useApi';
import { Card } from '@/types/Home.type';
import { useRouter } from 'next/navigation';

interface FavoriteSectionProps {
  title: string;
}

interface ApiResponse {
  content: Card[];
}

const FavoriteSection = ({ title }: FavoriteSectionProps) => {
  // const { data } = useApiQuery<any>(
  //   ['homePopularCombos'],
  //   '/api/v1/home/popular/combos',
  //   { page: 1, size: 3 },
  //   {
  //     refetchOnWindowFocus: false,
  //     refetchOnReconnect: false,
  //   }
  // );

  const { data } = useApiQuery<ApiResponse>(
    ['homePopularCombos'],
    '/api/v1/home/views',
    {},
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  console.log('FavoriteSection data:', data);

  const router = useRouter();

  const handleClickCard = (id: number) => {
    router.push(`/post/${id}`);
  };

  const items = data?.content ?? [];

  return (
    <div>
      <div className="flex justify-between">
        <Title label={title} />
        <div
          className="cursor-pointer text-[14px] leading-[26px]"
          onClick={() => router.push('/combinations/popular')}
        >
          더보기
        </div>
      </div>
      <div className="mt-2 grid grid-cols-[repeat(auto-fill,_minmax(100px,_1fr))] justify-center gap-4">
        {items.map((item: Card, index: number) => (
          <div key={item.id}>
            <div className="text-xl text-[#F86885]">{index + 1}</div>
            <CardItem {...item} onClick={() => handleClickCard(item.id)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteSection;
