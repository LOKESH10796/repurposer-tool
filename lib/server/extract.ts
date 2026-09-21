// Server-side extraction: Jina Reader (generic URL) + YouTube transcripts.
// Version: 1.0.0 | Server only (uses fetch + youtube-transcript).

import { YoutubeTranscript } from 'youtube-transcript';

export interface ExtractedContent {
  title: string;
  text: string;
  source: 'youtube' | 'url';
  sourceUrl: string;
  charCount: number;
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function titleFromHtml(html: string): string {
  const og = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
  if (og) return og[1];
  const t = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return t ? t[1].trim() : '';
}

// --- Generic URL via Jina Reader, with direct-fetch fallback ---
export async function extractUrlContent(url: string): Promise<ExtractedContent> {
  let validated: URL;
  try {
    validated = new URL(url);
    if (!['http:', 'https:'].includes(validated.protocol)) throw new Error('bad protocol');
  } catch {
    throw new Error('Invalid URL');
  }
  const target = validated.toString();

  // 1) Jina Reader (LLM-friendly markdown). Key optional but raises limits.
  try {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (process.env.JINA_API_KEY) headers.Authorization = `Bearer ${process.env.JINA_API_KEY}`;
    const r = await fetch(`https://r.jina.ai/${target}`, {
      headers,
      signal: AbortSignal.timeout(25000),
    });
    if (r.ok) {
      const ct = r.headers.get('content-type') ?? '';
      if (ct.includes('application/json')) {
        const j = (await r.json()) as { data?: { content?: string; title?: string; url?: string } };
        const text = (j?.data?.content ?? '').trim();
        if (text.length >= 200) {
          return {
            title: j?.data?.title ?? target,
            text,
            source: 'url',
            sourceUrl: j?.data?.url ?? target,
            charCount: text.length,
          };
        }
      } else {
        const text = (await r.text()).trim();
        if (text.length >= 200) {
          return { title: target, text, source: 'url', sourceUrl: target, charCount: text.length };
        }
      }
    }
  } catch {
    // fall through to direct fetch
  }

  // 2) Direct fetch + tag strip (works for simple blogs, no JS rendering)
  const r = await fetch(target, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RepurposerBot/1.0)' },
    signal: AbortSignal.timeout(20000),
  });
  if (!r.ok) throw new Error(`Fetch failed (${r.status}). The page may block bots — paste the text instead.`);
  const html = await r.text();
  const text = stripHtml(html);
  if (text.length < 200) throw new Error('Could not extract readable content. The page may be JS-rendered — paste the text instead.');
  return { title: titleFromHtml(html) || target, text: text.slice(0, 25000), source: 'url', sourceUrl: target, charCount: text.length };
}

// --- YouTube transcripts ---
export async function extractYoutubeContent(videoId: string, sourceUrl: string): Promise<ExtractedContent> {
  if (!/^[A-Za-z0-9_-]{6,}$/.test(videoId)) throw new Error('Invalid YouTube video ID');
  let items: Array<{ text: string }>;
  try {
    items = await YoutubeTranscript.fetchTranscript(videoId);
  } catch {
    throw new Error('No captions available for this video. Try a video with subtitles, or paste the content as text.');
  }
  const text = items
    .map((i) => (i.text ?? '').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length < 50) throw new Error('Transcript is empty. Try another video.');
  return {
    title: `YouTube ${videoId}`,
    text: text.slice(0, 25000),
    source: 'youtube',
    sourceUrl,
    charCount: text.length,
  };
}
