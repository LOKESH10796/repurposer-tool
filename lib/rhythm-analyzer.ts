// Rhythm Analyzer - Temporal Analysis
// Version: 1.0.0
// Last Updated: 2026-08-29

import { NormalizedPost, RhythmSlot } from '../types/voice-dna';

export function analyzeRhythm(posts: NormalizedPost[]): RhythmSlot[] {
  const rhythmMap: Record<string, { dayOfWeek: number; hour: number; engagement: number }> = {};

  posts.forEach(post => {
    const date = new Date(post.date);
    const dayOfWeek = date.getDay(); // 0-6 (Sunday-Saturday)
    const hour = date.getHours();
    const key = `${dayOfWeek}-${hour}`;

    if (!rhythmMap[key]) {
      rhythmMap[key] = { dayOfWeek, hour, engagement: 0 };
    }

    rhythmMap[key].engagement += post.engagement;
  });

  const slots: RhythmSlot[] = Object.values(rhythmMap).map(slot => ({
    dayOfWeek: slot.dayOfWeek,
    hour: slot.hour,
    engagement: slot.engagement
  }));

  return slots.sort((a, b) => b.engagement - a.engagement);
}
