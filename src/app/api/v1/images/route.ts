import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import NodeFormData from 'form-data';
import { Buffer } from 'node:buffer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth/authOptions';

export const runtime = 'nodejs';
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  const formData = await request.formData();
  const image = formData.get('image') as File | null;

  if (!image) {
    return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
  }
  if (!['image/png', 'image/jpeg'].includes(image.type)) {
    return NextResponse.json({ error: 'PNG 또는 JPEG만 가능합니다.' }, { status: 415 });
  }

  const buffer = Buffer.from(await image.arrayBuffer());

  const outForm = new NodeFormData();
  outForm.append('image', buffer, { filename: image.name, contentType: image.type });

  const BACKEND = process.env.BACKEND_URL!;
  const headers: Record<string, string> = {
    ...outForm.getHeaders(),
  };

  // 세션이 있는 경우에만 Authorization 헤더 추가
  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  const { data, status } = await axios.post(`${BACKEND}/api/v1/images`, outForm, {
    headers,
    maxBodyLength: Infinity,
  });

  if (status !== 200) {
    return NextResponse.json({ error: '백엔드 업로드 실패' }, { status });
  }

  return NextResponse.json({ id: data.data.id, url: data.data.url });
}
