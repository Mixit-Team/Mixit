import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로그인 | 내 Next.js 앱',
  description: '계정에 로그인하세요',
};

export default function LoginPage() {
  return (
    <main className="p-4">
      <h1 className="mb-4 text-2xl font-bold">로그인 페이지</h1>
      <form className="mx-auto max-w-md">
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block">
            이메일
          </label>
          <input
            type="email"
            id="email"
            className="w-full rounded border p-2"
            placeholder="이메일을 입력하세요"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            className="w-full rounded border p-2"
            placeholder="비밀번호를 입력하세요"
          />
        </div>
        <button type="submit" className="w-full rounded bg-blue-500 p-2 text-white">
          로그인
        </button>
      </form>
    </main>
  );
}
