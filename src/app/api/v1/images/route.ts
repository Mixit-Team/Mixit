import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import NodeFormData from 'form-data';
import { Buffer } from 'node:buffer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth/authOptions';

export const runtime = 'nodejs';   // Node 런타임 유지

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  const formData = await request.formData();
  const image = formData.get('image') as File | null;

  if (!image) {
    return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
  }
  if (!['image/png', 'image/jpeg'].includes(image.type)) {
    return NextResponse.json({ error: 'PNG 또는 JPEG만 가능합니다.' }, { status: 415 });
  }

  // 2) File → Buffer
  const buffer = Buffer.from(await image.arrayBuffer());

  // 3) 백엔드로 프록시 업로드
  const outForm = new NodeFormData();
  outForm.append('image', buffer, { filename: image.name, contentType: image.type });

  const BACKEND = process.env.BACKEND_URL!;
  const { data, status } = await axios.post(
    `${BACKEND}/api/v1/images`,
    outForm,
    {
      headers: {
        ...outForm.getHeaders(),
        Authorization: `Bearer ${session?.accessToken}`,
      },
      maxBodyLength: Infinity,
    },
  );

  if (status !== 200) {
    return NextResponse.json({ error: '백엔드 업로드 실패' }, { status });
  }

  return NextResponse.json({ id: data.data.id, url: data.data.url });
}
