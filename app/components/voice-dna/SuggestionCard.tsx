// Suggestion Card Component
// Version: 1.0.0
// Last Updated: 2026-08-29

import React from 'react';
import { SmartSuggestion } from '@/types/voice-dna';

interface SuggestionCardProps {
  suggestion: SmartSuggestion;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion }) => {
  const typeColors: Record<string, string> = {
    repurpose: '#3b82f6',
    whitespace: '#10b981',
    reactive: '#f59e0b',
    series: '#8b5cf6'
  };

  return (
    <div style={{
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: '600' }}>{suggestion.title}</span>
        <span style={{
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '600',
          color: '#fff',
          backgroundColor: typeColors[suggestion.type] || '#6b7280'
        }}>
          {suggestion.type}
        </span>
      </div>
      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>{suggestion.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>Confidence: {Math.round(suggestion.confidence * 100)}%</span>
        <button style={{
          padding: '6px 16px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '600',
          color: '#fff',
          backgroundColor: '#3b82f6',
          border: 'none',
          cursor: 'pointer'
        }}>
          Generate
        </button>
      </div>
    </div>
  );
};

export default SuggestionCard;
