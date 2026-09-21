import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildVoiceConstraints } from '@/lib/voice-prompt-builder';
import { MODEL_PRIMARY } from '@/lib/server/formats';

const Schema = z.object({
  content: z.string().min(10).max(15000),
  voiceDna: z.unknown().optional().nullable(),
});

const HOOK_LABELS = ['Contrarian', 'Question', 'Data-Driven', 'Story', 'Bold Claim'] as const;

// POST /api/hooks { content, voiceDna } -> { hooks: [{ label, text }] }
// Fast preliminary call — pitches 5 viral angles before full generation.
export async function POST(request: NextRequest) {
  let body: z.infer<typeof Schema>;
  try {
    body = Schema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request — expected { content }' }, { status: 400 });
  }

  const apiKeys = (process.env.GEMINI_API_KEY || '').split(',').map((k) => k.trim()).filter(Boolean);
  if (apiKeys.length === 0) return NextResponse.json({ error: 'No GEMINI_API_KEY configured' }, { status: 500 });

  const voice = buildVoiceConstraints(body.voiceDna);
  const prompt = `You are a viral hook writer. Based on the input text below${voice ? ' and the creator voice constraints' : ''}, write 5 distinct opening hooks — exactly one per label: ${HOOK_LABELS.join(', ')}.
Rules: each hook 1-2 sentences max, under 240 chars, concrete, no hashtags, no explanations.
${voice}
Input:
${body.content.slice(0, 8000)}

Return ONLY valid JSON: { "hooks": [{ "label": "Contrarian", "text": "..." }, ...] } — exactly 5 items, one per label, in the given order.`;

  let lastError = 'unknown';
  for (const key of apiKeys) {
    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({
        model: MODEL_PRIMARY,
        generationConfig: { temperature: 0.9, topP: 0.95, maxOutputTokens: 1024 },
      });
      const result = await model.generateContent(prompt);
      const raw = (await result.response).text().trim()
        .replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```\s*$/, '');
      const start = raw.indexOf('{');
      const end = raw.lastIndexOf('}');
      const parsed = JSON.parse(start !== -1 && end !== -1 ? raw.slice(start, end + 1) : raw) as {
        hooks?: Array<{ label?: string; text?: string }>;
      };
      if (!Array.isArray(parsed.hooks) || parsed.hooks.length === 0) throw new Error('bad hooks shape');
      const hooks = HOOK_LABELS.map((label, i) => ({
        label,
        text: String(parsed.hooks![i]?.text ?? parsed.hooks![i] ?? '').slice(0, 300),
      })).filter((h) => h.text.length > 0);
      if (hooks.length === 0) throw new Error('empty hooks');
      return NextResponse.json({ hooks });
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
    }
  }
  return NextResponse.json({ error: 'Hook generation failed', details: lastError.slice(0, 300) }, { status: 502 });
}
