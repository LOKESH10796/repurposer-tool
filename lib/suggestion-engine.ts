// Suggestion Engine - Smart Content Suggestions
// Version: 1.0.0
// Last Updated: 2026-08-29

import { VoiceDNA, SmartSuggestion, WhitespaceGap, ReactiveSuggestion, SeriesSuggestion, CrossPlatformPlan } from '../types/voice-dna';

export function suggestRepurpose(sourceUrl: string, voiceDNA: VoiceDNA): SmartSuggestion {
  return {
    id: `suggestion-${Date.now()}`,
    type: 'repurpose',
    title: 'Repurpose This Content',
    description: 'Based on your Voice DNA, this content aligns well with your top-performing hooks and pillars.',
    confidence: 0.85,
    sourceUrl,
    voiceDNAId: voiceDNA.id
  };
}

export function detectWhitespace(voiceDNA: VoiceDNA): WhitespaceGap[] {
  const gaps: WhitespaceGap[] = [];

  // Check for under-represented pillars
  voiceDNA.pillars.forEach(pillar => {
    if (pillar.percentage < 10 && pillar.trend === 'down') {
      gaps.push({
        topic: pillar.label,
        frequency: pillar.percentage,
        suggestedFrequency: 15,
        impact: 'high'
      });
    }
  });

  return gaps;
}

export function detectReactiveTrends(voiceDNA: VoiceDNA, networkPosts: string[]): ReactiveSuggestion[] {
  const suggestions: ReactiveSuggestion[] = [];

  // Simple trend detection based on common topics
  const trendingTopics = ['AI', 'productivity', 'leadership', 'marketing', 'strategy'];

  trendingTopics.forEach(topic => {
    if (voiceDNA.pillars.some(p => p.label.toLowerCase().includes(topic.toLowerCase()))) {
      suggestions.push({
        topic,
        trigger: 'Current trending topic',
        suggestedAngle: `Your perspective on ${topic}`,
        confidence: 0.7
      });
    }
  });

  return suggestions;
}

export function detectSeriesOpportunities(voiceDNA: VoiceDNA): SeriesSuggestion[] {
  const opportunities: SeriesSuggestion[] = [];

  voiceDNA.pillars.forEach(pillar => {
    if (pillar.percentage > 20) {
      opportunities.push({
        topic: pillar.label,
        episodeCount: 5,
        suggestedTitles: [
          `The Ultimate ${pillar.label} Guide`,
          `${pillar.label} Mistakes to Avoid`,
          `5 ${pillar.label} Strategies for 2026`,
          `How I Mastered ${pillar.label}`,
          `${pillar.label} Framework That Works`
        ],
        confidence: 0.75
      });
    }
  });

  return opportunities;
}

export function crossPlatformStrategy(voiceDNA: VoiceDNA, platforms: string[]): CrossPlatformPlan {
  const formatAdaptations: Record<string, string> = {
    linkedin: 'Professional text posts with hashtags',
    twitter: 'Short threads with key insights',
    youtube: 'Video explanations with visual aids',
    instagram: 'Carousel posts with key takeaways',
    newsletter: 'Long-form email with detailed insights'
  };

  const postingSchedule: Record<string, string[]> = {
    linkedin: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    twitter: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    youtube: ['Monday', 'Wednesday', 'Friday'],
    instagram: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    newsletter: ['Tuesday', 'Thursday']
  };

  return {
    platforms,
    formatAdaptations,
    postingSchedule
  };
}
