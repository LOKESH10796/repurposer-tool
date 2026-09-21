/**
 * Cold Start Page
 * Guided onboarding for new users with < 20 posts
 */

'use client';

import { useState, useEffect } from 'react';
import { generateId } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { ArrowRight, Sparkles, TrendingUp, Users, Brain, Target, Zap } from 'lucide-react';
import Link from 'next/link';

interface ColdStartPageProps {
  searchParams: Promise<{ step?: string }>;
}

const CREATORS = [
  { id: 'justin-welsh', name: 'Justin Welsh', handle: '@justinwelsh', 
    description: 'Solopreneur & content expert. Masters frameworks, listicles, and actionable advice.',
    hooks: ['framework', 'listicle', 'howTo'] as const },
  { id: 'sahil-bloom', name: 'Sahil Bloom', handle: '@sahilbloom',
    description: 'Investor & storyteller. Expert at frameworks, contrarian takes, and viral storytelling.',
    hooks: ['framework', 'contrarian', 'story'] as const },
  { id: 'ali-abdaal', name: 'Ali Abdaal', handle: '@aliabdaal',
    description: 'Doctor & productivity guru. Known for how-tos, frameworks, and data-backed advice.',
    hooks: ['howTo', 'framework', 'data'] as const },
  { id: 'alex-hormozi', name: 'Alex Hormozi', handle: '@alexhormozi',
    description: 'Entrepreneur & investor. Masters bold claims, frameworks, and direct CTAs.',
    hooks: ['boldClaim', 'framework', 'direct'] as const },
  { id: 'linda-jiang', name: 'Linda Jiang', handle: '@lindajiang',
    description: 'Growth marketer & builder. Expert at data, experiments, and growth frameworks.',
    hooks: ['data', 'framework', 'experiment'] as const },
  { id: 'shaan-puri', name: 'Shaan Puri', handle: '@shaanpuri',
    description: 'Entrepreneur & podcaster. Known for storytelling, frameworks, and viral hooks.',
    hooks: ['story', 'framework', 'prediction'] as const },
];

