import { authOptions } from '@/services/auth/authOptions';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions)
  
  const BACKEND = process.env.BACKEND_URL!;
  const url = `${BACKEND}/api/v1/home/views`;
  console.log('GET /api/v1/home/views url:', url);
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  console.log('GET /api/v1/home/views  response:', res.data);
  const content = res?.data?.data?.content || [];

  return NextResponse.json({ content });
}
