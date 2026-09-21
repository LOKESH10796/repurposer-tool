// Tone Radar Chart Component
// Version: 1.0.0
// Last Updated: 2026-08-29

import React from 'react';
import { ToneProfile } from '@/types/voice-dna';

interface ToneRadarProps {
  toneProfile: ToneProfile;
}

const ToneRadar: React.FC<ToneRadarProps> = ({ toneProfile }) => {
  const dimensions = Object.entries(toneProfile.dimensions);
  
  // Calculate radar chart points
  const points = dimensions.map(([key, value]) => ({
    key,
    value,
    x: Math.cos((key.charCodeAt(0) / dimensions.length) * 2 * Math.PI) * 100,
    y: Math.sin((key.charCodeAt(0) / dimensions.length) * 2 * Math.PI) * 100
  }));

  const outerPoints = points.map(p => ({
    ...p,
    x: p.x * 1.2,
    y: p.y * 1.2
  }));

  return (
    <svg width="300" height="300" viewBox="0 0 240 240">
      {/* Background grid */}
      <polygon points={outerPoints.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#e5e7eb" strokeWidth="1" />
      
      {/* Data points */}
      <polygon points={points.map(p => `${p.x},${p.y}`).join(' ')} fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="2" />
      
      {/* Labels */}
      {dimensions.map(([key, value]) => {
        const angle = (key.charCodeAt(0) / dimensions.length) * 2 * Math.PI;
        const labelX = 120 + Math.cos(angle) * 110;
        const labelY = 120 + Math.sin(angle) * 110;
        
        return (
          <text key={key} x={labelX} y={labelY} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#6b7280">
            {key}
          </text>
        );
      })}
    </svg>
  );
};

export default ToneRadar;
