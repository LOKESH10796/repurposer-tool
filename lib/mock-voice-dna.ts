/**
 * Mock Voice DNA Generator
 * Realistic test data for development and preview
 * Replace with real extraction in voice-dna-extractor.ts
 */

import type { VoiceDNA, NormalizedPost, HookType, PillarLabel } from '@/types/voice-dna';

const TONE_LABELS = [
  { primary: 'Analytical Storyteller', secondary: 'Framework Builder', desc: 'You blend data-driven insights with narrative structures that make complex ideas accessible.' },
  { primary: 'Contrarian Thinker', secondary: 'Provocative Questioner', desc: 'You challenge assumptions and spark debate with bold, evidence-backed perspectives.' },
  { primary: 'Empathetic Leader', secondary: 'Vulnerable Mentor', desc: 'You lead with authenticity, sharing failures alongside wins to build deep trust.' },
  { primary: 'Practical Operator', secondary: 'Systems Thinker', desc: 'You distill experience into repeatable frameworks others can execute immediately.' },
];

const HOOK_LABELS: Record<HookType, string> = {
  framework: 'Framework',
  contrarian: 'Contrarian',
  story: 'Story',
  'data-driven': 'Data-Driven',
  question: 'Question',
  'bold-claim': 'Bold Claim',
  listicle: 'Listicle',
  'how-to': 'How-To',
  'case-study': 'Case Study',
  prediction: 'Prediction',
};

const PILLAR_CANDIDATES: Array<{ label: PillarLabel; keywords: string[] }> = [
  { label: 'Strategy', keywords: ['strategy', 'plan', 'approach', 'method', 'framework', 'process', 'system'] },
  { label: 'Leadership', keywords: ['leader', 'team', 'management', 'culture', 'inspire', 'mentor'] },
  { label: 'AI/Tech', keywords: ['ai', 'technology', 'tool', 'software', 'automation', 'machine learning'] },
  { label: 'Productivity', keywords: ['productivity', 'workflow', 'system', 'process', 'efficiency', 'time management'] },
  { label: 'Sales', keywords: ['sales', 'revenue', 'deal', 'pipeline', 'closing', 'conversion'] },
  { label: 'Marketing', keywords: ['marketing', 'brand', 'audience', 'content', 'campaign', 'growth'] },
  { label: 'Personal Growth', keywords: ['growth', 'development', 'habits', 'mindset', 'discipline', 'learning'] },
  { label: 'Industry News', keywords: ['news', 'trends', 'industry', 'market', 'announcement', 'update'] },
  { label: 'Career', keywords: ['career', 'job', 'promotion', 'interview', 'resume', 'hiring'] },
  { label: 'Entrepreneurship', keywords: ['startup', 'business', 'founder', 'entrepreneur', 'venture', 'scale'] },
];

const FORMAT_LABELS: string[] = ['carousel', 'singleImage', 'video', 'textOnly', 'poll', 'document', 'article'];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateMockPosts(count: number): NormalizedPost[] {
  const posts: NormalizedPost[] = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const hoursAgo = Math.floor(Math.random() * 24);
    const timestamp = new Date(now - daysAgo * dayMs - hoursAgo * 60 * 60 * 1000);
    
    const type = pickRandom(FORMAT_LABELS);
    const impressions = Math.floor(Math.random() * 10000) + 500;
    const engagementRate = Math.random() * 5 + 0.5;
    const likes = Math.floor(impressions * engagementRate / 100 * (0.7 + Math.random() * 0.3));
    const comments = Math.floor(likes * (0.05 + Math.random() * 0.15));
    const shares = Math.floor(likes * (0.02 + Math.random() * 0.08));
    
    posts.push({
      id: `post-${i}`,
      url: `https://linkedin.com/posts/example-${i}`,
      text: `Sample post ${i} about ${pickRandom(PILLAR_CANDIDATES).label.toLowerCase()}...`,
      date: timestamp.toISOString(),
      timestamp,
      engagement: likes + comments + shares,
      impressions,
      likes,
      comments,
      shares,
      format: type,
      platform: 'linkedin',
      tags: ['#sales', '#ai', '#leadership'].slice(0, Math.floor(Math.random() * 3) + 1),
      clickThroughs: Math.floor(impressions * 0.01),
      engagementRate,
      wordCount: Math.floor(Math.random() * 200) + 50,
      hashtags: ['#sales', '#ai', '#leadership'].slice(0, Math.floor(Math.random() * 3) + 1),
      mentions: [],
      emojis: Math.random() > 0.5 ? ['🚀', '💡', '📈'].slice(0, Math.floor(Math.random() * 2) + 1) : [],
      hasLink: Math.random() > 0.7,
      hasImage: type === 'singleImage',
      hasVideo: type === 'video',
      hasDocument: type === 'document',
    });
  }
  
  return posts.sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0));
}

