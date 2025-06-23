import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth/authOptions';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const body = await request.json();
    const { oldPwd, newPwd } = body;

    if (!oldPwd || !newPwd) {
      return NextResponse.json({ error: '비밀번호를 입력해주세요.' }, { status: 400 });
    }

    const BACKEND = process.env.BACKEND_URL!;
    const response = await axios.put(
      `${BACKEND}/api/v1/accounts/password`,
      { oldPwd, newPwd },
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Password change error:', error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error || '비밀번호 변경에 실패했습니다.' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: '비밀번호 변경 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
