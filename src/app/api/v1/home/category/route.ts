import { authOptions } from '@/services/auth/authOptions';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '0';
  const size = searchParams.get('size') || '10';
  const category = searchParams.get('category') || 'CAFE';
  console.log('api/v1/home/category page', page, ' size', size, ' category', category)

  const BACKEND = process.env.BACKEND_URL!;
  const url = `${BACKEND}/api/v1/home/category/${category}?page=${page}&size=${size}`;
  console.log('GET /api/v1/home/category url:', url);
  const res = await axios.get(url, {
    headers: {
        ...(session && { Authorization: `Bearer ${session.accessToken}` }),
      'Content-Type': 'application/json',
    },
  });

  console.log('res api/v1/home/categor' ,res.data.data)

  const nextPage = +page + 1 < +res.data.data.totalPages ? +page + 1 : undefined;

  // console.log('GET /api/v1/home/category response:', res.data.data.content);


  return NextResponse.json({ ...res?.data?.data, nextPage });
}
