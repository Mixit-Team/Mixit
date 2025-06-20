'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ProfileMainLayout from '@/components/templates/ProfileMainLayout';
import SortTabs from '@/components/molecules/SortTabs';
import Pagination from '@/components/molecules/Pagination';
import CommentList from '@/components/organisms/CommentList';
import { CommentItemProps } from '@/components/molecules/CommentItem';
import type { ReviewApiPage } from '@/app/api/v1/users/my-page/reviews/route';

interface ApiReview {
  post: {
    title: string;
    image?: string;
  };
  review: {
    content: string;
    createdAt: string;
    image: string;
  };
  id: string;
}

const PAGE_SIZE = 20;

const CommentsPage: React.FC = () => {
  const [sort, setSort] = useState<'latest' | 'popular'>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [comments, setComments] = useState<CommentItemProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  const fetchComments = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        setError(null);

        // API는 0-based pagination을 사용하므로 page-1을 전달
        const response = await fetch(
          `/api/v1/users/my-page/reviews?page=${page - 1}&size=${PAGE_SIZE}&sort=${sort}`
        );

        if (!response.ok) {
          throw new Error('댓글 데이터를 불러오지 못했습니다.');
        }

        const data: ReviewApiPage<ApiReview> = await response.json();

        const formatted: CommentItemProps[] = data.content.map(item => ({
          id: item.id,
          postImage: item.review.image,
          postTitle: item.post.title,
          comment: item.review.content,
          createdAt: item.review.createdAt,
        }));

        setComments(formatted);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : '에러가 발생했습니다.');
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
    fetchComments(currentPage);
  }, [currentPage, fetchComments]);

  // 정렬이 변경될 때 첫 페이지로 리셋
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [sort]);

  return (
    <ProfileMainLayout title="내 댓글" showBackButton>
      <div className="bg-white px-2 pb-[160px]">
        <div className="pt-4 pb-2">
          <SortTabs sort={sort} onChange={handleSortChange} />
        </div>
        <div className="px-2">
          {error && <div className="py-2 text-center text-red-500">{error}</div>}
          {loading ? (
            <div className="py-10 text-center text-gray-400">불러오는 중...</div>
          ) : comments.length > 0 ? (
            <>
              <CommentList comments={comments} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="py-10 text-center text-gray-400">
              작성한 댓글이 없습니다.
              <br />
              댓글을 남겨보세요.
            </div>
          )}
        </div>
      </div>
    </ProfileMainLayout>
  );
};

export default CommentsPage;
