import { authOptions } from '@/services/auth/authOptions';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '20';
    const category = searchParams.get('category') || 'CAFE';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const keyword = searchParams.get('keyword') || '';

  const BACKEND = process.env.BACKEND_URL!;
  const url = `${BACKEND}/api/v1/posts/search?page=${page}&size=${size}&category=${category}&sortBy=${sortBy}&keyword=${encodeURIComponent(keyword)}`;
  console.log('GET api/v1/posts/search; url:', url);
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  console.log('GET api/v1/posts/search`; response:', res.data);


  return NextResponse.json({ ...res.data.data });
}
