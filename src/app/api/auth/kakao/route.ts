import { NextResponse } from 'next/server';

export async function GET() {
  // 백엔드의 카카오 로그인 URL로 리다이렉트
  return NextResponse.redirect('http://54.180.33.96:8080/api/v1/auth/kakao');
}
