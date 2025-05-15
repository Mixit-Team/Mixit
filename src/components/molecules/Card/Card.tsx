'use client';

import Image from 'next/image';
import { Bookmark, Heart, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Category, ImageType } from '@/types/Home.type';

interface CardProps {
  id: number;
  title: string;
  userId: string | number;
  category: Category;
  description: string;
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
  isDetail = false,
}: CardProps) => {
  const thumbnail = defaultImage ?? '/images/default_thumbnail.png';
  const router = useRouter();
  const onClick = () => {
    console.log('Card clicked:', id);
    router.push(`/post/${id}`);
  };

  return (
    <div className="border- mt-1 mb-2 w-full max-w-[200px] rounded-md bg-white" onClick={onClick}>
      <div className="relative h-[160px] w-full rounded-xl shadow">
        <Image src={thumbnail} alt={title || 'Card'} fill className="rounded-md object-cover" />
        <Bookmark className="absolute top-2 right-2 h-4 w-4 cursor-pointer" color="#6366F1" />
      </div>

      <h3 className="text-black-700 mt-2 line-clamp-2">{title}</h3>

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
