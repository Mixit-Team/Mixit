import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET() {
  const BACKEND = process.env.BACKEND_URL!;
  const url = `${BACKEND}/api/v1/home/tags`;

  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${process.env.AUTH_HEADER}`,
      'Content-Type': 'application/json',
    },
  });

  console.log('GET /api/v1/home/tags response:', res.data);
  const data = res.data.data || [];

  return NextResponse.json({ data });
}
