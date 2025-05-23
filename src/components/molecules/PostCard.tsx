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
    router.push(`/posts/${post.id}`); // 임시 route
  };

  return (
    <Card className="p-0" onClick={handleClick}>
      <div className="relative flex aspect-[3/4] w-full items-center justify-center bg-gray-100">
        <Image src={post.image} alt={post.title} className="h-16 w-16 object-contain opacity-40" />
        <div className="absolute top-2 right-2">
          <svg width="20" height="20" fill="none">
            <rect width="20" height="20" rx="4" fill="#fff" />
            <path d="M6 7l4 4 4-4" stroke="#bbb" strokeWidth="2" fill="none" />
          </svg>
        </div>
      </div>
      <div className="p-2">
        <div className="truncate text-sm font-semibold">{post.title}</div>
        <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
          <Image
            src={post.profileImage}
            alt="프로필"
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
          <span className="rounded-full bg-gray-100 px-2 py-0.5">{post.nickname}</span>
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
