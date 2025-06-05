import { authOptions } from '@/services/auth/authOptions';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    // request.json() 으로 JSON 파싱
    const session = await getServerSession(authOptions)
    const { id, category, title, content, tags, imageIds } = (await request.json()) as {
      id: number;
      category: string;
      title: string;
      content: string;
      tags: string[];
      imageIds: number[] | null;
    };

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

    // 외부 백엔드에 JSON 형태로 다시 PUT
    const response = await axios.put(url, body, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('PUT /api/v1/posts response:', response.data);
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: unknown) {
    console.error('PUT /api/v1/posts error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest) {
  try {
    const { id } = (await request.json()) as { id: number };
    const session = await getServerSession(authOptions)

    const BACKEND = process.env.BACKEND_URL!;
    const url = `${BACKEND}/api/v1/posts/${id}`;

    console.log('DELETE /api/v1/posts request body:', { id });

    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('DELETE /api/v1/posts response:', response.data);
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: unknown) {
    console.error('DELETE /api/v1/posts error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


