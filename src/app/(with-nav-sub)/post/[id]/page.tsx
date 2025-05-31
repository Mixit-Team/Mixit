import PostTemplate from '@/components/templates/PostTemplate';
import { authOptions } from '@/services/auth/authOptions';
import { getServerSession } from 'next-auth';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions)
  
  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/posts/${id}`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  if (!res.ok) {
    console.error('게시물 로드 실패:', res.statusText, id);
    throw new Error('게시물 로드 실패');
  }
  const { data } = await res.json();

  return <PostTemplate data={data} />;
}
