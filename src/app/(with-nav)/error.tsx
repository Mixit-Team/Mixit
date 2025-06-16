'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function GlobalError({ error }: { error: Error; reset: () => void }) {
    const router = useRouter();
    useEffect(() => {
        console.error('Unhandled error in app:', error);
        const clearId =  setTimeout(() => {
            router.push('/home')
        }, 2000)
        return () => {
            clearTimeout(clearId)
        }
  }, [error, router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-red-600">앗, 오류가 발생했어요!</h1>
      <p className="mt-2 text-gray-700">{error.message}</p>
    
    </div>
  );
}
