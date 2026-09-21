// Hook Badge Component
// Version: 1.0.0
// Last Updated: 2026-08-29

import React from 'react';
import { HookType } from '@/types/voice-dna';

interface HookBadgeProps {
  hookType: HookType;
}

const hookColors: Record<HookType, string> = {
  framework: '#3b82f6',
  contrarian: '#ef4444',
  story: '#10b981',
  'data-driven': '#f59e0b',
  question: '#8b5cf6',
  'bold-claim': '#ec4899',
  listicle: '#06b6d4',
  'how-to': '#84cc16',
  'case-study': '#f97316',
  prediction: '#6366f1'
};

const HookBadge: React.FC<HookBadgeProps> = ({ hookType }) => {
  const color = hookColors[hookType] || '#6b7280';

  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#fff',
      backgroundColor: color
    }}>
      {hookType}
    </span>
  );
};

export default HookBadge;
