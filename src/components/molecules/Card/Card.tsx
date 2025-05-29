'use client';

import Image from 'next/image';
import { Bookmark, Heart, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Category, ImageType } from '@/types/Home.type';
import { useApiMutation } from '@/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';

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
  hasBookmarked?: boolean;
  isAuthor: boolean;
  authorProfileImage: string | null;
  comments: {
    id: string;
    content: string;
  };
  onClick?: () => void;
  isDetail?: boolean;
}

const CardItem = ({
  id,
  title,
  userId,
  defaultImage,
  likeCount,
  bookmarkCount,
  hasBookmarked,
  isDetail = false,
}: CardProps) => {
  console.log('defaultImage',defaultImage)
  const thumbnail = defaultImage ?? '/images/default_thumbnail.png';
  const router = useRouter();
  const queryClient = useQueryClient();   
  const onClick = () => {
    console.log('Card clicked:', id);
    router.push(`/post/${id}`);
  };

  const postBookmarkMutate = useApiMutation<{ success: boolean }, void>(
    `/api/v1/posts/${id}/bookmark`,
    'post',
    {
      onSuccess: () => {
        console.log('북마크 성공');
        queryClient.invalidateQueries({ queryKey: ['homeCategory'] });
        queryClient.invalidateQueries({ queryKey: ['homePopularCombos'] });
        queryClient.invalidateQueries({ queryKey: ['homeTodayRecomendation'] });
        router.refresh();
      },
    }
  );

  const postBookmarkDeleteMutate = useApiMutation<{ success: boolean }, void>(
    `/api/v1/posts/${id}/bookmark`,
    'delete',
    {
      onSuccess: () => {
        console.log('북마크 취소 성공');
        queryClient.invalidateQueries({ queryKey: ['homeCategory'] });
        queryClient.invalidateQueries({ queryKey: ['homePopularCombos'] });
        queryClient.invalidateQueries({ queryKey: ['homeTodayRecomendation'] });
        router.refresh();
      },
    }
  );

  const handleClickBookmark = async () => {
    if (hasBookmarked) {
      await postBookmarkDeleteMutate.mutateAsync();
    } else {
      await postBookmarkMutate.mutateAsync();
    }
  };

  return (
    <div
      className="mt-1 mb-2 w-full max-w-[200px] cursor-pointer rounded-md bg-white"
      onClick={onClick}
    >
      <div className="relative h-[160px] w-full rounded-md shadow overflow-hidden">
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
          onClick={async e => {
            e.stopPropagation();
            await handleClickBookmark();
          }}
          className="absolute top-2 right-2 h-4 w-4 cursor-pointer"
          color={hasBookmarked ? '#FD7A19' : 'white'}
          fill={hasBookmarked ? '#FD7A19' : 'none'}   
        />
      </div>

      <h3
        className=" mt-2 font-bold text-[14px] text-[#292A2D]"
        style={{ fontFamily: 'NanumSquareRoundOTF' }}
      >
        {title}
      </h3>

      {isDetail && (
        <div className="flex flex-col">
          <div className="flex h-[30px] items-center px-3"></div>
          <div className="flex h-[30px] items-center px-3">
            <h3 className="line-clamp-2 text-sm font-medium text-gray-800">{userId}</h3>
          </div>
          <div className="flex flex-col px-3 pb-2">
            <div className="flex items-center gap-2 text-[12px] text-gray-500">
              <Star className="w-[12px]" />
              {likeCount}
              <Heart className="w-[12px]" />
              {bookmarkCount}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardItem;
