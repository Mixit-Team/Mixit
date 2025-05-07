'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ProfileMainLayout from '@/components/templates/ProfileMainLayout';
import SortTabs from '@/components/molecules/SortTabs';
import Pagination from '@/components/molecules/Pagination';
import CommentList from '@/components/organisms/CommentList';
import { CommentItemProps } from '@/components/molecules/CommentItem';

const API_URL = '/api/comments'; // 실제 API 엔드포인트로 교체 필요

const MOCK_COMMENTS: CommentItemProps[] = Array.from({ length: 23 }).map((_, i) => ({
  id: String(i),
  postImage: '/default-image.png',
  postTitle: `게시물 제목 ${i + 1}`,
  comment: `내가 쓴 댓글 ${i + 1}`,
  createdAt: new Date(Date.now() - 1000 * 60 * (i + 1)),
}));

const CommentsPage: React.FC = () => {
  const [sort, setSort] = useState<'latest' | 'popular'>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const [comments, setComments] = useState<CommentItemProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 데이터 fetch (최초 1회)
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('댓글 데이터를 불러오지 못했습니다.');
        return res.json();
      })
      .then((data: CommentItemProps[]) => {
        if (!ignore) setComments(data);
      })
      .catch(() => {
        if (!ignore) {
          setComments(MOCK_COMMENTS);
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  // 정렬
  const sorted = useMemo(() => {
    const arr = [...comments];
    return sort === 'latest'
      ? arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      : arr.sort((a, b) => (b.comment?.length || 0) - (a.comment?.length || 0));
  }, [comments, sort]);

  // 페이지네이션
  const totalPages = useMemo(() => Math.ceil(sorted.length / perPage), [sorted.length, perPage]);
  const paged = useMemo(
    () => sorted.slice((currentPage - 1) * perPage, currentPage * perPage),
    [sorted, currentPage, perPage]
  );

  // 핸들러
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
          {/* 에러 메시지는 상단에만 안내 */}
          {error && <div className="py-2 text-center text-red-500">{error}</div>}
          {loading ? (
            <div className="py-10 text-center text-gray-400">불러오는 중...</div>
          ) : comments.length > 0 ? (
            <CommentList comments={paged} />
          ) : (
            <div className="py-10 text-center text-gray-400">댓글이 없습니다.</div>
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
