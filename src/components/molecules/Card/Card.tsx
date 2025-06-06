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
  rating: {
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
  hasBookmarked?: boolean; // 서버에서 내려주는 초기 상태
  isAuthor: boolean;
  authorProfileImage: string | null;
  comments: {
    id: string;
    content: string;
  }[];
  onClick?: () => void;
  isDetail?: boolean;
}

const CardItem = ({
  id,
  title,
  userId,
  defaultImage,
  likeCount: initialLikeCount,
  hasLiked: initialHasLiked = false,
  hasBookmarked: initialHasBookmarked = false,
  authorProfileImage,
  isDetail = false,
}: CardProps) => {
  const thumbnail = defaultImage ?? '/images/default_thumbnail.png';
  const router = useRouter();
  const queryClient = useQueryClient();
  const { status } = useSession();

  // — 로컬 상태로 관리: 서버에서 내려주는 초기값을 바탕으로 토글 가능하도록 함
  const [localBookmarked, setLocalBookmarked] = useState<boolean>(initialHasBookmarked);
  const [localLiked, setLocalLiked] = useState<boolean>(initialHasLiked);
  const [localLikeCount, setLocalLikeCount] = useState<number>(initialLikeCount);

  // prop이 바뀌었을 때 내부 상태 동기화
  useEffect(() => {
    setLocalBookmarked(initialHasBookmarked);
  }, [initialHasBookmarked]);

  useEffect(() => {
    setLocalLiked(initialHasLiked);
  }, [initialHasLiked]);

  useEffect(() => {
    setLocalLikeCount(initialLikeCount);
  }, [initialLikeCount]);



  // — 북마크 추가/삭제 뮤테이션
  const postBookmarkMutate = useApiMutation<{ success: boolean }, void>(
    `/api/v1/posts/${id}/bookmark`,
    'post',
    {
      onSuccess: () => {
        // 성공 시 UI를 업데이트
        setLocalBookmarked(true);
        invalidateAllHomeQueries();
      },
      onError: () => {
        // 실패 시 로컬 상태 롤백
        setLocalBookmarked(prev => !prev);
        alert('북마크 요청에 실패했습니다.');
      },
    }
  );

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
    }
  );

  // — 좋아요 추가/삭제 뮤테이션
  const postLikeMutate = useApiMutation<{ success: boolean }, void>(
    `/api/v1/posts/${id}/like`,
    'post',
    {
      onSuccess: () => {
        setLocalLiked(true);
        setLocalLikeCount(prev => prev + 1);
      },
      onError: () => {
        alert('좋아요 요청에 실패했습니다.');
      },
    }
  );

  const postLikeDeleteMutate = useApiMutation<{ success: boolean }, void>(
    `/api/v1/posts/${id}/like`,
    'delete',
    {
      onSuccess: () => {
        setLocalLiked(false);
        setLocalLikeCount(prev => (prev > 0 ? prev - 1 : 0));
      },
      onError: () => {
        alert('좋아요 취소 요청에 실패했습니다.');
      },
    }
  );

  // — 공통으로 호출할 수 있는 쿼리 무효화 함수
  const invalidateAllHomeQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['homeCategory'] });
    queryClient.invalidateQueries({ queryKey: ['homePopularCombos'] });
    queryClient.invalidateQueries({ queryKey: ['homeTodayRecomendation'] });
    queryClient.invalidateQueries({ queryKey: ['category'] });
    queryClient.invalidateQueries({ queryKey: ['popularCombos'] });
    router.refresh();
  };

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

  const handleClickLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (status !== 'authenticated') {
      alert('로그인이 필요합니다.');
      return;
    }

    // 로컬 상태 토글
    if (localLiked) {
      await postLikeDeleteMutate.mutateAsync();
    } else {
      await postLikeMutate.mutateAsync();
    }
  };

  const onCardClick = () => {
    router.push(`/post/${id}`);
  };

  return (
    <div
      className="mt-1 mb-2 w-full max-w-[200px] cursor-pointer rounded-md bg-white
         transform transition-transform duration-200 ease-out
         hover:scale-[1.02]"
      onClick={onCardClick}
    >
      <div className="relative h-[120px] w-full rounded-md shadow overflow-hidden">
        <Image src={thumbnail} alt={title || 'Card'} fill className="object-cover" />
        <div
          className="
            absolute inset-0         
            bg-gradient-to-b          
            from-black/20             
            to-transparent           
            pointer-events-none       
          "
        />

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

      <h3
        className="font-bold text-[14px] text-[#292A2D] h-[ 54px] box-border pt-2 px-2 pb-0 overflow-hidden line-clamp-2"
        style={{ fontFamily: 'NanumSquareRoundOTF' }}
      >
        {title}
      </h3>

      {isDetail && (
        <div className="flex flex-col px-3 pb-2">
          <div className="flex h-[30px] items-center gap-2 px-0">
            <Image
              src={authorProfileImage || '/images/default_thumbnail.png'}
              alt="Author Profile"
              width={18}    
              height={18}
              className='rounded-sm  object-contain align-middle height-[18px] w-[18px] flex-shrink-0'
              style={{ objectFit: 'cover', height: '18px', width: '18px' }}
            />
            <h3 className="line-clamp-2 text-sm font-medium text-gray-800">{userId}</h3>
          </div>
          <div className="flex items-center gap-4 pt-1 text-[12px] text-gray-500">
            <div
              className="flex items-center"
            >
              <Star
                className="w-[14px] h-[14px]"
                fill={`${initialLikeCount} ? '#FD7A19' : 'gray`} 
              />
              <span className="ml-1">{initialLikeCount}</span>
            </div>

               <div className="flex items-center cursor-pointer" onClick={handleClickLike}>
              <Heart
                className="w-[14px] h-[14px]"
                fill={localLiked ? 'red' : 'transparent'} 
              />
              <span className="ml-1">{localLikeCount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardItem;
