import { authOptions } from '@/services/auth/authOptions';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') ?? '0';
  const size = searchParams.get('size') ?? '10';
  const category = searchParams.get('category') ?? 'CAFE';
  const sort = searchParams.get('sort') ?? 'createdAt';

  const BACKEND = process.env.BACKEND_URL;
  if (!BACKEND) {
    return NextResponse.json(
      { message: 'BACKEND_URL env is missing' },
      { status: 500 },
    );
  }

  const url = `${BACKEND}/api/v1/home/category/${category}?page=${page}&size=${size}&sort=${sort}`;
  console.log('[GET] /api/v1/home/category →', url);

  const res = await axios.get(url, {
    headers: {
      ...(session && { Authorization: `Bearer ${session.accessToken}` }),
      'Content-Type': 'application/json',
    },
  });

  const nextPage =
    +page + 1 < +res.data.data.totalPages ? +page + 1 : undefined;

  return NextResponse.json({ ...res.data.data, nextPage });
}
