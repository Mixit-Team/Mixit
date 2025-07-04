'use client';

import React, { useState, useCallback, useEffect } from 'react';
import UserInfoSection from '../molecules/UserInfoSection';
import ActionLinks from '../molecules/ActionLinks';
import Button from '../atoms/Button';
import { toast } from 'react-hot-toast';
import { useSession, signOut } from 'next-auth/react';

const MyPageContent: React.FC = () => {
  const { data: session, status } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState('/home');

  useEffect(() => {
    const isProd = process.env.NODE_ENV === 'production';
    setCallbackUrl(isProd ? 'https://mixit.io.kr/home' : '/home');
  }, []);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);

    try {
      await signOut({
        callbackUrl,
        redirect: true,
      });
      toast.success('로그아웃 되었습니다.', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#333',
          color: '#fff',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('로그아웃 중 오류가 발생했습니다.');
    } finally {
      setIsLoggingOut(false);
    }
  }, [callbackUrl]);

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <div className="flex flex-col space-y-6 p-4">
      <UserInfoSection nickname={session.user.nickname || 'User'} />
      <ActionLinks />
      <Button
        onClick={handleLogout}
        variant="outline"
        fullWidth
        className="cursor-pointer rounded-lg border-black"
        disabled={isLoggingOut}
      >
        {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
      </Button>
    </div>
  );
};

export default MyPageContent;
