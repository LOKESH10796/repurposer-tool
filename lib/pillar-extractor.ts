// Pillar Extractor - Topic Modeling (Simplified)
// Version: 1.0.0
// Last Updated: 2026-08-29

import { NormalizedPost, Pillar, PillarLabel } from '../types/voice-dna';

const PILLAR_LABELS: PillarLabel[] = [
  'Strategy',
  'Leadership',
  'AI/Tech',
  'Productivity',
  'Sales',
  'Marketing',
  'Personal Growth',
  'Industry News',
  'Career',
  'Entrepreneurship'
];

const PILLAR_KEYWORDS: Record<PillarLabel, string[]> = {
  'Strategy': ['strategy', 'plan', 'approach', 'method', 'framework', 'process', 'system'],
  'Leadership': ['leader', 'team', 'management', 'culture', 'inspire', 'mentor'],
  'AI/Tech': ['ai', 'technology', 'tool', 'software', 'automation', 'machine learning'],
  'Productivity': ['productivity', 'efficiency', 'time management', 'focus', 'workflow'],
  'Sales': ['sales', 'revenue', 'deal', 'pipeline', 'closing', 'conversion'],
  'Marketing': ['marketing', 'brand', 'audience', 'content', 'campaign', 'growth'],
  'Personal Growth': ['growth', 'development', 'habits', 'mindset', 'discipline', 'learning'],
  'Industry News': ['news', 'trends', 'industry', 'market', 'announcement', 'update'],
  'Career': ['career', 'job', 'promotion', 'interview', 'resume', 'hiring'],
  'Entrepreneurship': ['startup', 'business', 'founder', 'entrepreneur', 'venture', 'scale']
};

export function extractPillars(posts: NormalizedPost[]): Pillar[] {
  const pillarScores: Record<PillarLabel, { score: number; posts: NormalizedPost[] }> = 
    PILLAR_LABELS.reduce((acc, label) => {
      acc[label] = { score: 0, posts: [] };
      return acc;
    }, {} as Record<PillarLabel, { score: number; posts: NormalizedPost[] }>);

  posts.forEach(post => {
    PILLAR_LABELS.forEach(label => {
      const keywords = PILLAR_KEYWORDS[label];
      const matchCount = keywords.filter(keyword => 
        post.text.toLowerCase().includes(keyword.toLowerCase())
      ).length;

      if (matchCount > 0) {
        pillarScores[label].score += matchCount;
        pillarScores[label].posts.push(post);
      }
    });
  });

  const sortedPillars = Object.entries(pillarScores)
    .filter(([_, data]) => data.score > 0)
    .map(([label, data], index) => ({
      id: `pillar-${index}`,
      label: label as PillarLabel,
      keywords: PILLAR_KEYWORDS[label as PillarLabel],
      percentage: Math.round((data.score / posts.length) * 100),
      avgEngagement: data.posts.length > 0 
        ? Math.round(data.posts.reduce((sum, p) => sum + p.engagement, 0) / data.posts.length)
        : 0,
      trend: 'stable' as const,
      topPosts: data.posts.slice(0, 3),
      exemplars: data.posts.slice(0, 2),
      relatedPillars: []
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return sortedPillars;
}
