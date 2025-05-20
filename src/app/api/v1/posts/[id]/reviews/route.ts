import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const BACKEND = process.env.BACKEND_URL!;
  const url = `${BACKEND}/api/v1/posts/${id}/reviews`;

  console.log('GET /api/v1/posts/[id]/reviews id:', id);
  console.log('GET /api/v1/posts/[id]/reviews url:', url);
  const res = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.AUTH_HEADER}`,
    },
  });

  console.log('GET /api/v1/posts/[id]/reviews response:', res.data);

  return NextResponse.json({ comments: res.data.data || [] });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { content, images } = await request.json();

  const BACKEND = process.env.BACKEND_URL!;
  const url = `${BACKEND}/api/v1/posts/${id}/reviews`;
  console.log('POST /api/v1/posts/[id]/reviews id:', id);
  console.log('POST /api/v1/posts/[id]/reviews url:', url);
  console.log('POST /api/v1/posts/[id]/reviews content:', content);
  console.log('POST /api/v1/posts/[id]/reviews images:', images);

  const res = await axios.post(
    url,
    { content, images, rate: 1 },
    {
      headers: {
        Authorization: `Bearer ${process.env.AUTH_HEADER}`,
      },
    }
  );

  console.log('POST /api/v1/posts/[id]/reviews response:', res.data);

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { reviewId } = await request.json();

  const BACKEND = process.env.BACKEND_URL!;
  const url = `${BACKEND}/api/v1/posts/${id}/reviews/${reviewId}`;

  const res = await axios.delete(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.AUTH_HEADER}`,
    },
  });

  return NextResponse.json({ data: res.data.data || [] });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { reviewId, content } = await request.json();

  const BACKEND = process.env.BACKEND_URL!;
  const url = `${BACKEND}/api/v1/posts/${id}/reviews/${reviewId}`;
  console.log('Patch /api/v1/posts/[id]/reviews id:', id);
  console.log('Patch /api/v1/posts/[id]/reviews url:', url);
  console.log('Patch /api/v1/posts/[id]/reviews content:', content);

  const res = await axios.put(
    url,
    { content },
    {
      headers: {
        Authorization: `Bearer ${process.env.AUTH_HEADER}`,
      },
    }
  );

  console.log('POST /api/v1/posts/[id]/reviews response:', res.data);

  return NextResponse.json({ success: true });
}
