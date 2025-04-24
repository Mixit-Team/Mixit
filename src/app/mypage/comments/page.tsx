'use client';

import React from 'react';
import ProfileMainLayout from '@/components/templates/ProfileMainLayout';

const CommentsPage: React.FC = () => {
  return (
    <ProfileMainLayout title="내 댓글" showBackButton>
      <div className="p-4">
        <h1 className="text-xl font-semibold">내 댓글</h1>
        <p className="mt-4 text-gray-600">댓글 목록이 이곳에 표시됩니다.</p>
      </div>
    </ProfileMainLayout>
  );
};

export default CommentsPage;
