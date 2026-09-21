// Omni-input resolver — detects raw text vs generic URL vs YouTube URL.
// Version: 1.0.0 | Client + server safe (no Node APIs).

export type InputKind = 'youtube' | 'url' | 'text';

const YT_PATTERNS = [
  /(?:youtube\.com\/(?:watch\?[^#]*v=|shorts\/|embed\/|live\/|v\/))/i,
  /youtu\.be\//i,
];

export function detectInputKind(raw: string): InputKind {
  const s = raw.trim();
  if (YT_PATTERNS.some((re) => re.test(s))) return 'youtube';
  if (/^https?:\/\/[^\s]+$/i.test(s)) return 'url';
  return 'text';
}

export function extractVideoId(raw: string): string | null {
  const s = raw.trim();
  // youtu.be/<id>
  let m = s.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/);
  if (m) return m[1];
  // youtube.com/watch?v=<id>
  m = s.match(/[?&]v=([A-Za-z0-9_-]{6,})/);
  if (m) return m[1];
  // /shorts/<id> /embed/<id> /live/<id> /v/<id>
  m = s.match(/youtube\.com\/(?:shorts|embed|live|v)\/([A-Za-z0-9_-]{6,})/);
  if (m) return m[1];
  return null;
}

export function extractFirstUrl(raw: string): string | null {
  const m = raw.match(/https?:\/\/[^\s"'<>]+/i);
  return m ? m[0].replace(/[.,;:!?)]+$/, '') : null;
}
