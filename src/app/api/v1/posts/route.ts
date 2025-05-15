import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || '';
  const type = searchParams.get('type') || 'popular';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '3', 10);
  const sortBy = searchParams.get('sortBy') || 'createdAt'; // createdAt, updatedAt, viewCount, likeCount
  const sortDir = searchParams.get('sortDir') || 'desc';
  const BACKEND = process.env.BACKEND_URL!;
  const url = `${BACKEND}/api/v1/posts?category=${category}&type=${type}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortDir=${sortDir}`;
  const res = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.AUTH_HEADER}`,
    },
  });

  const data = res.data.data;

  return NextResponse.json({ data, page, limit });
}

export async function POST(request: NextRequest) {
  try {
    const {
      category,
      title,
      content,
      tags,
      imageIds = [],
    } = (await request.json()) as {
      category: string;
      title: string;
      content: string;
      tags: string[];
      imageIds: number[];
    };

    // 2) 외부 백엔드 URL 구성
    const BACKEND = process.env.BACKEND_URL!;
    const url = `${BACKEND}/api/v1/posts`;

    const body = {
      category,
      title,
      content,
      tags,
      imageIds,
    };
    console.log('POST /api/v1/posts request body:', body);

    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.AUTH_HEADER}`,
      },
    });

    console.log('POST /api/v1/posts response:', response.data, response);

    return NextResponse.json(response.data, { status: response.status });
  } catch (err: unknown) {
    console.error('POST /api/v1/posts error!!:', err);

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
