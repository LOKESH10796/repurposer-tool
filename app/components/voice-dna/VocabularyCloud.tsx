/**
 * Vocabulary Cloud Components
 * Visualizes signature terms, emojis, hashtags, and writing patterns
 */

'use client';

import { cn } from '@/lib/utils';
import type { VocabularyStats } from '@/types/voice-dna';

interface VocabularyCloudProps {
  vocabulary: VocabularyStats;
  className?: string;
}

export function VocabularyCloud({ vocabulary, className }: VocabularyCloudProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Signature Terms */}
      <section>
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <span className="text-lg">🎯</span> Signature Terms
        </h4>
        <p className="text-sm text-muted-foreground mb-3">
          Words you use distinctively more than average LinkedIn creators
        </p>
        {vocabulary.signatureTerms.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {vocabulary.signatureTerms.map((term, idx) => (
              <SignatureTermChip key={idx} term={term} rank={idx + 1} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Upload more posts to detect signature terms</p>
        )}
      </section>

      {/* Emoji Usage */}
      <section>
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <span className="text-lg">😊</span> Emoji Patterns
        </h4>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{vocabulary.topEmojis.slice(0, 5).join(' ')}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {vocabulary.emojiFrequency.toFixed(1)} emojis/post · {vocabulary.topEmojis.length} unique
          </div>
        </div>
        {vocabulary.topEmojis.length > 5 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {vocabulary.topEmojis.slice(5).map((emoji, idx) => (
              <span key={idx} className="px-2 py-1 text-sm bg-muted rounded-full">{emoji}</span>
            ))}
          </div>
        )}
      </section>

      {/* Hashtags */}
      <section>
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <span className="text-lg">#️⃣</span> Top Hashtags
        </h4>
        <p className="text-sm text-muted-foreground mb-3">
          {vocabulary.avgHashtagsPerPost.toFixed(1)} hashtags per post on average
        </p>
        <div className="flex flex-wrap gap-2">
          {vocabulary.topHashtags.map((tag, idx) => (
            <HashtagChip key={tag} tag={tag} rank={idx + 1} />
          ))}
        </div>
      </section>

      {/* Writing Style Metrics */}
      <section>
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <span className="text-lg">📝</span> Writing Style
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StyleMetric 
            label="Avg Sentence" 
            value={`${vocabulary.avgSentenceLength} words`} 
            icon="📏"
            description="Sentence length"
          />
          <StyleMetric 
            label="Avg Post" 
            value={`${vocabulary.avgWordsPerPost} words`} 
            icon="📄"
            description="Post length"
          />
          <StyleMetric 
            label="Readability" 
            value={`Grade ${vocabulary.fleschKincaidGrade}`} 
            icon="👓"
            description="Flesch-Kincaid"
          />
          <StyleMetric 
            label="Structure" 
            value={formatStructure(vocabulary)} 
            icon="📐"
            description="Formatting patterns"
          />
        </div>
      </section>
    </div>
  );
}

function SignatureTermChip({ term, rank }: { term: VocabularyStats['signatureTerms'][0]; rank: number }) {
  const distinctiveness = Math.round(term.distinctiveness * 100);
  const freq = (term.frequency * 100).toFixed(2);
  
  return (
    <div className="group relative px-3 py-2 bg-muted/50 border border-border rounded-lg hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-medium">{term.term}</span>
        <span className="text-xs text-muted-foreground">{freq}%</span>
      </div>
      <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300"
          style={{ width: `${distinctiveness}%` }}
        />
      </div>
      <div className="absolute top-1 right-1 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        Distinct: {distinctiveness}%
      </div>
    </div>
  );
}

function HashtagChip({ tag, rank }: { tag: string; rank: number }) {
  const colors = [
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  ];
  
  return (
    <span className={cn(
      'px-3 py-1 text-sm font-medium rounded-full border',
      colors[rank % colors.length]
    )}>
      {tag}
    </span>
  );
}

function StyleMetric({ label, value, icon, description }: { label: string; value: string; icon: string; description: string }) {
  return (
    <div className="p-4 bg-muted/50 rounded-xl">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{icon}</span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function formatStructure(vocab: VocabularyStats): string {
  const parts = [];
  if (vocab.usesBullets) parts.push('Bullets');
  if (vocab.usesNumberedLists) parts.push('Numbered');
  if (vocab.usesLineBreaks) parts.push('Paragraphs');
  return parts.length > 0 ? parts.join(', ') : 'Plain text';
}

// Word cloud visualization (canvas-based)
export function WordCloud({ 
  terms, 
  width = 400, 
  height = 200 
}: { 
  terms: Array<{ term: string; weight: number }>; 
  width?: number; 
  height?: number; 
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isMounted || !canvasRef.current || terms.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Simple word cloud layout (spiral placement)
    const maxWeight = Math.max(...terms.map(t => t.weight));
    const placed: Array<{ x: number; y: number; w: number; h: number; term: string }> = [];
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    terms
      .sort((a, b) => b.weight - a.weight)
      .forEach(({ term, weight }) => {
        const fontSize = 12 + (weight / maxWeight) * 28;
        ctx.font = `${fontSize}px system-ui, sans-serif`;
        const metrics = ctx.measureText(term);
        const w = metrics.width + 10;
        const h = fontSize + 6;
        
        // Spiral placement
        let angle = 0;
        let radius = 0;
        const spiralStep = 0.3;
        const radiusStep = 2;
        let placed_ = false;
        let attempts = 0;
        
        while (!placed_ && attempts < 1000) {
          const x = centerX + radius * Math.cos(angle) - w / 2;
          const y = centerY + radius * Math.sin(angle) - h / 2;
          
          // Check collision
          const collision = placed.some(p => 
            x < p.x + p.w && x + w > p.x && y < p.y + p.h && y + h > p.y
          );
          
          if (!collision && x >= 0 && y >= 0 && x + w <= width && y + h <= height) {
            placed.push({ x, y, w, h, term });
            placed_ = true;
            
            // Draw
            const hue = 210 + (weight / maxWeight) * 60;
            ctx.fillStyle = `hsl(${hue}, 70%, 45%)`;
            ctx.fillRect(x, y, w, h);
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(term, x + w / 2, y + h / 2);
          }
          
          angle += spiralStep;
          radius += radiusStep;
          attempts++;
        }
      });
  }, [terms, width, height, isMounted]);

  return <canvas ref={canvasRef} width={width} height={height} className="w-full h-auto" />;
}

import React from 'react';