import PostTemplate from '@/components/templates/PostTemplate';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  console.log('Page params:', id);
  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/posts/${id}`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.AUTH_HEADER}`,
    },
  });
  console.log(`GET /api/v1/posts/${id} response:`, res);

  if (!res.ok) {
    console.error('게시물 로드 실패:', res.statusText, id);
    throw new Error('게시물 로드 실패');
  }
  const { data } = await res.json();

  return <PostTemplate data={data} />;
}
