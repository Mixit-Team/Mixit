// src/app/notifications/page.tsx
'use client';

import React from 'react';
import { useNotifications } from '@/hooks/useNotificationsSSE';
import dayjs from 'dayjs';

interface Notification {
  id: number;
  message: string;
  createdAt: string;
}

export default function NotificationsPage() {
  const { notifications, error } = useNotifications();

  if (error) {
    return <div className="p-4 text-red-500">알림을 불러오는 중 오류가 발생했습니다.</div>;
  }

  // 날짜별 그룹핑
  const today = dayjs();
  const yesterday = today.subtract(1, 'day');

  const groups: Record<string, Notification[]> = {
    오늘: [],
    어제: [],
    지난: [],
  };
  console.log('notifications', notifications);

  notifications?.forEach((n) => {
    const created = dayjs(n.createdAt);
    if (created.isSame(today, 'day')) {
      groups['오늘'].push(n);
    } else if (created.isSame(yesterday, 'day')) {
      groups['어제'].push(n);
    } else {
      groups['지난'].push(n);
    }
  });

  const sectionOrder: Array<keyof typeof groups> = ['오늘', '어제', '지난'];

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">알림</h1>

      {sectionOrder.map((section) => {
        const list = groups[section];
        if (list.length === 0) return null;

        return (
          <section key={section}>
            <h2 className="text-lg font-medium mb-2">{section}</h2>
            <ul className="space-y-2">
              {list.map((n) => (
                <li
                  key={n.id}
                  className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{n.message}</p>
                    <time className="text-xs text-gray-400">
                      {dayjs(n.createdAt).format('HH:mm')}
                    </time>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
