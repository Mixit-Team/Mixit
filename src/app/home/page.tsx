import HomeTemplate from '@/components/templates/HomeTemplate';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '홈',
  description: '홈 페이지입니다',
};

export default function HomePage() {
  return <HomeTemplate />;
}
