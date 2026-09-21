import { NextRequest } from 'next/server';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildVoiceConstraints } from '@/lib/voice-prompt-builder';
import { MODEL_PRIMARY, INPUT_PREPROMPTS, FORMAT_SPECS } from '@/lib/server/formats';

const Schema = z.object({
  content: z.string().min(10).max(30000),
  inputType: z.enum(['blog', 'transcript', 'notes']).default('blog'),
  formats: z
    .array(z.enum(['twitter', 'linkedin', 'newsletter', 'instagram', 'reddit', 'threads']))
    .min(1)
    .max(6)
    .default(['twitter', 'linkedin']),
  voiceDna: z.unknown().optional().nullable(),
  selectedHook: z.string().max(500).optional().nullable(),
});

// Plain-text streaming prompts (no JSON — tokens render directly).
const STREAM_SUFFIX: Record<string, string> = {
  twitter: `Return ONLY the tweets as plain text, separated by a line containing exactly ---TWEET--- . No JSON, no numbering prefixes beyond the tweet text itself, no preamble.`,
  linkedin: `Return ONLY the LinkedIn post as plain text. No JSON, no preamble.`,
  newsletter: `Return ONLY the newsletter as plain text (subject line first). No JSON, no preamble.`,
  instagram: `Return ONLY the Instagram caption as plain text. No JSON, no preamble.`,
  reddit: `Return ONLY the Reddit post as plain text: first line "Title: <title>", then a blank line, then the body. No JSON, no preamble.`,
  threads: `Return ONLY the threads as plain text, separated by a line containing exactly ---TWEET--- . No JSON, no preamble.`,
};

function sse(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

// POST /api/generate/stream — SSE: {type:'chunk'|'done-format'|'error-format'|'done', ...}
export async function POST(request: NextRequest) {
  let body: z.infer<typeof Schema>;
  try {
    body = Schema.parse(await request.json());
  } catch {
    return new Response(sse({ type: 'error', error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'text/event-stream' },
    });
  }

  const apiKeys = (process.env.GEMINI_API_KEY || '').split(',').map((k) => k.trim()).filter(Boolean);
  if (apiKeys.length === 0) {
    return new Response(sse({ type: 'error', error: 'No GEMINI_API_KEY configured' }), {
      status: 500,
      headers: { 'Content-Type': 'text/event-stream' },
    });
  }

  const { content, inputType, formats } = body;
  const voice = buildVoiceConstraints(body.voiceDna);
  const hookLine = body.selectedHook
    ? `\n- OPENING HOOK (use this angle verbatim for the first line): "${body.selectedHook}"\n`
    : '';
  const inputPre = INPUT_PREPROMPTS[inputType] ?? INPUT_PREPROMPTS.blog;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => controller.enqueue(new TextEncoder().encode(sse(obj)));
      let keyIdx = 0;
      const nextKey = () => apiKeys[keyIdx++ % apiKeys.length];

      await Promise.allSettled(
        formats.map(async (format) => {
          const spec = FORMAT_SPECS[format];
          if (!spec) return;
          const prompt = `${spec.prompt}\n\n${inputPre}\n${voice}${hookLine}\n${STREAM_SUFFIX[format]}\n\nContent to repurpose:\n\n${content}`;
          // Try each key once for this format
          let lastErr = 'failed';
          for (let k = 0; k < apiKeys.length; k++) {
            try {
              const genAI = new GoogleGenerativeAI(nextKey());
              const model = genAI.getGenerativeModel({
                model: MODEL_PRIMARY,
                generationConfig: { temperature: spec.temperature, topP: 0.9, maxOutputTokens: 4096 },
              });
              const res = await model.generateContentStream(prompt);
              for await (const chunk of res.stream) {
                const t = chunk.text();
                if (t) send({ type: 'chunk', format, text: t });
              }
              send({ type: 'done-format', format });
              return;
            } catch (e) {
              lastErr = e instanceof Error ? e.message : String(e);
            }
          }
          send({ type: 'error-format', format, error: lastErr.slice(0, 200) });
        })
      );
      send({ type: 'done' });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
