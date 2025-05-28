import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth/authOptions';

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  // 1) Web FormData 파싱
  const formData = await req.formData();
  const file = formData.get('image');

  // 2) 업로드된 파일 검증
  if (!(file instanceof File)) {
    return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
  }
  const mime = file.type;
  if (!['image/png', 'image/jpeg'].includes(mime)) {
    return NextResponse.json({ error: 'PNG 또는 JPEG만 가능합니다.' }, { status: 415 });
  }

  // 3) Node용 FormData 생성
  const proxyForm = new FormData();
  // 파일 데이터를 버퍼로 변환해 추가
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  proxyForm.append('image', buffer, {
    filename: file.name,
    contentType: mime,
  });

  // 4) 백엔드로 axios 요청
  const BACKEND = process.env.BACKEND_URL!;
  const url = `${BACKEND}/api/v1/images`;

  const backendRes = await axios.post(url, proxyForm, {
    headers: {
      ...proxyForm.getHeaders(),
        Authorization: `Bearer ${session?.accessToken}`,
    },
    maxBodyLength: Infinity,
  });

  console.log('backendRes', backendRes.data);

  // 5) 응답 처리
  if (backendRes.status !== 200) {
    return NextResponse.json({ error: '백엔드 업로드 실패' }, { status: backendRes.status });
  }

  const { data } = backendRes.data;
  console.log('POST /api/v1/images response:', data);
  return NextResponse.json({ id: data.id, url: data.url });
}
