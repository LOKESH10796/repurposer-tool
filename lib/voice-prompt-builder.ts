// Voice Prompt Builder — turns a VoiceDNA profile into hard generation constraints
// Version: 2.0.0 — real injection (replaces JSON.stringify dump)
// Accepts both canonical VoiceDNA shape and legacy { tone } shape defensively.

import type { VoiceDNA } from '@/types/voice-dna';

type LooseDNA = Partial<VoiceDNA> & {
  tone?: unknown;
  hooks?: unknown;
  pillars?: unknown;
  vocabulary?: unknown;
  ctaStyle?: unknown;
  formatPreference?: unknown;
  postingRhythm?: unknown;
};

function topN<T>(arr: T[], n: number): T[] {
  return Array.isArray(arr) ? arr.slice(0, n) : [];
}

function pct(n: unknown): string {
  return typeof n === 'number' ? `${Math.round(n)}%` : '';
}

export function buildVoiceConstraints(voiceDna: unknown): string {
  if (!voiceDna || typeof voiceDna !== 'object') return '';
  const vd = voiceDna as LooseDNA;

  // --- Tone (canonical: toneProfile, legacy: tone) ---
  const toneProfile = (vd as { toneProfile?: { primary?: string; secondary?: string; dimensions?: Record<string, number> } }).toneProfile;
  const legacyTone = vd.tone as { primary?: string; secondary?: string } | string | undefined;
  const primary =
    toneProfile?.primary ?? (typeof legacyTone === 'string' ? legacyTone : legacyTone?.primary) ?? null;
  const secondary =
    toneProfile?.secondary ?? (typeof legacyTone === 'object' ? legacyTone?.secondary : undefined) ?? null;
  const dimensions = toneProfile?.dimensions;
  const topTones = dimensions
    ? Object.entries(dimensions).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `${k} ${pct(v * 100)}`).join(', ')
    : null;

  // --- Hooks (canonical: HookDistribution[]) ---
  let hookLine = '';
  const hooks = vd.hooks as Array<{ hookType?: string; percentage?: number; topHooks?: Array<{ label?: string; percentage?: number }> }> | undefined;
  if (Array.isArray(hooks) && hooks.length > 0) {
    const sorted = [...hooks].sort((a, b) => (b.percentage ?? 0) - (a.percentage ?? 0)).slice(0, 3);
    hookLine = sorted.map((h) => `${h.hookType ?? h.topHooks?.[0]?.label ?? 'hook'} ${pct(h.percentage ?? h.topHooks?.[0]?.percentage)}`).join(', ');
  }

  // --- Pillars ---
  let pillarLine = '';
  const pillars = vd.pillars as Array<{ label?: string; percentage?: number; keywords?: string[] }> | undefined;
  if (Array.isArray(pillars) && pillars.length > 0) {
    const sorted = [...pillars].sort((a, b) => (b.percentage ?? 0) - (a.percentage ?? 0)).slice(0, 3);
    pillarLine = sorted.map((p) => `${p.label}${p.percentage != null ? ` (${Math.round(p.percentage)}%)` : ''}`).join(', ');
  }

  // --- Vocabulary ---
  const vocab = vd.vocabulary as {
    signatureTerms?: Array<{ term?: string } | string>;
    avgSentenceLength?: number;
    usesBullets?: boolean;
    usesNumberedLists?: boolean;
    usesLineBreaks?: boolean;
    emojiFrequency?: number;
    avgHashtagsPerPost?: number;
  } | undefined;
  const sigTerms = Array.isArray(vocab?.signatureTerms)
    ? topN(vocab!.signatureTerms!, 8).map((t) => (typeof t === 'string' ? t : t.term)).filter(Boolean).join(', ')
    : '';
  const sentenceHint = typeof vocab?.avgSentenceLength === 'number' ? `~${Math.round(vocab.avgSentenceLength)} words/sentence` : 'short punchy sentences';
  const formatHints: string[] = [];
  if (vocab?.usesBullets) formatHints.push('bullets ok');
  if (vocab?.usesNumberedLists) formatHints.push('numbered lists ok');
  if (vocab?.usesLineBreaks) formatHints.push('frequent line breaks');
  const emojiHint = typeof vocab?.emojiFrequency === 'number' && vocab.emojiFrequency < 0.5
    ? 'minimal emojis' : typeof vocab?.emojiFrequency === 'number' && vocab.emojiFrequency > 2
      ? 'emojis welcome' : 'sparse emojis';

  // --- CTA ---
  const cta = vd.ctaStyle as { type?: string; examples?: string[] } | undefined;
  const ctaLine = cta?.type ? `${cta.type}${cta.examples?.[0] ? ` (e.g. "${cta.examples[0]}")` : ''}` : '';

  const lines: string[] = [];
  if (primary) lines.push(`- Voice: primarily ${primary}${secondary ? `, secondarily ${secondary}` : ''}${topTones ? ` (mix: ${topTones})` : ''}. Match this voice strictly.`);
  if (hookLine) lines.push(`- Hooks that work for this creator: ${hookLine}. Prefer the #1 hook for the opening line.`);
  if (pillarLine) lines.push(`- Their proven topics: ${pillarLine}. Anchor examples/angles here, don't drift generic.`);
  lines.push(`- Rhythm: ${sentenceHint}, ${formatHints.length ? formatHints.join(', ') : 'clean paragraphs'}, ${emojiHint}.`);
  if (sigTerms) lines.push(`- Signature vocabulary to weave in naturally: ${sigTerms}.`);
  if (ctaLine) lines.push(`- CTA style: ${ctaLine}.`);
  lines.push(`- Never sound like generic AI. No "delve", "game-changer", "unlock". Concrete > abstract.`);

  return `\n--- Creator Voice Constraints (follow strictly) ---\n${lines.join('\n')}\n`;
}

export function isValidVoiceDNA(v: unknown): boolean {
  if (!v || typeof v !== 'object') return false;
  const d = v as LooseDNA;
  const hasTone = !!(d as { toneProfile?: unknown }).toneProfile || !!d.tone;
  const hasHooks = !!d.hooks;
  const hasPillars = !!d.pillars;
  return hasTone && hasHooks && hasPillars;
}
