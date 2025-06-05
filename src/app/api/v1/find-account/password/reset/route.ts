import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { loginId, birth, email } = body;
    if (!loginId || !birth || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const res = await fetch('http://54.180.33.96:8080/api/v1/accounts/password/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loginId, birth, email }),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
