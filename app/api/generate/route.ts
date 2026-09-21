import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { z } from 'zod';
import {
  GoogleGenerativeAI,
  GoogleGenerativeAIResponseError,
} from '@google/generative-ai';
import { buildVoiceConstraints, isValidVoiceDNA } from '@/lib/voice-prompt-builder';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const MODEL_PRIMARY = 'gemini-2.5-flash';
const MODEL_FALLBACK = 'gemini-2.0-flash-exp';

const BodySchema = z.object({
  content: z.string().min(10).max(30000),
  inputType: z.enum(['blog', 'transcript', 'notes']).default('blog'),
  formats: z
    .array(z.enum(['twitter', 'linkedin', 'newsletter', 'instagram', 'reddit', 'threads']))
    .min(1)
    .max(6)
    .default(['twitter', 'linkedin']),
  voiceDna: z.unknown().optional().nullable(),
});

const INPUT_PREPROMPTS: Record<string, string> = {
  blog: `The input below is a BLOG POST. First extract its core thesis + 3 key insights, then repurpose those (don't just rephrase sentences).`,
  transcript: `The input below is a raw TRANSCRIPT (may contain filler words, timestamps, speaker labels). First clean it: remove filler, fix grammar, identify the 3 strongest points. Then repurpose.`,
  notes: `The input below is rough NOTES (fragments, bullets). First expand into a coherent argument, fill obvious gaps conservatively. Then repurpose.`,
};

// Per-format spec: output key, temperature, prompt. Tuned individually.
const FORMAT_SPECS: Record<string, { key: string; temperature: number; prompt: string }> = {
  twitter: {
    key: 'twitterThread',
    temperature: 0.85,
    prompt: `You are an elite ghostwriter specializing in viral Twitter threads.
Write a 4-6 tweet thread that:
- Opens with a HOOK that stops the scroll (question, bold claim, counter-intuitive insight)
- Uses numbered tweets (1/5, 2/5, etc.) or emoji bullets
- Each tweet under 280 chars, punchy, high-signal
- Includes relevant hashtags (2-3 max) on the last tweet
- Ends with a clear CTA (follow, retweet, link)
- Tone: authoritative but conversational, zero fluff
Return ONLY valid JSON: { "twitterThread": ["tweet1", "tweet2", ...] }`,
  },
  linkedin: {
    key: 'linkedinPost',
    temperature: 0.6,
    prompt: `You are an elite ghostwriter specializing in high-engagement LinkedIn posts.
Write a professional LinkedIn post that:
- Opens with a HOOK (1-2 lines max, bold claim, story start, or question)
- Uses line breaks for readability (short paragraphs, max 2 lines each)
- Provides genuine insight/value - not generic advice
- Includes a personal anecdote or concrete example
- Ends with a question to drive comments
- Uses 3-5 relevant hashtags at the bottom
- Tone: professional but human, authoritative but accessible
Return ONLY valid JSON: { "linkedinPost": "full post text" }`,
  },
  newsletter: {
    key: 'newsletter',
    temperature: 0.7,
    prompt: `You are an elite ghostwriter specializing in engaging newsletters.
Write a newsletter draft that:
- Has a compelling subject line (first line, format: "Subject: ...")
- Opens with a hook that makes readers want to continue
- Has 3-5 scannable sections with bold headers
- Each section: 2-4 short paragraphs, actionable insights
- Includes a "Key Takeaways" bulleted summary
- Ends with a clear CTA (reply, click, share)
- Tone: personal, valuable, conversational
Return ONLY valid JSON: { "newsletter": "full newsletter text" }`,
  },
  instagram: {
    key: 'instagramCaption',
    temperature: 0.8,
    prompt: `You are an elite ghostwriter specializing in Instagram captions.
Write an Instagram caption that:
- Opens with a hook in the first 125 chars (before "more")
- Uses line breaks and emoji for visual rhythm
- Tells a story or shares a lesson
- Includes 5-10 relevant hashtags at the end
- Ends with a CTA (comment, save, share, link in bio)
- Tone: authentic, visual, engaging
Return ONLY valid JSON: { "instagramCaption": "full caption text" }`,
  },
  reddit: {
    key: 'redditPost',
    temperature: 0.9,
    prompt: `You are an elite ghostwriter specializing in Reddit posts.
Write a Reddit post that:
- Has a compelling title (first line, format: "Title: ...")
- Opens with context/personal story
- Provides genuine value/insight (not self-promotion)
- Uses formatting (bullet points, bold for emphasis)
- Ends with a question to drive discussion
- Tone: authentic, community-first, zero marketing speak
Return ONLY valid JSON: { "redditPost": { "title": "...", "body": "..." } }`,
  },
  threads: {
    key: 'threadsPost',
    temperature: 0.85,
    prompt: `You are an elite ghostwriter specializing in Threads posts.
Write a Threads post that:
- Opens with a hook (conversational, opinionated, or story)
- 3-5 short, punchy threads connected by narrative
- Each thread: 1-3 sentences, under 500 chars
- Uses line breaks for readability
- Ends with engagement bait (question, poll idea, "thoughts?")
- Tone: casual, authentic, conversational
Return ONLY valid JSON: { "threadsPost": ["thread1", "thread2", ...] }`,
  },
};

