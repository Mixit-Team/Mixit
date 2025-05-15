'use client';

import { useApiQuery } from '@/hooks/useApi';
import { Comment } from '@/types/Home.type';
import React from 'react';

interface CommentListProps {
  postId: number;
}

const CommentList: React.FC<CommentListProps> = ({ postId }: CommentListProps) => {
  const { data } = useApiQuery<{ comments: Comment[] }>(
    ['comments', postId],
    `/api/v1/posts/${postId}/reviews`
  );
  console.log('CommentList data:', data);

  if (!data?.comments || data.comments.length === 0) {
    return <p className="text-gray-400">댓글이 없습니다.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {data.comments.map((comment: Comment) => (
        <div key={comment.id} className="flex flex-col rounded-lg bg-gray-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium text-gray-800">{comment.userNickname}</span>
            {comment.createdAt && (
              <span className="text-xs text-gray-500">{comment.createdAt}</span>
            )}
          </div>
          <p className="whitespace-pre-wrap text-gray-700">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
