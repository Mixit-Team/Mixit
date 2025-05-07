'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import ProfileMainLayout from '@/components/templates/ProfileMainLayout';
import SortTabs from '@/components/molecules/SortTabs';
import PostGrid from '@/components/organisms/PostGrid';
import InfiniteScrollLoader from '@/components/organisms/InfiniteScrollLoader';
import type { PostCardProps } from '@/components/molecules/PostCard';

const MOCK_POSTS: PostCardProps[] = Array.from({ length: 30 }).map((_, i) => ({
  id: String(i + 1),
  image: '',
  title: `조합 타이틀`,
  nickname: '유저 닉네임',
  rating: 4.5,
  likes: 2,
}));

const PAGE_SIZE = 8;

const PostsPage: React.FC = () => {
  const [sort, setSort] = useState<'latest' | 'popular'>('latest');
  const [posts, setPosts] = useState<PostCardProps[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const pageRef = useRef(0);

  // 무한 스크롤 핸들러
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    setTimeout(() => {
      // 실제 API 연동 시 fetch로 대체
      const nextPage = pageRef.current + 1;
      const start = (nextPage - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const newPosts = MOCK_POSTS.slice(start, end);
      setPosts(prev => [...prev, ...newPosts]);
      pageRef.current = nextPage;
      setHasMore(end < MOCK_POSTS.length);
      setLoading(false);
    }, 500);
  }, [loading, hasMore]);

  // 최초 1회 로드
  useEffect(() => {
    setPosts([]);
    pageRef.current = 0;
    setHasMore(true);
    loadMore();
    // eslint-disable-next-line
  }, [sort]);

  // 스크롤 이벤트
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

  // 정렬 (실제 API 연동 시 서버에서 정렬)
  const sortedPosts = posts; // mock에서는 정렬 의미 없음

  return (
    <ProfileMainLayout title="내 게시물" showBackButton>
      <div className="min-h-[80vh] bg-white px-2 pb-4">
        <div className="pt-4 pb-2">
          <SortTabs sort={sort} onChange={setSort} />
        </div>
        <PostGrid posts={sortedPosts} />
        {loading && <InfiniteScrollLoader />}
      </div>
    </ProfileMainLayout>
  );
};

export default PostsPage;
