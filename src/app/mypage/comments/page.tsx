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

const PAGE_SIZE = 10;

const CommentsPage: React.FC = () => {
  const [sort, setSort] = useState<'latest' | 'popular'>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [comments, setComments] = useState<CommentItemProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const fetchComments = useCallback(async (page: number) => {
    try {
      const response = await fetch(`/api/v1/users/my-page/reviews?page=${page}&size=${PAGE_SIZE}`);
      if (!response.ok) {
        throw new Error('댓글 데이터를 불러오지 못했습니다.');
      }
      const data: ReviewApiPage<ApiReview> & { nextPage?: number } = await response.json();
      const formatted: CommentItemProps[] = data.content.map(item => ({
        id: item.id,
        postImage: item.review.image,
        postTitle: item.post.title,
        comment: item.review.content,
        createdAt: item.review.createdAt,
      }));
      return {
        comments: formatted,
        totalPages: data.totalPages,
        hasMore: !!data.nextPage,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : '에러가 발생했습니다.');
      return { comments: [], totalPages: 1, hasMore: false };
    }
  }, []);

  const loadComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { comments: newComments, totalPages } = await fetchComments(currentPage - 1);
    setComments(newComments);
    setTotalPages(totalPages);
    setLoading(false);
  }, [currentPage, fetchComments]);

  useEffect(() => {
    loadComments();
  }, [sort, currentPage, loadComments]);

  const handlePageChange = useCallback((page: number) => setCurrentPage(page), []);
  const handleSortChange = useCallback((s: 'latest' | 'popular') => {
    setSort(s);
    setCurrentPage(1);
  }, []);

  return (
    <ProfileMainLayout title="내 댓글" showBackButton>
      <div className="flex min-h-[80vh] flex-col bg-white p-0">
        <div className="px-4 pt-4 pb-2">
          <SortTabs sort={sort} onChange={handleSortChange} />
        </div>
        <div className="px-2">
          {error && <div className="py-2 text-center text-red-500">{error}</div>}
          {loading ? (
            <div className="py-10 text-center text-gray-400">불러오는 중...</div>
          ) : comments.length > 0 ? (
            <CommentList comments={comments} />
          ) : (
            <div className="py-10 text-center text-gray-400">
              작성한 댓글이 없습니다.
              <br />
              댓글을 남겨보세요.
            </div>
          )}
        </div>
        <div className="py-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </ProfileMainLayout>
  );
};

export default CommentsPage;
