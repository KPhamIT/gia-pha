import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getApiUrl(): string {
  return (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000').replace(
    /\/$/,
    '',
  );
}

/** Optional manual test — production cron uses GitHub Actions → backend directly. */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET is not configured' }, { status: 500 });
  }

  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await fetch(`${getApiUrl()}/notifications/cron/death-anniversary`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cronSecret}`,
        'Content-Type': 'application/json',
      },
    });

    const body: unknown = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(body, { status: res.status });
    }

    return NextResponse.json(body);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Cron proxy failed';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
