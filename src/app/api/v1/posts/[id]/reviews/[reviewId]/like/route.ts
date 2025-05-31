import { authOptions } from "@/services/auth/authOptions";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions)
  
  console.log('POST /api/v1/posts/[id]/like id:', id);
  const BACKEND = process.env.BACKEND_URL!;
  const url = `${BACKEND}/api/v1/posts/${id}/like`;

  const body = {};
  console.log('POST /api/v1/posts request body:', body);
  console.log('POST /api/v1/posts/[id]/like url:', url);

  const response = await axios.post(
    url,
    {},
    {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );

  console.log('POST /api/v1/posts response:', response.data);

  return NextResponse.json({ success: true });
}