import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildVoiceConstraints } from '@/lib/voice-prompt-builder';
import { MODEL_PRIMARY, FORMAT_SPECS } from '@/lib/server/formats';

const MODIFIERS: Record<string, string> = {
  punchier: 'Rewrite this to be ~20% shorter and punchier. Cut filler, sharpen verbs, keep all facts and the opening hook.',
  metric: 'Rewrite this adding one concrete, plausible-sounding metric or number to strengthen the strongest claim. Keep everything else intact. Do not invent personal results; frame as an illustrative benchmark.',
  contrarian: 'Rewrite this with a more contrarian edge. Challenge one piece of conventional wisdom in the niche, keep it professional (no insults), keep structure and length similar.',
};

const Schema = z.object({
  text: z.string().min(10).max(12000),
  modifier: z.enum(['punchier', 'metric', 'contrarian']),
  format: z.string().max(30).optional().default('linkedin'),
  voiceDna: z.unknown().optional().nullable(),
});

// POST /api/refine { text, modifier, format, voiceDna } -> { text }
export async function POST(request: NextRequest) {
  let body: z.infer<typeof Schema>;
  try {
    body = Schema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request — expected { text, modifier }' }, { status: 400 });
  }

  const instruction = MODIFIERS[body.modifier];
  const spec = FORMAT_SPECS[body.format];
  const voice = buildVoiceConstraints(body.voiceDna);
  const apiKeys = (process.env.GEMINI_API_KEY || '').split(',').map((k) => k.trim()).filter(Boolean);
  if (apiKeys.length === 0) return NextResponse.json({ error: 'No GEMINI_API_KEY configured' }, { status: 500 });

  const prompt = `You are an expert editor for ${spec ? body.format : 'social'} content. ${instruction}
${voice ? `\nCreator voice (respect it):\n${voice}\n` : ''}
Return ONLY the rewritten text — no quotes, no preamble, no explanation.

TEXT TO REWRITE:
${body.text}`;

  let lastError = 'unknown';
  for (const key of apiKeys) {
    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({
        model: MODEL_PRIMARY,
        generationConfig: { temperature: 0.75, topP: 0.9, maxOutputTokens: 4096 },
      });
      const result = await model.generateContent(prompt);
      const out = (await result.response).text().trim()
        .replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```\s*$/, '').trim();
      if (!out) throw new Error('empty rewrite');
      return NextResponse.json({ text: out });
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
    }
  }
  return NextResponse.json({ error: 'Refine failed', details: lastError.slice(0, 300) }, { status: 502 });
}
