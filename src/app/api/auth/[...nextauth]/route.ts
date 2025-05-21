import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { login } from '@/services/auth/login';

declare module 'next-auth' {
  interface User {
    accessToken?: string;
    expiresIn?: number;
  }
}

const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_SSO_COOKIE_DOMAIN;
const useSecureCookie = COOKIE_DOMAIN !== 'localhost';
const COOKIE_NAME = process.env.NEXTAUTH_COOKIE_NAME!;

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      id: 'credentialProvider',
      name: 'Credential Login',
      credentials: {
        id: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('credentials2', credentials);
        if (!credentials?.id || !credentials.password) {
          return null;
        }
        const credentialsData = {
          loginId: credentials?.id,
          password: credentials.password,
        };

        console.log('credentials', credentialsData);
        const response = await login(credentialsData);
        console.log('credentials response', response);
        // if (!data.user) return null;
        //
        // return {
        //   id: data.user.id,
        //   name: data.user.name,
        //   email: data.user.email,
        //   role: data.user.role,
        //   key: data.user.key,
        //   provider: "credentials",
        // };

        return {
          id: response.loginId, // NextAuth 필수
          name: response.nickname, // NextAuth가 session.user.name으로 뿌려줌
          email: response.email, // 선택이지만 있으면 편합니다
          image: response.imageSrc, // 선택
          accessToken: response.token, // 내가 추가로 쓸 필드
          expiresIn: response.expiresIn,
          birth: response.birth, // 원하시면 더 추가
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
          accessToken: user.accessToken,
          expiresIn: user.expiresIn,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user!,
          id: token.id as string,
          role: token.role as string,
          provider: token.provider as string,
          key: token.key as string,
        },
      };
    },
  },
  cookies: {
    sessionToken: {
      name: `${useSecureCookie ? `__Secure-` : ''}${COOKIE_NAME}`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        domain: COOKIE_DOMAIN,
        secure: useSecureCookie,
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
