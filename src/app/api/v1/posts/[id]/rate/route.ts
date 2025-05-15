import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const BACKEND = process.env.BACKEND_URL!;
  const url = `${BACKEND}/api/v1/posts/${id}/rate`;

  const res = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.AUTH_HEADER}`,
    },
  });

  console.log('GET /api/v1/posts/[id]/rate response:', res.data);

  return NextResponse.json({ success: true, rating: res.data.data || 0 });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { rate } = await request.json();

  console.log('POST /api/v1/posts/[id]/rate request body:', { rate });
  const BACKEND = process.env.BACKEND_URL!;
  const url = `${BACKEND}/api/v1/posts/${id}/rate?rate=${rate}`;

  const res = await axios.post(
    url,
    { rate },
    {
      headers: {
        Authorization: `Bearer ${process.env.AUTH_HEADER}`,
      },
    }
  );

  console.log('POST /api/v1/posts/[id]/rate response:', res.data);

  return NextResponse.json({ success: true });
}
