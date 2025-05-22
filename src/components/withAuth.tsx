'use client';

import {  ComponentType, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  return function ProtectedComponent(props: P) {
    const { data, status } = useSession();
    console.log('withAuth status ', status, ' user',data)
    const router = useRouter();

    useEffect(() => {
      if (status === 'unauthenticated') {
        router.replace('/login');
      }
    }, [status, router]);


    return <WrappedComponent {...props} />;
  };
}
