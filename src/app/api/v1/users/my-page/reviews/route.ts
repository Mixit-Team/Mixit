import { authOptions } from '@/services/auth/authOptions';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export interface ReviewApiPage<T> {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  content: T[];
  emptyMessage?: string | null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const session = await getServerSession(authOptions);

  const page = searchParams.get('page') || '0';
  const size = searchParams.get('size') || '10';
  const BACKEND = process.env.BACKEND_URL!;
  const url = `${BACKEND}/api/v1/users/my-page/reviews?page=${page}&size=${size}`;

  try {
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    const nextPage = +page + 1 < +res.data.data.totalPages ? +page + 1 : undefined;

    return NextResponse.json({ ...res.data.data, nextPage });
  } catch (error) {
    console.error('GET /api/v1/users/my-page/reviews error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
