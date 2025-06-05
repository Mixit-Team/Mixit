import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const birth = searchParams.get('birth');
  const email = searchParams.get('email');

  if (!name || !birth || !email) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  const url = `http://54.180.33.96:8080/api/v1/accounts?name=${encodeURIComponent(name)}&birth=${encodeURIComponent(birth)}&email=${encodeURIComponent(email)}`;

  try {
    const res = await fetch(url, { method: 'GET' });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch user ID' }, { status: 500 });
  }
}
