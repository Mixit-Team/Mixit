import { NextResponse } from 'next/server';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth/authOptions';

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const BACKEND = process.env.BACKEND_URL!;
    const response = await axios.delete(`${BACKEND}/api/v1/accounts`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Account deletion error:', error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error || '회원 탈퇴에 실패했습니다.' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: '회원 탈퇴 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
