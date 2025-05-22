'use client';

import { ReactNode, ComponentType, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type WithAuthProps = {
  children?: ReactNode;
};

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  return function ProtectedComponent(props: P) {
    const { status } = useSession();
    const router = useRouter();

    // 세션 없으면 login 페이지로 이동
    useEffect(() => {
      if (status === 'unauthenticated') {
        router.replace('/login');
      }
    }, [status, router]);

    // 로딩 중이거나 인증 안 된 상태면 아무것도 안 렌더
    if (status !== 'authenticated') {
      return null;
    }

    // 인증된 경우에만 실제 페이지 렌더
    return <WrappedComponent {...props} />;
  };
}
