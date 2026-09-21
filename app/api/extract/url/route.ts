import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { extractUrlContent } from '@/lib/server/extract';

const Schema = z.object({ url: z.string().min(5).max(2000) });

// POST /api/extract/url { url } -> { title, text, source, sourceUrl, charCount }
export async function POST(request: NextRequest) {
  let body: z.infer<typeof Schema>;
  try {
    body = Schema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request — expected { url }' }, { status: 400 });
  }
  try {
    const out = await extractUrlContent(body.url.trim());
    return NextResponse.json(out);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'URL extraction failed' }, { status: 502 });
  }
}
