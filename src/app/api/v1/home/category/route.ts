import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '0';
  const size = searchParams.get('size') || '10';
  const category = searchParams.get('category') || 'all';

  const BACKEND = process.env.BACKEND_URL!;
  const url = `${BACKEND}/api/v1/home/category/${category}?page=${page}&size=${size}`;
  console.log('GET /api/v1/home/category url:', url);
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${process.env.AUTH_HEADER}`,
      'Content-Type': 'application/json',
    },
  });

  console.log('GET /api/v1/home/category response:', res.data);

  const content = res?.data?.data?.content || [];

  return NextResponse.json({ content });
}
