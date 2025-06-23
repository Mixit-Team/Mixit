import React from 'react';
import PostCard, { PostCardProps } from '../molecules/PostCard';

interface PostGridProps {
  posts: PostCardProps[];
}
const PostGrid: React.FC<PostGridProps> = React.memo(({ posts }) => (
  // <div className="grid grid-cols-2 gap-6 px-2 sm:grid-cols-3 lg:grid-cols-4">
  <div className="grid grid-cols-2 gap-6 px-2">
    {posts.map(post => (
      <PostCard key={post.id} post={post} />
    ))}
  </div>
));
PostGrid.displayName = 'PostGrid';
export default PostGrid;
