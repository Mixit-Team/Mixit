import { authOptions } from '@/services/auth/authOptions';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const session = await getServerSession(authOptions)
    
    console.log('GET /api/v1/tags/autocomplete request url:', request.url);
    const prefix = searchParams.get('prefix');
    const BACKEND = process.env.BACKEND_URL!;
    const url = `${BACKEND}/api/v1/tags/autocomplete?prefix=${prefix}&limit=4`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    console.log('GET /api/v1/tags/autocomplete request url:', url);
    console.log('GET /api/v1/tags/autocomplete response:', res.data);

    const data = res.data.data || ['아직 태그가 없어요.'];

    return NextResponse.json({ data });
  } catch (err: unknown) {
    console.error('GET /api/v1/tags/autocomplete error!!:', err);

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
