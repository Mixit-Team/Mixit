import axios, { AxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

interface DuplicateCheckErrorResponse {
  status: {
    code: string;
    message: string;
  };
  data: {
    [key: string]: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { loginId, nickname, email } = body;

    const BACKEND = process.env.BACKEND_URL!;
    const url = `${BACKEND}/api/v1/accounts/duplicate`;

    const res = await axios.post(url, {
      loginId,
      nickname,
      email,
    });

    console.log('POST /api/v1/accounts/duplicate response:', res.data);

    return NextResponse.json({ success: true, data: res.data.data });
  } catch (error) {
    console.error(
      'Duplicate check error:',
      error instanceof AxiosError ? error.response?.data : error
    );

    if (error instanceof AxiosError && error.response?.data) {
      const errorData = error.response.data as DuplicateCheckErrorResponse;
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
