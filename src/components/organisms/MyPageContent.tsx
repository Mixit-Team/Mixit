'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import UserInfoSection from '../molecules/UserInfoSection';
import ActionLinks from '../molecules/ActionLinks';
import Button from '../atoms/Button';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const MyPageContent: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useUserStore();

  // 인증 상태 확인
  console.log('Auth status:', status);
  console.log('Session:', session);
  console.log('Is authenticated:', status === 'authenticated');

  const handleLogout = useCallback(() => {
    setIsLoggingOut(true);

    // 토큰 관련 데이터 삭제
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiresIn');

    // 프로필 정보 삭제
    logout();

    // 로그아웃 성공 메시지 표시
    toast.success('로그아웃 되었습니다.', {
      duration: 2000,
      position: 'top-center',
      style: {
        background: '#333',
        color: '#fff',
      },
    });

    // 로그인 페이지로 이동
    router.push('/login');
  }, [router, logout]);

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <div className="flex flex-col space-y-6 p-4">
      <UserInfoSection nickname={session.user.name || 'User'} />
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
