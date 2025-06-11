import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth/authOptions';
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function DELETE() {
  const session = await getServerSession(authOptions);

  const BACKEND = process.env.BACKEND_URL!;
  const url = `${BACKEND}/api/v1/accounts`;

  const response = await axios.delete(url, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  console.log('DELETE /api/v1/accounts response:', response);

  return NextResponse.json({ success: true });
}
