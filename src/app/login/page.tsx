import { Metadata } from 'next';
import LoginTemplate from '@/components/templates/LoginTemplate';

export const metadata: Metadata = {
  title: '로그인',
  description: '계정에 로그인하세요',
  openGraph: {
    title: '로그인',
    description: '계정에 로그인하세요',
    url: 'https://mixit.io.kr/login',
  },
};

export default function LoginPage() {
  return <LoginTemplate />;
}
