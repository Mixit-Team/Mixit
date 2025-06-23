import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth/authOptions';
import { NextRequest } from 'next/server';

interface SignupErrorResponse {
  status: {
    code: string;
    message: string;
  };
  data: {
    [key: string]: string;
  };
}

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      loginId,
      password,
      name,
      birth,
      email,
      nickname,
      imageId,
      terms,
      emailNotify,
      smsNotify,
    } = body;

    const BACKEND = process.env.BACKEND_URL!;
    const url = `${BACKEND}/api/v1/accounts`;

    const res = await axios.post(url, {
      loginId,
      password,
      name,
      birth,
      email,
      nickname,
      imageId,
      terms,
      emailNotify,
      smsNotify,
    });

    console.log('POST /api/v1/accounts response:', res.data);

    return NextResponse.json({ success: true, data: res.data.data });
  } catch (error) {
    console.error('Signup error:', error instanceof AxiosError ? error.response?.data : error);

    if (error instanceof AxiosError && error.response?.data) {
      const errorData = error.response.data as SignupErrorResponse;
      const field = errorData.data ? Object.keys(errorData.data)[0] : null;

      return NextResponse.json(
        {
          success: false,
          status: parseInt(errorData.status.code),
          message: field
            ? errorData.data[field]
            : errorData.status.message || '알 수 없는 오류가 발생했습니다.',
          field,
        },
        { status: parseInt(errorData.status.code) }
      );
    }

    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: '네트워크 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
