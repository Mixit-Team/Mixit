'use client';

import React from 'react';
import { useNotifications } from '@/hooks/useNotificationsSSE';
import dayjs from 'dayjs';
import Title from '@/components/atoms/Title';
import BackButton from '@/components/atoms/BackButton';
import axios from 'axios';
import Footer from '../organisms/Footer';
import { withAuth } from '../withAuth';

interface Notification {
  id: number;
  message: string;
  createdAt: string;
  read?: boolean;
}

const NotificationTemplate = () => {
  const { notifications, error } = useNotifications();
  if (error) {
    return (
      <div className="p-4 text-red-500">
        알림을 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  // 날짜별 그룹핑
  const today = dayjs();
  const yesterday = today.subtract(1, 'day');
  const groups: Record<string, Notification[]> = { 오늘: [], 어제: [], 지난: [] };

  notifications?.forEach((n) => {
    const created = dayjs(n.createdAt);
    if (created.isSame(today, 'day')) groups['오늘'].push(n);
    else if (created.isSame(yesterday, 'day')) groups['어제'].push(n);
    else groups['지난'].push(n);
  });
  const sectionOrder: Array<keyof typeof groups> = ['오늘', '어제', '지난'];

  return (
    <div className="relative mx-auto flex h-screen w-full max-w-[767px] flex-col bg-white">

      <div
        className="
          fixed top-0 left-1/2 transform -translate-x-1/2
          z-20 w-full max-w-[767px]
          bg-white py-8
          shadow-[0_4px_3px_-3px_rgba(0,0,0,0.1)]
        "
      >
        <div className="relative flex w-full items-center justify-center">
          <BackButton className="absolute top-1/2 left-2.5 -translate-y-1/2" />
          <Title label="알림" />
        </div>
      </div>

      <div className="flex-1 overflow-auto pt-[80px] pb-[80px]">
        <div className="relative box-border w-full rounded-lg bg-white p-5 p-y space-y-6">
          {sectionOrder.map((section) => {
            const list = groups[section];
            if (!list.length) return null;
            return (
              <section key={section}>
                <h2 className="text-lg font-medium mb-2">{section}</h2>
                <ul className="space-y-2">
                  {list.map((n) => (
                    <li
                      key={n.id}
                      onClick={async () => {
                        try {
                          await axios.patch('/api/notifications/read', { id: n.id });
                        } catch (e) {
                          console.error('읽음 처리 실패', e);
                        }
                      }}
                      className={`
                        cursor-pointer flex items-start gap-3 p-3
                        rounded-lg shadow-sm transition-colors
                        ${n.read
                          ? 'bg-white hover:bg-gray-50'
                          : 'bg-blue-50 hover:bg-blue-100'}
                      `}
                    >
                      {!n.read && (
                        <span className="flex-shrink-0 mt-2 h-2 w-2 rounded-full bg-atomic-orange-80" />
                      )}
                      <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0" />
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
      </div>

      <div
        className="
          fixed bottom-0 left-1/2 transform -translate-x-1/2
          z-10 w-full max-w-[767px]
        "
      >
        <Footer />
      </div>
    </div>
  );
}

export default withAuth(NotificationTemplate);