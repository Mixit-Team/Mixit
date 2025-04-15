import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '대시보드 | 내 Next.js 앱',
  description: '대시보드 페이지입니다',
};

export default function DashboardPage() {
  return (
    <main className="p-4">
      <h1 className="mb-4 text-2xl font-bold">대시보드</h1>
      <p className="mb-4">로그인 후 접근할 수 있는 대시보드 페이지입니다.</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded border p-4">
          <h2 className="mb-2 text-xl font-semibold">분석</h2>
          <p>사용자 분석 정보가 여기에 표시됩니다.</p>
        </div>
        <div className="rounded border p-4">
          <h2 className="mb-2 text-xl font-semibold">최근 활동</h2>
          <p>최근 활동 내역이 여기에 표시됩니다.</p>
        </div>
      </div>
    </main>
  );
}
