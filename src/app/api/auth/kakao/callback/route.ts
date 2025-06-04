import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const response = await fetch(
      `http://54.180.33.96:8080/api/v1/auth/kakao/callback?code=${code}`
    );
    const data = await response.json();

    if (data.status.code === '000_000') {
      // 세션 생성 URL로 리다이렉트
      const searchParams = new URLSearchParams({
        id: data.data.loginId,
        password: 'kakao-login',
        name: data.data.name,
        email: data.data.email,
        image: data.data.imageSrc,
        accessToken: data.data.token,
        expiresIn: data.data.expiresIn.toString(),
        nickname: data.data.nickname,
        birth: data.data.birth,
      });

      // NextAuth의 signin 엔드포인트로 리다이렉트
      const signinUrl = new URL('/api/auth/signin/credentialProvider', request.url);
      signinUrl.search = searchParams.toString();

      // 세션 생성 후 홈으로 리다이렉트하도록 callbackUrl 설정
      signinUrl.searchParams.set('callbackUrl', '/home');

      return NextResponse.redirect(signinUrl);
    }

    return NextResponse.redirect(new URL('/login', request.url));
  } catch (error) {
    console.error('Kakao callback error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
