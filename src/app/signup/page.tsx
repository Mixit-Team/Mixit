import { Metadata } from 'next';
import SignupTemplate from '@/components/templates/SignupTemplate';

export const metadata: Metadata = {
  title: '회원가입',
  description: '회원가입 페이지입니다.',
};

export default function SignupPage() {
  return <SignupTemplate />;
}
