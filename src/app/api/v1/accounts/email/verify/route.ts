import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: '이메일과 인증 코드가 필요합니다.' },
        { status: 400 }
      );
    }

    const BACKEND = process.env.BACKEND_URL!;
    const url = `${BACKEND}/api/v1/accounts/email/verify`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || '이메일 인증에 실패했습니다.',
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data: data.data });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { success: false, message: '이메일 인증 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