export default function ColdStartPage({ searchParams }: ColdStartPageProps) {
  const [step, setStep] = useState<'creators' | 'blend' | 'complete'>('creators');
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [customIdeas, setCustomIdeas] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const CREATORS = [
    { id: 'justin-welsh', name: 'Justin Welsh', handle: '@justinwelsh', 
      description: 'Solopreneur & content expert. Masters frameworks, listicles, and actionable advice.',
      hooks: ['framework', 'listicle', 'howTo'] as const },
    { id: 'sahil-bloom', name: 'Sahil Bloom', handle: '@sahilbloom',
      description: 'Investor & storyteller. Expert at frameworks, contrarian takes, and viral storytelling.',
      hooks: ['framework', 'contrarian', 'story'] as const },
    { id: 'ali-abdaal', name: 'Ali Abdaal', handle: '@aliabdaal',
      description: 'Doctor & productivity guru. Known for how-tos, frameworks, and data-backed advice.',
      hooks: ['howTo', 'framework', 'data'] as const },
    { id: 'alex-hormozi', name: 'Alex Hormozi', handle: '@alexhormozi',
      description: 'Entrepreneur & investor. Masters bold claims, frameworks, and direct CTAs.',
      hooks: ['boldClaim', 'framework', 'direct'] as const },
    { id: 'linda-jiang', name: 'Linda Jiang', handle: '@lindajiang',
      description: 'Growth marketer & builder. Expert at data, experiments, and growth frameworks.',
      hooks: ['data', 'framework', 'experiment'] as const },
    { id: 'shaan-puri', name: 'Shaan Puri', handle: '@shaanpuri',
      description: 'Entrepreneur & podcaster. Known for storytelling, frameworks, and viral hooks.',
      hooks: ['story', 'framework', 'prediction'] as const },
  ];

  const handleNext = () => {
    if (step === 'creators') {
      if (selectedCreators.length < 2) return;
      setStep('blend');
    } else if (step === 'blend') {
      setStep('complete');
      generateVoiceDNA();
    }
  };

  const handleBack = () => {
    if (step === 'blend') setStep('creators');
    if (step === 'complete') setStep('blend');
  };

  const generateVoiceDNA = async () => {
    setIsLoading(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create mock Voice DNA based on selections
    const mockVoiceDna = {
      id: generateId('vdn'),
      userId: 'user-coldstart',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      
      confidence: 0.65,
      postCount: 0,
      dateRange: {
        earliest: new Date().toISOString(),
        latest: new Date().toISOString(),
      },
      source: 'coldstart',
      
      tone: {
        professional: 0.25, conversational: 0.20, authoritative: 0.15,
        vulnerable: 0.10, humorous: 0.05, analytical: 0.15,
        inspirational: 0.05, contrarian: 0.05,
        primaryLabel: 'Balanced Professional',
        secondaryLabel: 'Analytical Thinker',
        description: 'Your tone balances professionalism with analytical depth.',
      },
      
      hooks: {
        framework: 0, contrarian: 0, story: 0, data: 0, question: 0,
        boldClaim: 0, listicle: 0, howTo: 0, caseStudy: 0, prediction: 0,
        topHooks: [],
      },
      pillars: [],
      formatPreference: {
        carousel: 20, singleImage: 15, video: 10, textOnly: 15,
        poll: 10, document: 10, article: 10,
        primary: 'carousel',
        engagementMultiplier: {
          carousel: 3.2, singleImage: 1.0, video: 2.1,
          textOnly: 0.7, poll: 1.4, document: 1.8, article: 1.2,
        },
      },
      postingRhythm: {
        dayDistribution: [0.1, 0.15, 0.2, 0.15, 0.15, 0.1, 0.15],
        hourDistribution: Array(24).fill(0).map((_, i) => i >= 8 && i <= 18 ? 0.05 : 0.01),
        postsPerWeek: 3,
        consistencyScore: 0.7,
        bestSlots: [
          { day: 2, hour: 8, score: 0.12 },
          { day: 4, hour: 9, score: 0.1 },
          { day: 0, hour: 19, score: 0.08 },
        ],
        nextOptimalSlot: {
          day: 2, hour: 8, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      },
      ctaStyle: {
        soft: 25, direct: 15, resource: 30, community: 15, challenge: 10,
        primary: 'resource',
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
        ],
        avgSentenceLength: 18,
        avgWordsPerPost: 180,
        fleschKincaidGrade: 11,
        emojiFrequency: 0.3,
        topEmojis: ['🚀', '💡', '📈', '🎯', '🔑'],
        avgHashtagsPerPost: 2.5,
        topHashtags: ['#sales', '#ai', '#leadership', '#growth', '#strategy'],
        usesBullets: true,
        usesNumberedLists: true,
        usesLineBreaks: true,
      },
      benchmarks: {
        avgImpressions: 1500,
        avgEngagementRate: 4.2,
        avgLikes: 63,
        avgComments: 8,
        avgShares: 4,
        topPostImpressions: 8500,
        topPostEngagementRate: 12.5,
        percentileRank: 65,
      },
      
      coldStart: {
        aspirationalCreators: CREATORS.filter(c => selectedCreators.includes(c.id)),
        rawIdeas: customIdeas
          .split('\n')
          .filter(line => line.trim().length > 0)
          .map(line => line.trim())
          .slice(0, 10),
        blendRatio: 0.7,
        generatedAt: new Date().toISOString(),
      },
    };
    
    // Save to sessionStorage for preview page
    sessionStorage.setItem('voice-dna-latest', JSON.stringify(mockVoiceDna));
    
    setIsLoading(false);
  };

  useEffect(() => {
    // Reset on mount
    setStep('creators');
    setSelectedCreators([]);
    setCustomIdeas('');
  }, []);

  if (step === 'creators') {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/voice-dna/upload" className="p-2 hover:bg-accent rounded-lg transition-colors">
              <ArrowRight className="h-5 w-5 text-muted-foreground rotate-180" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">Cold Start Mode</h1>
              <p className="text-sm text-muted-foreground">Get started with limited posting history</p>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="space-y-6">
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center h-16 w-16 bg-primary/10 text-primary rounded-full mb-6">
                  <Users className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Learn from Creators You Admire</h2>
                <p className="text-lg text-muted-foreground max-w-xl">
                  Select 2-5 creators whose style you want to blend with your emerging voice.
                  We'll use their patterns to bootstrap your Voice DNA analysis.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CREATORS.map(creator => (
                  <CreatorCard 
                    key={creator.id} 
                    creator={creator} 
                    selected={selectedCreators.includes(creator.id)}
                    onToggle={() => {
                      if (selectedCreators.includes(creator.id)) {
                        setSelectedCreators(selectedCreators.filter(id => id !== creator.id));
                      } else if (selectedCreators.length < 5) {
                        setSelectedCreators([...selectedCreators, creator.id]);
                      }
                    }}
                  />
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  {selectedCreators.length} of 5 selected
                </p>
                <button 
                  onClick={handleNext} 
                  disabled={selectedCreators.length < 2}
                  className="w-fit px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (step === 'blend') {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <button 
              onClick={handleBack} 
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <ArrowRight className="h-5 w-5 text-muted-foreground rotate-180" />
              Back
            </button>
            <div>
              <h1 className="text-xl font-bold">Blend Ratio</h1>
              <p className="text-sm text-muted-foreground">Balance your ideas with creator patterns</p>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-xl mx-auto">
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center h-16 w-16 bg-accent/10 text-accent rounded-full mb-6">
                  <Brain className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Set Your Influence Balance</h2>
                <p className="text-lg text-muted-foreground max-w-xl">
                  How much should we weigh your raw ideas vs. the creators you selected?
                  This determines how much your unique voice shapes the initial Voice DNA.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-1/3">
                    <label htmlFor="blend-slider" className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                      Your Ideas
                    </label>
                  </div>
                  <div className="w-1/3 flex items-center">
                    <input
                      id="blend-slider"
                      type="range"
                      min="0"
                      max="100"
                      value={70}
                      className="w-full h-2 bg-primary rounded"
                    />
                  </div>
                  <div className="w-1/3 text-right">
                    <label htmlFor="blend-slider" className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                      Creator Patterns
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <span className="text-lg font-mono">70% : 30%</span>
                </div>
                
                <p className="mt-4 text-sm text-muted-foreground text-center">
                  At 70/30, your Voice DNA will be 70% based on your input ideas and 30% 
      blended from the selected creators' patterns.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-3">
                  <label htmlFor="raw-ideas" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                    Your Raw Ideas (Optional)
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Add any content topics, hooks, or themes you want to explore.
                    One per line. We'll use these to seed your initial Voice DNA.
                  </p>
                  <textarea
                    id="raw-ideas"
                    placeholder="Examples:\n- How to build a personal brand on LinkedIn\n- Framework for B2B sales outreach\n- My journey from employee to entrepreneur\n- AI tools for content creators\n- Weekly learning share"
                    value={customIdeas}
                    onChange={(e) => setCustomIdeas(e.target.value)}
                    rows={6}
                    className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  />
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <button 
                    onClick={handleBack} 
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Back
                  </button>
                  <button 
                    onClick={handleNext} 
                    disabled={isLoading}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isLoading ? 'Generating...' : 'Create My Voice DNA'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/voice-dna/upload" className="p-2 hover:bg-accent rounded-lg transition-colors">
              <ArrowRight className="h-5 w-5 text-muted-foreground rotate-180" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">Voice DNA Created!</h1>
              <p className="text-sm text-muted-foreground">Your personalized profile is ready</p>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-xl mx-auto">
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center h-20 w-20 bg-primary/10 text-primary rounded-full mb-8">
                <Sparkles className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Your Voice DNA is Ready!</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Based on your selected creators and ideas, we've generated your initial Voice DNA profile.
                As you post more, this will evolve to truly reflect your unique style.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <StatPreview 
                    label="Confidence" 
                    value="65%" 
                    icon="🎯" 
                    description="Will grow as you add more posts"
                  />
                  <StatPreview 
                    label="Primary Tone" 
                    value="Balanced Professional" 
                    icon="🎨" 
                    description="Based on your creator blend"
                  />
                  <StatPreview 
                    label="Top Hook" 
                    value="Framework" 
                    icon="🎯" 
                    description="Most effective for engagement"
                  />
                  <StatPreview 
                    label="Suggested Format" 
                    value="Carousel" 
                    icon="📊" 
                    description="Highest performing format"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/voice-dna/preview" 
                  className="flex-1 px-5 py-3 bg-primary text-primary-foreground rounded-lg font-medium text-center hover:bg-primary/90 transition-colors"
                >
                  View My Voice DNA →
                </Link>
                <button 
                  onClick={() => window.location.href = '/voice-dna/upload'} 
                  className="flex-1 px-5 py-3 text-center"
                >
                  Add More Posts
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

function CreatorCard({ creator, selected, onToggle }: { 
  creator: typeof CREATORS[number]; 
  selected: boolean; 
  onToggle: () => void; 
}) {
  return (
    <div 
      className={cn(
        'p-4 bg-card border border-border rounded-xl cursor-pointer hover:border-primary/30 transition-colors',
        selected && 'border-primary bg-primary/5'
      )}
      onClick={onToggle}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="p-1 bg-primary/10 text-primary rounded-full">
            {creator.id === 'justin-welsh' ? <Brain /> : 
             creator.id === 'sahil-bloom' ? <Target /> : 
             creator.id === 'ali-abdaal' ? <TrendingUp /> : 
             creator.id === 'alex-hormozi' ? <Zap /> : 
             creator.id === 'linda-jiang' ? <Target /> : 
             <Sparkles />}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{creator.name}</h3>
          <p className="text-xs text-muted-foreground">{creator.handle}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">{creator.description}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {creator.hooks.map((hook: typeof CREATORS[0]['hooks'][number], i: number) => (
              <span key={i} className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                {hook}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-shrink-0 mt-2">
          {selected && (
            <span className="p-1 bg-primary text-primary-foreground rounded-full text-xs">
              ✓
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function StatPreview({ label, value, icon, description }: { 
  label: string; 
  value: string; 
  icon: string; 
  description: string; 
}) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <div>
          <p className="font-semibold">{label}</p>
          <p className="text-sm text-muted-foreground">{value}</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}