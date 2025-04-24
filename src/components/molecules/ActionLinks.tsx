'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { UserCog, MessageSquareText, MessageSquareReply, AlertCircle } from 'lucide-react';
import IconButton from '../atoms/IconButton';

const ROUTES = {
  PROFILE: '/mypage/profile',
  POSTS: '/mypage/posts',
  COMMENTS: '/mypage/comments',
};

const ActionLinks: React.FC = React.memo(() => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState({
    profile: false,
    posts: false,
    comments: false,
  });
  const [error, setError] = useState<string | null>(null);

  const navigateTo = useCallback(
    async (route: string, loadingKey: 'profile' | 'posts' | 'comments') => {
      setError(null);

      setIsLoading(prev => ({ ...prev, [loadingKey]: true }));

      try {
        await new Promise(resolve => setTimeout(resolve, 200));

        router.push(route);
      } catch (err) {
        console.error(`Navigation error to ${route}:`, err);
        setError(`Failed to navigate to ${loadingKey}. Please try again.`);

        // Reset loading state on error
        setIsLoading(prev => ({ ...prev, [loadingKey]: false }));
      }
    },
    [router]
  );

  // Specific handlers for each button
  const handleMemberInfoClick = useCallback(() => {
    navigateTo(ROUTES.PROFILE, 'profile');
  }, [navigateTo]);

  const handleMyPostsClick = useCallback(() => {
    navigateTo(ROUTES.POSTS, 'posts');
  }, [navigateTo]);

  const handleMyCommentsClick = useCallback(() => {
    navigateTo(ROUTES.COMMENTS, 'comments');
  }, [navigateTo]);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {error && (
        <div className="mb-3 flex items-center rounded-md bg-red-50 p-2 text-xs text-red-600">
          <AlertCircle className="mr-1 h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      <div className="grid grid-cols-3 gap-4">
        <IconButton
          icon={UserCog}
          label="회원정보"
          onClick={handleMemberInfoClick}
          disabled={isLoading.profile}
          className={isLoading.profile ? 'opacity-70' : ''}
        />
        <IconButton
          icon={MessageSquareText}
          label="내 게시글"
          onClick={handleMyPostsClick}
          disabled={isLoading.posts}
          className={isLoading.posts ? 'opacity-70' : ''}
        />
        <IconButton
          icon={MessageSquareReply}
          label="내 댓글"
          onClick={handleMyCommentsClick}
          disabled={isLoading.comments}
          className={isLoading.comments ? 'opacity-70' : ''}
        />
      </div>
    </div>
  );
});

ActionLinks.displayName = 'ActionLinks';

export default ActionLinks;