// ---------------------------------------------------------------------------
// API key rotation + retry helpers (kept from v1)
// ---------------------------------------------------------------------------

function getApiKeys(): string[] {
  const rawKeys = process.env.GEMINI_API_KEY || '';
  return rawKeys.split(',').map((k) => k.trim()).filter((k) => k.length > 0);
}

let keyRotationIndex = 0;
function getNextKeyIndex(numKeys: number): number {
  const index = keyRotationIndex % numKeys;
  keyRotationIndex = (keyRotationIndex + 1) % numKeys;
  return index;
}

function getDelay(attempt: number): number {
  return Math.min(1000 * Math.pow(2, attempt), 10000);
}
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getErrorStatus(error: unknown): number | undefined {
  if (error instanceof GoogleGenerativeAIResponseError) return error.response?.status;
  if (error && typeof error === 'object' && 'status' in error) {
    return (error as { status: number }).status;
  }
  return undefined;
}
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
function isRetryableError(error: unknown): boolean {
  const status = getErrorStatus(error);
  if (status === 429) return true;
  if (status && status >= 500) return true;
  const msg = getErrorMessage(error).toLowerCase();
  if (msg.includes('timeout')) return true;
  if (msg.includes('network')) return true;
  if (msg.includes('econnrefused')) return true;
  if (msg.includes('econnreset')) return true;
  if (msg.includes('fetch') && !msg.includes('invalid')) return true;
  return false;
}
function isKeyError(error: unknown): boolean {
  const status = getErrorStatus(error);
  if (status === 401 || status === 403) return true;
  const msg = getErrorMessage(error).toLowerCase();
  if (msg.includes('api key') || msg.includes('apikey')) return true;
  if (msg.includes('invalid') && msg.includes('key')) return true;
  if (msg.includes('unauthorized')) return true;
  if (msg.includes('forbidden')) return true;
  if (msg.includes('permission denied')) return true;
  return false;
}

