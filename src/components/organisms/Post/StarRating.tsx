'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Star as StarIcon, StarHalf as StarHalfIcon } from 'lucide-react';
import { useApiMutation, useApiQuery } from '@/hooks/useApi';
import type { QueryKey } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface StarRatingProps {
  postId: number;
  maxStars?: number;
  size?: number;
  rating: {
    averageRating: number;
    ratingCount: number;
  };
}
interface PopularRateResponse {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ postId, maxStars = 5, size = 32, rating }) => {
  const router = useRouter();
      const {  status } = useSession();
  
  const [current, setCurrent] = useState<number>(0);
  const [hovered, setHovered] = useState<number>(0);

  const { data, isSuccess } = useApiQuery<PopularRateResponse>(
    ['postRate', postId] as QueryKey,
    `/api/v1/posts/${postId}/rate`,
    {},
    {
      enabled: !!postId,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const postRate = useApiMutation<{ success: boolean }, { rate: number }>(
    `/api/v1/posts/${postId}/rate`,
    'post',
    {
      onSuccess: () => {
        router.refresh();
      },
    }
  );

  const handleClick = useCallback(
    (rate: number) => {

      if (status !== 'authenticated') {
        alert('로그인이 필요합니다.');
        return;
      }

      setCurrent(rate);
      postRate.mutate({ rate });
    },
    [postRate, status]
  );

  const display = hovered || current;

  useEffect(() => {
    if (isSuccess && data) {
      setCurrent(data.rating ?? 0);
    }
  }, [isSuccess, data]);

  return (
    <div className="box-border flex flex-col gap-4 border-y border-gray-200 p-4 py-6">
      <div className="text-black-600 flex items-center">
        <StarIcon size={size} fill="#DAF14E" stroke="none" className="text-green-400" />
        <span className="text-black-600 ml-2 text-2xl">{rating.averageRating}</span>
        <span className="ml-2 text-xl text-gray-500">{rating.ratingCount}명 참여</span>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center space-x-1" onMouseLeave={() => setHovered(0)}>
          {Array.from({ length: maxStars }, (_, idx) => {
            const starIndex = idx + 1;
            let Icon = StarIcon;
            let color = 'text-gray-300';

            if (display >= starIndex) {
              color = 'text-yellow-400';
            } else if (display >= starIndex - 0.5) {
              Icon = StarHalfIcon;
              color = 'text-yellow-400';
            }

            return (
              <div
                key={idx}
                className="relative cursor-pointer"
                style={{ width: size, height: size }}
                onMouseMove={e => {
                  const { left, width } = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - left;
                  setHovered(x < width / 2 ? starIndex - 0.5 : starIndex);
                }}
                onClick={e => {
                  const { left, width } = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - left;
                  const rateVal = x < width / 2 ? starIndex - 0.5 : starIndex;
                  handleClick(rateVal);
                }}
              >
                <Icon size={size} className={color} />
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-sm text-gray-400">별점을 남겨주세요</p>
      </div>
    </div>
  );
};

export default StarRating;
