// Pillar Card Component
// Version: 1.0.0
// Last Updated: 2026-08-29

import React from 'react';
import { Pillar } from '@/types/voice-dna';

interface PillarCardProps {
  pillar: Pillar;
}

const PillarCard: React.FC<PillarCardProps> = ({ pillar }) => {
  const trendColor = pillar.trend === 'up' ? '#10b981' : pillar.trend === 'down' ? '#ef4444' : '#6b7280';

  return (
    <div style={{
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: '600' }}>{pillar.label}</span>
        <span style={{ fontSize: '14px', fontWeight: '600', color: trendColor }}>{pillar.percentage}%</span>
      </div>
      <div style={{ width: '100%', height: '6px', borderRadius: '3px', backgroundColor: '#e5e7eb' }}>
        <div style={{
          width: `${pillar.percentage}%`,
          height: '100%',
          borderRadius: '3px',
          backgroundColor: '#3b82f6'
        }} />
      </div>
      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
        Trend: {pillar.trend === 'up' ? '↑' : pillar.trend === 'down' ? '↓' : '→'}
      </div>
    </div>
  );
};

export default PillarCard;
