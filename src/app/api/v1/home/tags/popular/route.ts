import { authOptions } from '@/services/auth/authOptions';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions)

  const BACKEND = process.env.BACKEND_URL!;
  const url = `${BACKEND}/api/v1/tags/popular`;

  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  console.log('GET api/v1/tags/popular response:', res.data);
  const data = res.data.data || [];

  return NextResponse.json({ data });
}
