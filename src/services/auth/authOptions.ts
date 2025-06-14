import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { login } from '@/services/auth/login';

declare module 'next-auth' {
  interface User {
    accessToken?: string;
    expiresIn?: number;
    nickname?: string;
    emailNotify?: boolean;
    smsNotify?: boolean;
    postLikeAlarm?: boolean;
    postReviewAlarm?: boolean;
    popularPostAlarm?: boolean;
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
        emailNotify: { label: 'Email Notify', type: 'boolean' },
        smsNotify: { label: 'Sms Notify', type: 'boolean' },
        postLikeAlarm: { label: 'Post Like Alarm', type: 'boolean' },
        postReviewAlarm: { label: 'Post Review Alarm', type: 'boolean' },
        popularPostAlarm: { label: 'Popular Post Alarm', type: 'boolean' },
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
            emailNotify: response.emailNotify,
            smsNotify: response.smsNotify,
            postLikeAlarm: response.postLikeAlarm,
            postReviewAlarm: response.postReviewAlarm,
            popularPostAlarm: response.popularPostAlarm,
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
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // 로그인 시
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
          birth: user.birth,
          accessToken: user.accessToken,
          expiresIn: user.expiresIn,
          nickname: user.nickname,
          emailNotify: user.emailNotify,
          smsNotify: user.smsNotify,
          image: user.image,
          postLikeAlarm: user.postLikeAlarm,
          postReviewAlarm: user.postReviewAlarm,
          popularPostAlarm: user.popularPostAlarm,
        };
      }

      // 세션 업데이트 시
      if (trigger === 'update' && session?.user) {
        return {
          ...token,
          nickname: session.user.nickname,
          emailNotify: session.user.emailNotify,
          smsNotify: session.user.smsNotify,
          image: session.user.image,
          postLikeAlarm: session.user.postLikeAlarm,
          postReviewAlarm: session.user.postReviewAlarm,
          popularPostAlarm: session.user.popularPostAlarm,
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
          emailNotify: token.emailNotify as boolean,
          smsNotify: token.smsNotify as boolean,
          postLikeAlarm: token.postLikeAlarm as boolean,
          postReviewAlarm: token.postReviewAlarm as boolean,
          popularPostAlarm: token.popularPostAlarm as boolean,
          image: token.image as string,
        },
      };
    },
  },
  cookies: {
    sessionToken: {
      name: COOKIE_NAME,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NEXT_PUBLIC_DOMAIN,
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
