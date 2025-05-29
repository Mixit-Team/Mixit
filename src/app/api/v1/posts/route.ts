import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth/authOptions';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // 1) formData 로 파싱
    const form = await request.formData();

    // 2) 필요한 값 꺼내기
    const category = form.get('category')?.toString() || '';
    const title = form.get('title')?.toString() || '';
    const content = form.get('content')?.toString() || '';

    // tag는 여러 개 append 했으니 getAll
    const tags = form.getAll('tags').map(t => t.toString());

    // imageIds 도 숫자 배열로
    const imageIds = form
      .getAll('imageIds')
      .map(i => parseInt(i.toString(), 10))
      .filter(n => !Number.isNaN(n));

    // 3) 외부 백엔드로 전달할 body 구성
    const body = { category, title, content, tags, imageIds };

    const BACKEND = process.env.BACKEND_URL!;
    const url = `${BACKEND}/api/v1/posts`;

    // 4) axios 로 JSON 전송
    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (err) {
    console.error('POST /api/v1/posts error!!:', err);
    if (axios.isAxiosError(err) && err.response?.status === 400) {
      return NextResponse.json({ error: '욕설' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