function sanitizeJsonResponse(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```\s*$/, '');
  }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
    if (firstBrace > 0 || lastBrace < cleaned.length - 1) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }
  }
  return cleaned.trim();
}

// ---------------------------------------------------------------------------
// Cache (read + write, sha256 key). In-memory; swap for KV in production.
// ---------------------------------------------------------------------------

const requestCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function cacheKey(content: string, inputType: string, formats: string[], voiceHash: string): string {
  const h = createHash('sha256');
  h.update(`${content}|${inputType}|${[...formats].sort().join(',')}|${voiceHash}`);
  return h.digest('hex');
}
function voiceFingerprint(v: unknown): string {
  if (!v) return 'novoice';
  try {
    const s = JSON.stringify(v);
    return createHash('sha256').update(s).digest('hex').slice(0, 16);
  } catch {
    return 'novoice';
  }
}

// ---------------------------------------------------------------------------
// Simple in-memory rate limit: 30 req / 10 min per IP
// ---------------------------------------------------------------------------

const rateMap = new Map<string, number[]>();
const RATE_MAX = 30;
const RATE_WINDOW_MS = 10 * 60 * 1000;
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (rateMap.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  arr.push(now);
  rateMap.set(ip, arr);
  return arr.length > RATE_MAX;
}

// ---------------------------------------------------------------------------
// Single-format generation with key rotation + model fallback
// ---------------------------------------------------------------------------

async function generateOneFormat(
  apiKeys: string[],
  startIndex: number,
  systemPrompt: string,
  content: string,
  temperature: number,
  maxRetries = 2
): Promise<string> {
  let lastError: unknown = null;
  for (let i = 0; i < apiKeys.length; i++) {
    const apiKey = apiKeys[(startIndex + i) % apiKeys.length];
    for (const modelName of [MODEL_PRIMARY, MODEL_FALLBACK]) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { temperature, topP: 0.9, maxOutputTokens: 4096 },
        });
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            const result = await model.generateContent(systemPrompt + '\n\nContent to repurpose:\n\n' + content);
            const text = (await result.response).text();
            if (!text || text.trim().length === 0) throw new Error('Empty response from Gemini API');
            return text;
          } catch (err) {
            lastError = err;
            if (isKeyError(err)) break; // try next key
            if (!isRetryableError(err) || attempt === maxRetries) break;
            await sleep(getDelay(attempt));
          }
        }
        if (lastError && isKeyError(lastError)) continue; // next key
        if (lastError && !isRetryableError(lastError)) throw lastError;
      } catch (err) {
        lastError = err;
        if (isKeyError(err)) continue; // next key
        // model-level failure: try fallback model, then next key
        continue;
      }
    }
  }
  throw lastError ?? new Error('All API keys failed');
}

// ---------------------------------------------------------------------------
// POST
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const started = Date.now();
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Try again in a few minutes.' }, { status: 429 });
  }

  // --- Validate body ---
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await request.json());
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: e.errors.map((x) => `${x.path.join('.')}: ${x.message}`) },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Invalid request body — expected JSON' }, { status: 400 });
  }
  const { content, inputType, formats } = body;
  let { voiceDna } = body;

  // --- Validate VoiceDNA (accepts canonical + legacy shapes) ---
  let voiceApplied = false;
  let voiceConstraints = '';
  if (voiceDna !== null && voiceDna !== undefined) {
    if (!isValidVoiceDNA(voiceDna)) {
      return NextResponse.json(
        { error: 'Invalid Voice DNA: expected { toneProfile|tone, hooks, pillars }' },
        { status: 400 }
      );
    }
    voiceConstraints = buildVoiceConstraints(voiceDna);
    voiceApplied = voiceConstraints.length > 0;
  } else {
    voiceDna = null;
  }

  const apiKeys = getApiKeys();
  if (apiKeys.length === 0) {
    return NextResponse.json({ error: 'No GEMINI_API_KEY configured' }, { status: 500 });
  }

  // --- Cache read (v1 wrote but never read) ---
  const vh = voiceFingerprint(voiceDna);
  const cKey = cacheKey(content, inputType, formats, vh);
  const cached = requestCache.get(cKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json({ ...(cached.data as object), _meta: { cached: true, voiceApplied } });
  }

  // --- Build per-format prompts ---
  const inputPre = INPUT_PREPROMPTS[inputType] ?? INPUT_PREPROMPTS.blog;
  const jobs = formats.map((f) => {
    const spec = FORMAT_SPECS[f];
    if (!spec) return null;
    const systemPrompt =
      `${spec.prompt}\n\n${inputPre}${voiceConstraints}\n\nReturn ONLY a single valid JSON object with the key "${spec.key}".`;
    return { format: f, spec, systemPrompt };
  }).filter((x): x is NonNullable<typeof x> => x !== null);

  if (jobs.length === 0) {
    return NextResponse.json({ error: 'No valid formats requested' }, { status: 400 });
  }

  const startIndex = apiKeys.length > 1 ? getNextKeyIndex(apiKeys.length) : 0;

  // --- Parallel generation, partial success tolerated ---
  const settled = await Promise.allSettled(
    jobs.map(async (job) => {
      const raw = await generateOneFormat(apiKeys, startIndex, job.systemPrompt, content, job.spec.temperature);
      const parsed = JSON.parse(sanitizeJsonResponse(raw)) as Record<string, unknown>;
      if (!(job.spec.key in parsed)) {
        throw new Error(`AI response missing expected field: ${job.spec.key}`);
      }
      return { key: job.spec.key, value: parsed[job.spec.key], format: job.format };
    })
  );

  const result: Record<string, unknown> = {};
  const failed: Array<{ format: string; error: string }> = [];
  for (const s of settled) {
    if (s.status === 'fulfilled') result[s.value.key] = s.value.value;
    else failed.push({ format: 'unknown', error: getErrorMessage(s.reason).slice(0, 300) });
  }

  if (Object.keys(result).length === 0) {
    const firstErr = failed[0]?.error ?? 'generation failed';
    const keyRelated = /api key|unauthorized|forbidden|permission/i.test(firstErr);
    return NextResponse.json(
      {
        error: keyRelated
          ? 'All API keys are invalid or expired. Check GEMINI_API_KEY.'
          : 'AI generation failed for all requested formats.',
        details: firstErr,
      },
      { status: 502 }
    );
  }

  requestCache.set(cKey, { data: result, timestamp: Date.now() });

  return NextResponse.json({
    ...result,
    _meta: {
      cached: false,
      voiceApplied,
      inputType,
      latencyMs: Date.now() - started,
      succeeded: Object.keys(result),
      failed: failed.length ? failed : undefined,
      model: MODEL_PRIMARY,
    },
  });
}
