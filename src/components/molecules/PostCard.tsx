import React from 'react';
import Card from '../atoms/Card';
import Image from '../atoms/Image';
import { useRouter } from 'next/navigation';

export interface PostCardProps {
  id: string;
  image: string;
  title: string;
  nickname: string;
  rating: number;
  likes: number;
  profileImage?: string;
}

const PostCard: React.FC<{ post: PostCardProps }> = React.memo(({ post }) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/posts/${post.id}`);
  };

  return (
    <Card className="p-0" onClick={handleClick}>
      <div className="relative aspect-3/4 w-full overflow-hidden bg-black">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-contain"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 4C5.44772 4 5 4.44772 5 5V20.382C5 20.9362 5.68437 21.2346 6.10557 20.8944L12 16.118L17.8944 20.8944C18.3156 21.2346 19 20.9362 19 20.382V5C19 4.44772 18.5523 4 18 4H6Z" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-2">
        <div className="truncate text-sm font-semibold">{post.title}</div>
        <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
          <div className="relative h-6 w-6 overflow-hidden rounded-full">
            <Image
              src={post.profileImage}
              alt="프로필"
              width={16}
              height={16}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="px-2 py-0.5">{post.nickname}</span>
        </div>
        <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
          <span>★ {post.rating}</span>
          <span>♡ {post.likes}</span>
        </div>
      </div>
    </Card>
  );
});
PostCard.displayName = 'PostCard';
export default PostCard;
