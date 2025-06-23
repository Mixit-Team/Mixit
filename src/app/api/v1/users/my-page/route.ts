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
    const {
      nickname,
      imageId,
      emailNotify,
      smsNotify,
      postLikeAlarm,
      postReviewAlarm,
      popularPostAlarm,
    } = body;

    if (!nickname) {
      return NextResponse.json({ error: '닉네임을 입력해주세요.' }, { status: 400 });
    }

    const BACKEND = process.env.BACKEND_URL!;
    const response = await axios.put(
      `${BACKEND}/api/v1/users/my-page`,
      {
        nickname,
        imageId: imageId ? Number(imageId) : null,
        emailNotify,
        smsNotify,
        postLikeAlarm,
        postReviewAlarm,
        popularPostAlarm,
      },
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Profile update error:', error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error || '프로필 수정에 실패했습니다.' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: '프로필 수정 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
