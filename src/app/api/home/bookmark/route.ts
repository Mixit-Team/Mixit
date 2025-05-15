import { NextRequest, NextResponse } from 'next/server';

const dummyData = [
  {
    id: '1',
    title: 'helasdasdasdasdasdasdlo',
    imageUrl: '/images/default_thumbnail.png',
    category: '카페',
  },
  { id: '2', title: 'hello2', imageUrl: '/images/default_thumbnail.png', category: '카페' },
  { id: '112', title: 'hello', imageUrl: '/images/default_thumbnail.png', category: '카페' },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '3', 10);

  const start = (page - 1) * limit;
  const pageData = dummyData.slice(start, start + limit);
  const nextPage = start + limit < dummyData.length ? page + 1 : undefined;

  return NextResponse.json({ data: pageData, nextPage });
}
