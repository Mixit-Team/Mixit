import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

/** 백엔드가 실제로 내려주는 “한 페이지” 구조 */
export interface BookmarkApiPage<T> {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  content: T[];
  emptyMessage?: string | null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '0';
  const size = searchParams.get('size') || '10';
  const sort = searchParams.get('sort') || 'latest';
  const BACKEND = process.env.BACKEND_URL!;
  const url = `${BACKEND}/api/v1/users/me/bookmarks?page=${page}&size=${size}&sort=${sort}`;
  try {
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.AUTH_HEADER}`,
        'Content-Type': 'application/json',
      },
    });
    const nextPage = +page + 1 < +res.data.data.totalPages ? +page + 1 : undefined;

    return NextResponse.json({ ...res.data.data, nextPage });
  } catch (error) {
    console.error('GET /api/v1/users/me/bookmarks error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
  }
}
