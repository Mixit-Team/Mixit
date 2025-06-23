import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth/authOptions';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ message: '비밀번호를 입력해주세요.' }, { status: 400 });
    }

    // TODO: 실제 비밀번호 검증 로직 구현
    // 예시: DB에서 사용자 비밀번호 확인
    const isValid = true; // 실제 구현에서는 DB 검증 필요

    if (!isValid) {
      return NextResponse.json({ message: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: '인증이 완료되었습니다.' }, { status: 200 });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
