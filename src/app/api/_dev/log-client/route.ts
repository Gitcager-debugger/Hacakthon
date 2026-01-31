import { NextRequest, NextResponse } from 'next/server';
import { devLog } from '@/lib/dev-logger';

export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ ok: false, reason: 'disabled' }, { status: 403 });
    }

    const body = await request.json();
    devLog(`CLIENT_ERROR ${JSON.stringify(body)}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    devLog(`CLIENT_ERROR_FAIL ${(error as Error)?.message}`);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
