import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  console.log('POST /api/v1/posts/[id]/bookmark id:', id);
  const BACKEND = process.env.BACKEND_URL!;
  const url = `${BACKEND}/api/v1/posts/${id}/bookmark`;

  const body = {};
  console.log('POST /api/v1/posts request body:', body);
  console.log('POST /api/v1/posts/[id]/bookmark url:', url);

  const response = await axios.post(
    url,
    {},
    {
      headers: {
        Authorization:
          `Bearer ${process.env.AUTH_HEADER}` || request.headers.get('authorization') || '',
      },
    }
  );

  console.log('POST /api/v1/posts response:', response.data);

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log('DELETE /api/v1/posts/[id]/bookmark id:', id);
  const BACKEND = process.env.BACKEND_URL!;
  const url = `${BACKEND}/api/v1/posts/${id}/bookmark`;

  const body = {};
  console.log('DELETE /api/v1/posts request body:', body);
  console.log('DELETE /api/v1/posts/[id]/bookmark url:', url);

  const response = await axios.delete(url, {
    headers: {
      Authorization:
        `Bearer ${process.env.AUTH_HEADER}` || request.headers.get('authorization') || '',
    },
  });

  console.log('DELETE /api/v1/posts response:', response.data);

  return NextResponse.json({ success: true });
}
//     console.log('DELETE /api/v1/posts response:', response.data);
