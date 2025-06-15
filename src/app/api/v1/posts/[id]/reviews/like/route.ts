import { authOptions } from "@/services/auth/authOptions";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { reviewId } = await request.json() as { reviewId: string };
  const session = await getServerSession(authOptions)
  

  const BACKEND = process.env.BACKEND_URL!;
  const url = `${BACKEND}/api/v1/posts/${id}/reviews/${reviewId}/like`;
  console.log('POST /api/v1/posts/[id]/reviews/like/ id:', id);
  console.log('POST /api/v1/posts/[id]/reviews/like/ reviewId:', reviewId); 
  console.log('POST /api/v1/posts/[id]/reviews/like/ url:', url);


  const response = await axios.post(
    url,
    {},
    {
      headers: {
        ...(session && { Authorization: `Bearer ${session.accessToken}` }),
      },
    }
  );

  console.log('POST /api/v1/posts response:', response.data);

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { reviewId } = await request.json() as { reviewId: string };
  const session = await getServerSession(authOptions)

  console.log('DELETE /api/v1/posts/[id]/ id:', id);
  const BACKEND = process.env.BACKEND_URL!;
  const url = `${BACKEND}/api/v1/posts/${id}/reviews/${reviewId}/like`;

  const body = {};
  console.log('DELETE /api/v1/posts request body:', body);
  console.log('DELETE /api/v1/posts/[id]/ url:', url);

  const response = await axios.delete(
    url,
    {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );

  console.log('DELETE /api/v1/posts response:', response.data);

  return NextResponse.json({ success: true });
} 