export function mockVoiceDna(posts: NormalizedPost[]): VoiceDNA {
  const postCount = posts.length;
  const confidence = Math.min(1, postCount / 50) * (0.7 + Math.random() * 0.3);
  
  // Pick a tone archetype
  const toneArchetype = pickRandom(TONE_LABELS);
  
  // Generate hook distribution (weighted toward top 3)
  const hookTypes: HookType[] = ['framework', 'contrarian', 'story', 'data-driven', 'question', 'bold-claim', 'listicle', 'how-to', 'case-study', 'prediction'];
  const shuffledHooks = shuffle(hookTypes);
  const top3Hooks = shuffledHooks.slice(0, 3);
  const remainingHooks = shuffledHooks.slice(3);
  
  const hookDist: Record<HookType, number> = {
    framework: 0, contrarian: 0, story: 0, 'data-driven': 0, question: 0,
    'bold-claim': 0, listicle: 0, 'how-to': 0, 'case-study': 0, prediction: 0
  };
  let remaining = 100;
  
  top3Hooks.forEach((hook, i) => {
    const weight = [40, 25, 15][i] + (Math.random() - 0.5) * 10;
    hookDist[hook] = Math.max(5, Math.min(50, weight));
    remaining -= hookDist[hook];
  });
  
  remainingHooks.forEach(hook => {
    const weight = Math.max(1, remaining / remainingHooks.length + (Math.random() - 0.5) * 5);
    hookDist[hook] = Math.max(1, Math.min(10, weight));
    remaining -= hookDist[hook];
  });
  
  // Normalize to 100
  const total = Object.values(hookDist).reduce((a, b) => a + b, 0);
  (Object.keys(hookDist) as HookType[]).forEach(k => { hookDist[k] = Math.round(hookDist[k] / total * 100); });
  
  // Generate pillars (3-5 based on post count)
  const pillarCount = Math.min(5, Math.max(3, Math.floor(postCount / 20)));
  const selectedPillars = shuffle(PILLAR_CANDIDATES).slice(0, pillarCount);
  
  const pillars = selectedPillars.map((p, i) => ({
    id: `pillar-${i}`,
    label: p.label,
    keywords: p.keywords,
    percentage: Math.round((100 / pillarCount) * (0.8 + Math.random() * 0.4)),
    avgEngagement: Math.round(2 + Math.random() * 4),
    topPosts: posts.slice(i * 3, i * 3 + 3),
    exemplars: posts.slice(i * 3, i * 3 + 2),
    relatedPillars: selectedPillars.filter((_, j) => j !== i).slice(0, 2).map(p => p.label),
    trend: pickRandom(['up', 'down', 'stable'] as const),
  }));
  
  // Normalize pillar percentages
  const pillarTotal = pillars.reduce((a, b) => a + b.percentage, 0);
  pillars.forEach(p => { p.percentage = Math.round(p.percentage / pillarTotal * 100); });
  
  // Format preference
  const formatScores: Record<string, number> = {};
  FORMAT_LABELS.forEach(f => { formatScores[f] = Math.random() * 100; });
  formatScores.carousel += 50; // Bias toward carousel
  
  const primaryFormat = Object.entries(formatScores).sort((a, b) => b[1] - a[1])[0][0] as typeof FORMAT_LABELS[number];
  
  // Rhythm
  const dayDist = new Array(7).fill(0).map(() => Math.random());
  const daySum = dayDist.reduce((a, b) => a + b, 0);
  const hourDist = new Array(24).fill(0).map(() => Math.random());
  const hourSum = hourDist.reduce((a, b) => a + b, 0);
  
  // Best slots: Tue/Thu 8-9 AM, Sun 7 PM
  const bestSlots = [
    { day: 2, hour: 8, score: 0.92 },
    { day: 4, hour: 9, score: 0.89 },
    { day: 0, hour: 19, score: 0.85 },
  ];
  
  // Next optimal (next Tuesday 8:30 AM)
  const nextTue = new Date();
  nextTue.setDate(nextTue.getDate() + ((2 + 7 - nextTue.getDay()) % 7));
  nextTue.setHours(8, 30, 0, 0);
  
  // Build hooks array matching HookDistribution[]
  const hooks = Object.entries(hookDist).map(([hookType, percentage]) => ({
    hookType: hookType as HookType,
    count: Math.round(postCount * percentage / 100),
    percentage,
    topHooks: [{
      type: hookType as HookType,
      percentage,
      label: HOOK_LABELS[hookType as HookType]
    }]
  })).sort((a, b) => b.percentage - a.percentage);
  
  const topPost = posts[0];
  const avgEngagementRate = posts.reduce((sum, p) => sum + (p.engagementRate || 0), 0) / Math.max(1, posts.length);
  const meanImpressions = Math.round(posts.reduce((sum, p) => sum + p.impressions, 0) / postCount);
  const sortedImpressions = [...posts].sort((a, b) => a.impressions - b.impressions);
  const medianImpressions = sortedImpressions[Math.floor(postCount / 2)]?.impressions || 0;
  
  return {
    id: `vdn-${Date.now()}`,
    userId: 'user-dev',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
    
    confidence: Math.round(confidence * 100) / 100,
    postCount,
    dateRange: {
      earliest: posts[posts.length - 1]?.date || new Date().toISOString(),
      latest: posts[0]?.date || new Date().toISOString(),
    },
    source: 'csv',
    
    toneProfile: {
      dimensions: {
        professional: 0.25 + Math.random() * 0.15,
        conversational: 0.20 + Math.random() * 0.15,
        authoritative: 0.15 + Math.random() * 0.15,
        vulnerable: 0.10 + Math.random() * 0.10,
        humorous: 0.05 + Math.random() * 0.10,
        analytical: 0.15 + Math.random() * 0.15,
        inspirational: 0.05 + Math.random() * 0.10,
        contrarian: 0.05 + Math.random() * 0.10,
      },
      primary: toneArchetype.primary,
      secondary: toneArchetype.secondary,
      confidence: 0.85
    },
    
    hooks,
    
    pillars,
    
    formatPreference: {
      format: primaryFormat,
      engagementRate: avgEngagementRate,
      multiplier: 1.0,
      isPrimary: true,
      engagementMultiplier: {
        carousel: 3.2,
        singleImage: 1.0,
        video: 2.1,
        textOnly: 0.7,
        poll: 1.4,
        document: 1.8,
        article: 1.2,
      },
    },
    
    postingRhythm: {
      dayDistribution: dayDist.map(d => d / daySum),
      hourDistribution: hourDist.map(h => h / hourSum),
      postsPerWeek: Math.round(postCount / 12 * 10) / 10,
      consistencyScore: 0.6 + Math.random() * 0.3,
      bestSlots,
      nextOptimalSlot: {
        day: nextTue.getDay(),
        hour: nextTue.getHours(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    },
    
    ctaStyle: {
      type: 'resource',
      frequency: 30 + Math.random() * 20,
      examples: [
        'Save this framework for later 📌',
        'Grab the template in the comments',
        'Download the full guide →',
      ],
    },
    
    vocabulary: {
      signatureTerms: [
        { term: 'framework', frequency: 0.12, distinctiveness: 0.89 },
        { term: 'pipeline', frequency: 0.08, distinctiveness: 0.82 },
        { term: 'leverage', frequency: 0.06, distinctiveness: 0.75 },
        { term: 'compound', frequency: 0.05, distinctiveness: 0.78 },
        { term: 'systematic', frequency: 0.04, distinctiveness: 0.71 },
      ],
      avgSentenceLength: 18 + Math.random() * 8,
      fleschKincaid: 10 + Math.random() * 4,
      fleschKincaidGrade: 10 + Math.random() * 4,
      topEmojis: ['🚀', '💡', '📈', '🎯', '🔑'],
      hashtagPatterns: ['#sales', '#ai', '#leadership', '#growth', '#strategy'],
      formattingMarkers: ['bullet points', 'numbered lists', 'bold text', 'line breaks'],
      emojiFrequency: 2.5,
      avgHashtagsPerPost: 4.2,
      topHashtags: ['#sales', '#ai', '#leadership', '#growth', '#strategy'],
      avgWordsPerPost: 145,
      usesBullets: true,
      usesNumberedLists: true,
      usesLineBreaks: true
    },
    
    benchmarks: {
      meanImpressions,
      medianImpressions,
      meanEngagementRate: avgEngagementRate,
      topPost: topPost || posts[0],
      percentile: 75 + Math.floor(Math.random() * 20),
      topPostImpressions: Math.max(...posts.map(p => p.impressions)),
      topPostEngagementRate: Math.max(...posts.map(p => p.engagementRate || 0)),
    },
    
    coldStart: postCount < 20 ? {
      aspirationalCreators: [
        { name: 'Justin Welsh', handle: 'justinwelsh', profileUrl: 'https://linkedin.com/in/justinwelsh', selectedHooks: ['framework', 'listicle', 'how-to'], influenceWeight: 0.7 },
        { name: 'Sahil Bloom', handle: 'sahilbloom', profileUrl: 'https://linkedin.com/in/sahilbloom', selectedHooks: ['story', 'framework', 'contrarian'], influenceWeight: 0.6 },
        { name: 'Ali Abdaal', handle: 'aliabdaal', profileUrl: 'https://linkedin.com/in/aliabdaal', selectedHooks: ['how-to', 'framework', 'data-driven'], influenceWeight: 0.5 },
      ],
      rawIdeas: [],
      blendRatio: 0.7,
      generatedAt: new Date().toISOString(),
    } : undefined,
  };
}

// Generate mock suggestions for preview
export function mockSuggestions(voiceDna: VoiceDNA) {
  const topPillar = voiceDna.pillars[0]?.label || 'Your Top Topic';
  const topHook = voiceDna.hooks[0]?.hookType || 'framework';
  const topFormat = voiceDna.formatPreference.format;
  
  return [
    {
      id: 'sugg-1',
      type: 'repurpose' as const,
      confidence: 0.92,
      title: `Turn "${topPillar}" insights into a ${topFormat}`,
      description: `Your recent post on ${topPillar.toLowerCase()} got ${voiceDna.benchmarks.topPostImpressions.toLocaleString()} impressions. Repurpose it as a ${topFormat} using your #1 hook: ${voiceDna.hooks[0]?.topHooks[0]?.label}.`,
      recommendedFormat: topFormat,
      recommendedHook: topHook,
      recommendedPillar: topPillar,
      suggestedTime: voiceDna.postingRhythm?.nextOptimalSlot,
      reasoning: `Your ${topFormat}s get ${voiceDna.formatPreference.engagementMultiplier[topFormat] || 2}x engagement. The ${voiceDna.hooks[0]?.topHooks[0]?.label} hook is your highest performer at ${voiceDna.hooks[0]?.percentage}% of posts.`,
      estimatedEngagement: Math.round(voiceDna.benchmarks.meanEngagementRate * (voiceDna.formatPreference.engagementMultiplier[topFormat] || 2) * 100) / 100,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sugg-2',
      type: 'whitespace' as const,
      confidence: 0.78,
      title: `"${voiceDna.pillars[1]?.label || 'Secondary Pillar'}" gap detected`,
      description: `You haven't posted about ${voiceDna.pillars[1]?.label?.toLowerCase() || 'this topic'} in ~42 days. Your audience engages ${voiceDna.pillars[1]?.avgEngagement || 3}x more when you do.`,
      recommendedFormat: 'carousel',
      recommendedHook: 'framework',
      recommendedPillar: voiceDna.pillars[1]?.label || 'Secondary Topic',
      suggestedTime: voiceDna.postingRhythm?.bestSlots[0],
      reasoning: `Whitespace analysis shows ${voiceDna.pillars[1]?.label || 'this pillar'} drives high engagement but low frequency. Fill the gap with a framework-style carousel.`,
      estimatedEngagement: voiceDna.benchmarks.meanEngagementRate * 1.5,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sugg-3',
      type: 'series' as const,
      confidence: 0.85,
      title: 'Continue your "Framework Friday" series',
      description: `Your last framework post (#${voiceDna.postCount - 2}) had ${Math.round(voiceDna.benchmarks.meanEngagementRate * 2.3)}% engagement. Post #3 this Friday at 8:30 AM.`,
      recommendedFormat: 'carousel',
      recommendedHook: 'framework',
      recommendedPillar: topPillar,
      suggestedTime: voiceDna.postingRhythm?.bestSlots[0] ? { ...voiceDna.postingRhythm.bestSlots[0], day: 5 } : undefined, // Friday
      reasoning: `Series posts have 83% completion rate. Your audience expects weekly frameworks. Maintain the rhythm.`,
      estimatedEngagement: voiceDna.benchmarks.meanEngagementRate * 2.1,
      createdAt: new Date().toISOString(),
    },
  ];
}