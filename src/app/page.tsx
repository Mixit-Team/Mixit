import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '홈 | Mixit',
  description: '환영합니다! Mixit의 홈페이지입니다.',
};

export default function HomePage() {
  return (
    <main className="p-4">
      <h1 className="mb-4 text-2xl font-bold">홈페이지</h1>
      <p className="mb-4">Next.js App Router를 사용한 홈페이지입니다.</p>
      <div className="flex gap-4">
        <Link href="/login" className="text-blue-500 hover:underline">
          로그인
        </Link>
        <Link href="/mypage " className="text-blue-500 hover:underline">
          마이페이지
        </Link>
        <Link href="/home " className="text-blue-500 hover:underline">
          홈
        </Link>
      </div>
    </main>
  );
}
