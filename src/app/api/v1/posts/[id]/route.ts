import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const { id, category, title, content, tags, imageIds } = (await request.json()) as {
      id: number;
      category: string;
      title: string;
      content: string;
      tags: string[];
      imageIds: number[] | null;
    };

    // 2) 외부 백엔드 URL 구성
    const BACKEND = process.env.BACKEND_URL!;
    const url = `${BACKEND}/api/v1/posts/${id}`;

    const body = {
      category,
      title,
      content,
      tags,
      imageIds,
    };

    console.log('PUT /api/v1/posts request body:', body);

    const response = await axios.put(url, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('PUT /api/v1/posts response:', response.data);

    // 4) 외부 응답을 그대로 클라이언트에 반환
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: unknown) {
    console.error('PUT /api/v1/posts error:', err);

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
