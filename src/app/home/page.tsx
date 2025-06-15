import HomeTemplate from '@/components/templates/HomeTemplate';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mixit',
  description: '믹스잇 음식/음료 조합 추천 커뮤니티',
  openGraph: {
    title: 'Mixit',
    description: '믹스잇 음식/음료 조합 추천 커뮤니티',
    url: 'https://mixit.io.kr/home',
  },
};

export default function HomePage() {
  return <HomeTemplate />;
}
