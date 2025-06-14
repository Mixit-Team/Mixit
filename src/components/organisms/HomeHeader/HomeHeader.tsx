'use client';
import NotificationBell from '@/components/atoms/Notification/Notification';
import { useSession } from 'next-auth/react';

const HomeHeader = () => {
  const { status } = useSession();
  return (
    <div className="flex items-center p-4">
      <div className="pt-1 text-4xl font-bold">
        <span className="text-black">mix</span>
        <span className="text-orange-500">i</span>
        <span className="text-pink-500">t</span>
      </div>
      {status === 'authenticated' && 
      <div className="ml-auto cursor-pointer">
        <NotificationBell />

      </div>
      }
    </div>
  );
};

export default HomeHeader;
