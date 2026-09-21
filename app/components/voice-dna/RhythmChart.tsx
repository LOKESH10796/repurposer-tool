// Rhythm Chart Component - Posting Rhythm Heatmap
// Version: 1.0.0
// Last Updated: 2026-08-29

import React from 'react';
import { RhythmSlot } from '@/types/voice-dna';

interface RhythmChartProps {
  rhythm: RhythmSlot[];
}

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const RhythmChart: React.FC<RhythmChartProps> = ({ rhythm }) => {
  const maxEngagement = Math.max(...rhythm.map(r => r.engagement), 1);
  
  const heatmapCells = [];
  
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const slot = rhythm.find(r => r.dayOfWeek === day && r.hour === hour);
      const engagement = slot?.engagement || 0;
      const intensity = engagement / maxEngagement;
      
      if (engagement > 0) {
        heatmapCells.push(
          <div key={`${day}-${hour}`} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 4px',
            fontSize: '10px',
            color: '#fff',
            backgroundColor: `rgba(59, 130, 246, ${Math.min(intensity, 0.8)})`,
            borderRadius: '2px',
            minWidth: '30px'
          }}>
            <span>{dayLabels[day]}</span>
            <span>{hour}:00</span>
          </div>
        );
      }
    }
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px', textAlign: 'left', fontSize: '12px', color: '#6b7280' }}>Time</th>
            {dayLabels.map(day => (
              <th key={day} style={{ padding: '8px', textAlign: 'center', fontSize: '12px', color: '#6b7280', width: '50px' }}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 24 }, (_, hour) => (
            <tr key={hour}>
              <td style={{ padding: '4px 8px', fontSize: '12px', color: '#6b7280' }}>{hour}:00</td>
              {Array.from({ length: 7 }, (_, day) => {
                const slot = rhythm.find(r => r.dayOfWeek === day && r.hour === hour);
                const engagement = slot?.engagement || 0;
                
                return (
                  <td key={day} style={{ padding: '4px' }}>
                    {engagement > 0 ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 4px',
                        fontSize: '10px',
                        color: '#fff',
                        backgroundColor: `rgba(59, 130, 246, ${Math.min(engagement / maxEngagement, 0.8)})`,
                        borderRadius: '2px',
                        minWidth: '30px'
                      }}>
                        <span>{dayLabels[day]}</span>
                        <span>{hour}:00</span>
                      </div>
                    ) : (
                      <div style={{ padding: '4px', fontSize: '10px', color: '#d1d5db' }}>-</div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RhythmChart;
