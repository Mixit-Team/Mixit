'use client';

import Image from 'next/image';
import { Bookmark, Star, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Category, ImageType } from '@/types/Home.type';
import { useApiMutation } from '@/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface CardProps {
  id: number;
  title: string;
  userId: string | number;
  category: Category;
  content?: string;
  images: ImageType[];
  rating?: {
    averageRating: number;
    ratingCount: number;
  };
  likes: number;
  tags: string[];
  bookmarkCount: number;
  defaultImage?: string;
  viewCount: number;
  likeCount: number;
  hasLiked: boolean;
  hasBookmarked?: boolean;
  isAuthor: boolean;
  authorProfileImage: string | null;
  comments: {
    id: string;
    content: string;
  }[];
  onClick?: () => void;
  isDetail?: boolean;
  authorNickname: string | null;
  avgRating?: number;
}

const CardItem = ({
  id,
  title,
  defaultImage,
  hasLiked: initialHasLiked = false,
  hasBookmarked: initialHasBookmarked = false,
  authorProfileImage,
  isDetail = false,
  authorNickname,
  images,
  rating = { averageRating: 0, ratingCount: 0 }, // ★ 디폴트 값
  avgRating=0
}: CardProps) => {
  /* ------------------------------------------------------------------ */
  /* 기본 썸네일                                                         */
  /* ------------------------------------------------------------------ */
  const thumbnail =
    defaultImage || images?.[0]?.src || '/images/default_thumbnail.png';

  /* ------------------------------------------------------------------ */
  /* 공용 훅 & 클라이언트 준비                                          */
  /* ------------------------------------------------------------------ */
  const router = useRouter();
  const queryClient = useQueryClient();
  const { status } = useSession();

  /* ------------------------------------------------------------------ */
  /* 로컬 상태                                                          */
  /* ------------------------------------------------------------------ */
  const [localBookmarked, setLocalBookmarked] = useState(initialHasBookmarked);
  const [localLiked, setLocalLiked] = useState(initialHasLiked);

  // ⭐️ averageRating 전용 상태 (기존 localLikeCount → localAverageRating)
  const [localAverageRating, setLocalAverageRating] = useState<number>(
    rating.averageRating === 0 ? avgRating : rating.averageRating,
  );

  /* prop 변경 시 동기화 */
  useEffect(() => {
    setLocalBookmarked(initialHasBookmarked);
  }, [initialHasBookmarked]);

  useEffect(() => {
    setLocalLiked(initialHasLiked);
  }, [initialHasLiked]);

  useEffect(() => {
    setLocalAverageRating(rating.averageRating);
  }, [rating.averageRating]);

  /* ------------------------------------------------------------------ */
  /* React-Query 뮤테이션 정의                                          */
  /* ------------------------------------------------------------------ */
  const invalidateAllHomeQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['homeCategory'] });
    queryClient.invalidateQueries({ queryKey: ['homePopularCombos'] });
    queryClient.invalidateQueries({ queryKey: ['homeTodayRecomendation'] });
    queryClient.invalidateQueries({ queryKey: ['category'] });
    queryClient.invalidateQueries({ queryKey: ['popularCombos'] });
    router.refresh();
  };

  // 북마크 추가
  const postBookmarkMutate = useApiMutation<{ success: boolean }, void>(
    `/api/v1/posts/${id}/bookmark`,
    'post',
    {
      onSuccess: () => {
        setLocalBookmarked(true);
        invalidateAllHomeQueries();
      },
      onError: () => {
        setLocalBookmarked(prev => !prev);
        alert('북마크 요청에 실패했습니다.');
      },
    },
  );

  // 북마크 삭제
  const postBookmarkDeleteMutate = useApiMutation<{ success: boolean }, void>(
    `/api/v1/posts/${id}/bookmark`,
    'delete',
    {
      onSuccess: () => {
        setLocalBookmarked(false);
        invalidateAllHomeQueries();
      },
      onError: () => {
        setLocalBookmarked(prev => !prev);
        alert('북마크 취소 요청에 실패했습니다.');
      },
    },
  );

  // 좋아요 추가
  // const postLikeMutate = useApiMutation<{ success: boolean }, void>(
  //   `/api/v1/posts/${id}/like`,
  //   'post',
  //   {
  //     onSuccess: () => {
  //       setLocalLiked(true);
  //       // averageRating을 어떻게 올릴지는 정책에 따라 다르므로 예시는 +0.1
  //       setLocalAverageRating(prev => +(prev + 0.1).toFixed(1));
  //     },
  //     onError: () => {
  //       alert('좋아요 요청에 실패했습니다.');
  //     },
  //   },
  // );

  // 좋아요 취소
  // const postLikeDeleteMutate = useApiMutation<{ success: boolean }, void>(
  //   `/api/v1/posts/${id}/like`,
  //   'delete',
  //   {
  //     onSuccess: () => {
  //       setLocalLiked(false);
  //       setLocalAverageRating(prev => Math.max(0, +(prev - 0.1).toFixed(1)));
  //     },
  //     onError: () => {
  //       alert('좋아요 취소 요청에 실패했습니다.');
  //     },
  //   },
  // );

  /* ------------------------------------------------------------------ */
  /* 이벤트 핸들러                                                      */
  /* ------------------------------------------------------------------ */
  const handleClickBookmark = async () => {
    if (status !== 'authenticated') {
      alert('로그인이 필요합니다.');
      return;
    }
    setLocalBookmarked(prev => !prev);
    if (localBookmarked) {
      await postBookmarkDeleteMutate.mutateAsync();
    } else {
      await postBookmarkMutate.mutateAsync();
    }
  };

  // const handleClickLike = async (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   if (status !== 'authenticated') {
  //     alert('로그인이 필요합니다.');
  //     return;
  //   }
  //   if (localLiked) {
  //     await postLikeDeleteMutate.mutateAsync();
  //   } else {
  //     await postLikeMutate.mutateAsync();
  //   }
  // };

  const onCardClick = () => {
    router.push(`/post/${id}`);
  };

  /* ------------------------------------------------------------------ */
  /* 렌더                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <div
      className="mt-1 mb-2 w-full max-w-[200px] cursor-pointer rounded-md bg-white
        transform transition-transform duration-200 ease-out
        hover:scale-[1.02]"
      onClick={onCardClick}
    >
      {/* ─── 썸네일 영역 ─────────────────────────────────────────── */}
      <div className="relative h-[120px] w-full rounded-md shadow overflow-hidden">
        <Image src={thumbnail} alt={title || 'Card'} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
        <Bookmark
          onClick={e => {
            e.stopPropagation();
            handleClickBookmark();
          }}
          className="absolute top-2 right-2 h-4 w-4 cursor-pointer"
          color={localBookmarked ? '#FD7A19' : 'white'}
          fill={localBookmarked ? '#FD7A19' : 'none'}
        />
      </div>

      {/* ─── 제목 ────────────────────────────────────────────────── */}
      <h3
        className="font-bold text-[14px] text-[#292A2D] h-[54px] box-border pt-2 px-2 pb-0 overflow-hidden line-clamp-2"
        style={{ fontFamily: 'NanumSquareRoundOTF' }}
      >
        {title}
      </h3>

      {/* ─── 상세 정보 ────────────────────────────────────────────── */}
      {isDetail && (
        <div className="flex flex-col px-3 pb-2">
          {/* 작성자 */}
          <div className="flex h-[30px] items-center gap-2">
            <Image
              src={authorProfileImage || '/images/default_thumbnail.png'}
              alt="Author Profile"
              width={18}
              height={18}
              className="rounded-sm object-cover flex-shrink-0"
            />
            <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
              {authorNickname}
            </h3>
          </div>

          {/* 평점 & 좋아요 */}
          <div className="flex items-center gap-4 pt-1 text-[12px] text-gray-500">
            {/* ★ 평균 평점 */}
            <div className="flex items-center">
              <Star
                className="w-[14px] h-[14px]"
                color={localAverageRating ? 'yello' : 'gray'}
                fill={localAverageRating ? 'yellow' : 'gray'}
              />
              <span className="ml-1">{localAverageRating.toFixed(1)}</span>
            </div>

            {/* ♥ 좋아요 토글 */}
            {/* <div
              className="flex items-center cursor-pointer"
              onClick={handleClickLike}
            > */}
              <Heart
                size={14}
                fill={localLiked ? 'red' : 'none'}
                stroke={localLiked ? 'red' : '#ccc'}
                strokeWidth={2}
              />
            {/* </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardItem;
