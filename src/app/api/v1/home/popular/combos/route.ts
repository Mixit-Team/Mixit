import { authOptions } from '@/services/auth/authOptions';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const size = searchParams.get('size') || '10';

  const BACKEND = process.env.BACKEND_URL!;
  const url = `${BACKEND}/api/v1/home/popular/combos?page=${page}&size=${size}`;
  console.log('GET /api/v1/home/popular/combos url:', url);
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  console.log('GET /api/v1/home/popular/combos response:', res.data);
  const content = res.data.data.content || [];

  return NextResponse.json({ content });
}
