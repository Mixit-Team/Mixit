'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ProfileMainLayout from '@/components/templates/ProfileMainLayout';
import SortTabs from '@/components/molecules/SortTabs';
import PostGrid from '@/components/organisms/PostGrid';
import Pagination from '@/components/molecules/Pagination';
import type { PostCardProps } from '@/components/molecules/PostCard';
import type { PostApiPage } from '@/app/api/v1/users/my-page/posts/route';
import Button from '@/components/atoms/Button';
import { useRouter } from 'next/navigation';

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

const PAGE_SIZE = 20;

const PostsPage: React.FC = () => {
  const [sort, setSort] = useState<'latest' | 'popular'>('latest');
  const [posts, setPosts] = useState<PostCardProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchPosts = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        setError(null);

        // API는 0-based pagination을 사용하므로 page-1을 전달
        const response = await fetch(
          `/api/v1/users/my-page/posts?page=${page - 1}&size=${PAGE_SIZE}&sort=${sort}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data: PostApiPage<ApiPost> = await response.json();

        const formattedPosts: PostCardProps[] = data.content.map(post => ({
          id: post.id,
          image: post.images[0]?.src || '',
          title: post.title,
          nickname: post.authorNickname,
          rating: post.rating.averageRating,
          likes: post.likeCount,
          profileImage: post.authorProfileImage,
        }));

        setPosts(formattedPosts);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    },
    [sort]
  );

  // 페이지 변경 핸들러
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // 정렬 변경 시 첫 페이지로 리셋
  const handleSortChange = useCallback((newSort: 'latest' | 'popular') => {
    setSort(newSort);
    setCurrentPage(1);
  }, []);

  // 정렬이나 페이지가 변경될 때 데이터 로드
  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage, fetchPosts]);

  // 정렬이 변경될 때 첫 페이지로 리셋
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [sort]);

  const handleRegisterClick = useCallback(() => {
    router.push('/register');
  }, [router]);

  return (
    <ProfileMainLayout title="내 게시물" showBackButton>
      <div className="bg-white px-2 pb-[160px]">
        <div className="pt-4 pb-2">
          <SortTabs sort={sort} onChange={handleSortChange} />
        </div>
        <div className="px-2">
          {error && <div className="py-2 text-center text-red-500">{error}</div>}
          {loading ? (
            <div className="py-10 text-center text-gray-400">불러오는 중...</div>
          ) : posts.length > 0 ? (
            <>
              <PostGrid posts={posts} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="py-10 text-center text-gray-400">
              작성한 게시글이 없습니다.
              <br />
              다양한 꿀조합을 등록해보세요.
              <div className="mt-6 flex justify-center">
                <Button
                  variant="outline"
                  size="md"
                  className="border-orange-500 text-orange-500 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600"
                  onClick={handleRegisterClick}
                >
                  조합 등록하기
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProfileMainLayout>
  );
};

export default PostsPage;
