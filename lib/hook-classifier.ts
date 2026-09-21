// Hook Classifier - Rule-based + Zero-shot classification
// Version: 1.0.0
// Last Updated: 2026-08-29

import { NormalizedPost, HookType, HookDistribution } from '../types/voice-dna';

export function classifyHooks(posts: NormalizedPost[]): HookDistribution[] {
  const hookPatterns: Record<HookType, RegExp[]> = {
    framework: [
      /\b(step|framework|method|process|system|approach)\b/i,
      /\bhow to\b/i,
      /\b5 (ways|tips|strategies)\b/i
    ],
    contrarian: [
      /\bI used to think\b/i,
      /\bactually\b/i,
      /\bnot\b/i,
      /\bwrong\b/i
    ],
    story: [
      /\bI (learned|discovered|found)\b/i,
      /\bmy (journey|experience)\b/i,
      /\bwhen I\b/i
    ],
    'data-driven': [
      /\b(\d+)%\b/i,
      /\bdata shows\b/i,
      /\baccording to\b/i,
      /\bstudy\b/i
    ],
    question: [
      /\bWhat\b/i,
      /\bHow\b/i,
      /\bWhy\b/i,
      /\bWhen\b/i
    ],
    'bold-claim': [
      /\bwill\b/i,
      /\bcan\b/i,
      /\bmust\b/i,
      /\bnever\b/i
    ],
    listicle: [
      /\b(\d+)\s+(ways|tips|reasons|things)\b/i,
      /\btop\s+\d+\b/i
    ],
    'how-to': [
      /\bhow to\b/i,
      /\bways to\b/i,
      /\bguide\b/i
    ],
    'case-study': [
      /\bcase study\b/i,
      /\bI (built|created|launched)\b/i,
      /\bresult\b/i
    ],
    prediction: [
      /\bwill\b/i,
      /\bgoing to\b/i,
      /\bnext year\b/i,
      /\b2026\b/i
    ]
  };

  const distributions: HookDistribution[] = Object.entries(hookPatterns).map(([hookType, patterns]) => {
    let count = 0;
    
    posts.forEach(post => {
      patterns.forEach(pattern => {
        if (pattern.test(post.text)) {
          count++;
        }
      });
    });

    const percentage = posts.length > 0 ? (count / posts.length) * 100 : 0;
    
    // Create topHooks array (simplified for now - just the current hook type)
    const topHooks = [{
      type: hookType as HookType,
      percentage,
      label: hookType
    }];
    
    return {
      hookType: hookType as HookType,
      count,
      percentage,
      topHooks
    };
  });

  return distributions.sort((a, b) => b.percentage - a.percentage);
}
