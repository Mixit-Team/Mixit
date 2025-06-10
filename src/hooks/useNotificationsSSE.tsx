// src/hooks/useNotificationsSSE.ts
'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export interface Notification {
  id: number;
  message: string;
  createdAt: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const esRef = useRef<EventSource>();

  // 1) 과거 알림 목록 조회 (axios 사용)
  useEffect(() => {
    axios
      .get<{ notifications: Notification[] }>('/api/notifications')
      .then((res) => {
        console.log('과거 알림 목록 조회 성공', res.data.notifications);
        setNotifications(res.data.notifications);
      })
      .catch((err) => {
        console.error('알림 목록 조회 실패', err);
        setError(err);
      });
  }, []);

  // 2) 실시간 구독 (SSE)
  useEffect(() => {
    if (esRef.current) return;

    const es = new EventSource('/api/notifications/subscribe');
    esRef.current = es;

    es.onmessage = (evt) => {
      try {
        const n: Notification = JSON.parse(evt.data);
        setNotifications((prev) => [n, ...prev]);
      } catch {
        console.error('SSE JSON 파싱 오류', evt.data);
      }
    };

    es.onerror = (evt) => {
      console.error('SSE 연결 오류', evt);
      setError(new Error('SSE connection failed'));
      es.close();
      esRef.current = undefined;
    };

    return () => {
      es.close();
      esRef.current = undefined;
    };
  }, []);

  return { notifications, error };
}
