import { authOptions } from '@/services/auth/authOptions';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try { 
    const session = await getServerSession(authOptions)
    
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '10';

    const BACKEND = process.env.BACKEND_URL!;
    const url = `${BACKEND}/api/v1/home/popular/combos?page=${page}&size=${size}`;
    console.log('GET /api/v1/home/popular/combos url:', url);
    const res = await axios.get(url, {
      headers: {
        ...(session && { Authorization: `Bearer ${session.accessToken}` }),
        'Content-Type': 'application/json',
      },
    });
    const data = res.data.data;
    const nextPage = +page + 1 < data.totalPages ? +page + 1 : undefined;

    console.log('GET /api/v1/home/populer/combos  response:', res?.data);
    return NextResponse.json({ ...res.data.data, nextPage });
  } catch (error) {
    console.error('GET /api/v1/users/me/bookmarks error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
  }
}