'use client';
import React from 'react';
import { useNotifications } from '@/hooks/useNotificationsSSE';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
export default function NotificationBell() {
  const { notifications=[], error } = useNotifications();
  const router = useRouter();

  const handleClick = () => {
    // 알림 클릭 시 원하는 페이지로 이동
    router.push('/notifications');
  };

  if (error) {
    return   <Bell className='cursor-pointer' onClick={handleClick}/>
;
  }

  // notifications가 undefined라면 빈 배열로 대체
  const unreadCount = notifications.filter((n) => !n.read).length;



  return (
    <div className="relative">
      <button className="relative">
        <Bell className='cursor-pointer' onClick={handleClick}/>
          <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full text-xs px-1">
            {unreadCount}
          </span>
      </button>

      {/* <ul className="absolute right-0 mt-2 w-64 max-h-80 overflow-auto bg-white shadow-lg rounded-md">
        {list.length === 0 && (
          <li className="p-2 text-gray-500">새 알림이 없습니다.</li>
        )}
        {list.map((n) => (
          <li
            key={n.id}
            className="p-2 border-b last:border-0 hover:bg-gray-100 cursor-pointer"
          >
            <p className="text-sm">{n.message}</p>
            <time className="text-xs text-gray-400">
              {new Date(n.createdAt).toLocaleTimeString()}
            </time>
          </li>
        ))}
      </ul> */}
    </div>
  );
}
