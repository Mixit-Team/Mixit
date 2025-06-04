import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { login } from '@/services/auth/login';

declare module 'next-auth' {
  interface User {
    accessToken?: string;
    expiresIn?: number;
    nickname?: string;
  }
}

// const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_SSO_COOKIE_DOMAIN || 'localhost';
// const useSecureCookie = COOKIE_DOMAIN !== 'localhost';
const COOKIE_NAME = process.env.NEXTAUTH_COOKIE_NAME || 'next-auth.session-token';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      id: 'credentialProvider',
      name: 'Credential Login',
      credentials: {
        id: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        email: { label: 'Email', type: 'email' },
        image: { label: 'Image', type: 'text' },
        accessToken: { label: 'Access Token', type: 'text' },
        expiresIn: { label: 'Expires In', type: 'text' },
        nickname: { label: 'Nickname', type: 'text' },
        birth: { label: 'Birth', type: 'text' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.id) {
            throw new Error('아이디를 입력해주세요');
          }

          // 카카오 로그인인 경우
          if (credentials.password === 'kakao-login') {
            return {
              id: credentials.id,
              name: credentials.name || '',
              email: credentials.email || '',
              image: credentials.image || '',
              accessToken: credentials.accessToken || '',
              expiresIn: Number(credentials.expiresIn) || 0,
              nickname: credentials.nickname || '',
              birth: credentials.birth || '',
            };
          }

          // 일반 로그인인 경우
          if (!credentials.password) {
            throw new Error('비밀번호를 입력해주세요');
          }

          const credentialsData = {
            loginId: credentials.id,
            password: credentials.password,
          };

          const response = await login(credentialsData);

          return {
            id: response.loginId,
            name: response.name,
            email: response.email,
            image: response.imageSrc,
            accessToken: response.token,
            expiresIn: response.expiresIn,
            nickname: response.nickname,
            birth: response.birth,
          };
        } catch (error) {
          console.error('Login error:', error);
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error('일치하는 회원정보가 없습니다.');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('jwt user', user);
      if (user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
          birth: user.birth,
          accessToken: user.accessToken,
          expiresIn: user.expiresIn,
          nickname: user.nickname,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        user: {
          ...session.user!,
          id: token.id as string,
          role: token.role as string,
          provider: token.provider as string,
          key: token.key as string,
          birth: token.birth as string,
          name: token.name as string,
          nickname: token.nickname as string,
        },
      };
    },
  },
  cookies: {
    // sessionToken: {
    //   name: `${useSecureCookie ? `__Secure-` : ''}${COOKIE_NAME}`,
    //   options: {
    //     httpOnly: true,
    //     sameSite: 'lax',
    //     path: '/',
    //     domain: COOKIE_DOMAIN,
    //     secure: useSecureCookie,
    //   },
    // }, 기존 코드, session-token이 나오지 않아서 수정
    sessionToken: {
      name: COOKIE_NAME,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false, // 임시 지금현재 도메인없어서
      },
    },
    pkceCodeVerifier: {
      name: 'next-auth.pkce.code_verifier',
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
  },
};
