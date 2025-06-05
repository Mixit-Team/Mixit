'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import ProfileMainLayout from '@/components/templates/ProfileMainLayout';
import SortTabs from '@/components/molecules/SortTabs';
import PostGrid from '@/components/organisms/PostGrid';
import InfiniteScrollLoader from '@/components/organisms/InfiniteScrollLoader';
import type { PostCardProps } from '@/components/molecules/PostCard';
import type { PostApiPage } from '@/app/api/v1/users/my-page/posts/route';

interface ApiPost {
  id: string;
  title: string;
  authorNickname: string;
  authorProfileImage: string;
  images: { src: string }[];
  likeCount: number;
  rating: {
    averageRating: number;
  };
}

const PAGE_SIZE = 16;

const PostsPage: React.FC = () => {
  const [sort, setSort] = useState<'latest' | 'popular'>('latest');
  const [posts, setPosts] = useState<PostCardProps[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pageRef = useRef(0);

  console.log(posts);
  const fetchPosts = useCallback(
    async (page: number) => {
      try {
        const response = await fetch(
          `/api/v1/users/my-page/posts?page=${page}&size=${PAGE_SIZE}&sort=${sort}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data: PostApiPage<ApiPost> & { nextPage?: number } = await response.json();

        const formattedPosts: PostCardProps[] = data.content.map(post => ({
          id: post.id,
          image: post.images[0]?.src || '',
          title: post.title,
          nickname: post.authorNickname,
          rating: post.rating.averageRating,
          likes: post.likeCount,
          profileImage: post.authorProfileImage,
        }));

        return {
          posts: formattedPosts,
          hasMore: !!data.nextPage,
        };
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        return { posts: [], hasMore: false };
      }
    },
    [sort]
  );

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    const nextPage = pageRef.current + 1;
    const { posts: newPosts, hasMore: morePosts } = await fetchPosts(nextPage);

    setPosts(prev => [...prev, ...newPosts]);
    pageRef.current = nextPage;
    setHasMore(morePosts);
    setLoading(false);
  }, [loading, hasMore, fetchPosts]);

  useEffect(() => {
    const resetAndLoad = async () => {
      setPosts([]);
      pageRef.current = 0;
      setHasMore(true);
      setError(null);
      setLoading(true);

      const { posts: initialPosts, hasMore: morePosts } = await fetchPosts(0);
      setPosts(initialPosts);
      setHasMore(morePosts);
      setLoading(false);
    };

    resetAndLoad();
  }, [sort, fetchPosts]);

  useEffect(() => {
    if (!hasMore || loading) return;

    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, hasMore, loading]);

  return (
    <ProfileMainLayout title="내 게시물" showBackButton>
      <div className="min-h-[80vh] bg-white px-2 pb-4">
        <div className="pt-4 pb-2">
          <SortTabs sort={sort} onChange={setSort} />
        </div>
        {error ? (
          <div className="flex h-40 items-center justify-center text-red-500">{error}</div>
        ) : (
          <>
            <PostGrid posts={posts} />
            {loading && <InfiniteScrollLoader />}
          </>
        )}
      </div>
    </ProfileMainLayout>
  );
};

export default PostsPage;
