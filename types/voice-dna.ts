// Voice DNA Type System
// Version: 1.0.0
// Last Updated: 2026-08-29

export type HookType = 
  | 'framework' 
  | 'contrarian' 
  | 'story' 
  | 'data-driven' 
  | 'question' 
  | 'bold-claim' 
  | 'listicle' 
  | 'how-to' 
  | 'case-study' 
  | 'prediction';

export type PillarLabel = 
  | 'Strategy' 
  | 'Leadership' 
  | 'AI/Tech' 
  | 'Productivity' 
  | 'Sales' 
  | 'Marketing' 
  | 'Personal Growth' 
  | 'Industry News' 
  | 'Career' 
  | 'Entrepreneurship';

export interface NormalizedPost {
  id: string;
  text: string;
  date: string; // ISO date
  timestamp?: Date; // For mock data
  engagement: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  format: string;
  platform: string;
  tags: string[];
  url?: string;
  type?: string; // For mock data
  clickThroughs?: number;
  engagementRate?: number;
  wordCount?: number;
  hashtags?: string[];
  mentions?: string[];
  emojis?: string[];
  hasLink?: boolean;
  hasImage?: boolean;
  hasVideo?: boolean;
  hasDocument?: boolean;
}

export interface Pillar {
  id: string;
  label: PillarLabel;
  keywords: string[];
  percentage: number;
  avgEngagement: number;
  topPosts: NormalizedPost[];
  exemplars: NormalizedPost[];
  relatedPillars: string[];
  trend: 'up' | 'down' | 'stable';
}

export interface HookDistribution {
  hookType: HookType;
  count: number;
  percentage: number;
  topHooks: { type: HookType; percentage: number; label: string }[];
}

export interface LinkedInPostRow {
  id: string;
  url: string;
  text: string;
  timestamp: Date;
  type: string;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  engagement: number;
  format: string;
  platform: string;
  tags: string[];
  hasDocument: boolean;
  date: string;
  engagementRate: number;
}

export interface ToneProfile {
  dimensions: Record<string, number>;
  primary: string;
  secondary: string;
  confidence: number;
}

export interface RhythmSlot {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  hour: number; // 0-23
  engagement: number;
}

export interface VocabularyStats {
  signatureTerms: Array<{ term: string; frequency: number; distinctiveness: number }>;
  avgSentenceLength: number;
  fleschKincaid: number;
  topEmojis: string[];
  hashtagPatterns: string[];
  formattingMarkers: string[];
  emojiFrequency: number;
  avgHashtagsPerPost: number;
  topHashtags: string[];
  avgWordsPerPost: number;
  fleschKincaidGrade: number;
  usesBullets: boolean;
  usesNumberedLists: boolean;
  usesLineBreaks: boolean;
}

export interface CTAStyle {
  type: string;
  frequency: number;
  examples: string[];
}

export interface FormatPreference {
  format: string;
  engagementRate: number;
  multiplier: number;
  isPrimary: boolean;
  engagementMultiplier: Record<string, number>;
}

export interface Benchmark {
  meanImpressions: number;
  medianImpressions: number;
  meanEngagementRate: number;
  topPost: NormalizedPost;
  percentile: number;
  topPostImpressions: number;
  topPostEngagementRate: number;
}

export interface VoiceDNA {
  id: string;
  userId?: string;
  version?: number;
  confidence: number;
  postCount: number;
  dateRange?: { earliest: string; latest: string };
  source?: string;
  toneProfile: ToneProfile;
  hooks: HookDistribution[];
  pillars: Pillar[];
  formatPreference: FormatPreference;
  postingRhythm?: {
    dayDistribution: number[];
    hourDistribution: number[];
    postsPerWeek: number;
    consistencyScore: number;
    bestSlots: { day: number; hour: number; score: number }[];
    nextOptimalSlot: { day: number; hour: number; timezone: string };
  };
  vocabulary: VocabularyStats;
  ctaStyle: CTAStyle;
  benchmarks: Benchmark;
  coldStart?: {
    aspirationalCreators: { name: string; handle: string; profileUrl: string; selectedHooks: HookType[]; influenceWeight: number }[];
    rawIdeas: string[];
    blendRatio: number;
    generatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SmartSuggestion {
  id: string;
  type: 'repurpose' | 'whitespace' | 'reactive' | 'series';
  title: string;
  description: string;
  confidence: number;
  sourceUrl?: string;
  voiceDNAId: string;
}

export interface WhitespaceGap {
  topic: string;
  frequency: number;
  suggestedFrequency: number;
  impact: 'high' | 'medium' | 'low';
}

export interface ReactiveSuggestion {
  topic: string;
  trigger: string;
  suggestedAngle: string;
  confidence: number;
}

export interface SeriesSuggestion {
  topic: string;
  episodeCount: number;
  suggestedTitles: string[];
  confidence: number;
}

export interface CrossPlatformPlan {
  platforms: string[];
  formatAdaptations: Record<string, string>;
  postingSchedule: Record<string, string[]>;
}
