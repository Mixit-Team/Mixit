import { Metadata } from 'next';
import SignupTemplate from '@/components/templates/SignupTemplate';

export const metadata: Metadata = {
  title: '회원가입',
  description: '회원가입 페이지입니다.',
  openGraph: {
    title: '회원가입',
    description: '회원가입 페이지입니다.',
    url: 'https://mixit.io.kr/signup',
  },
};

export default function SignupPage() {
  return <SignupTemplate />;
}
