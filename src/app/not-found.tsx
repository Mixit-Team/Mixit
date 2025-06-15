import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="px-4 text-center">
        <h1 className="mb-4 text-9xl font-bold text-gray-800">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-600">Page Not Found</h2>
        <p className="mb-8 text-gray-500">죄송합니다. 요청하신 페이지를 찾을 수 없습니다.</p>
        <Link
          href="/"
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-blue-700"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
