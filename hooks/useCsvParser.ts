// CSV Parser Hook
// Version: 1.0.0
// Last Updated: 2026-08-29

import { useState, useCallback } from 'react';
import { NormalizedPost } from '../types/voice-dna';

export function useCsvParser() {
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseCSV = useCallback((file: File): Promise<NormalizedPost[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          
          if (lines.length < 2) {
            reject(new Error('CSV file is empty or has no data rows'));
            return;
          }

          // Parse CSV (simplified - in production use PapaParse)
          const posts: NormalizedPost[] = [];
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const post: NormalizedPost = {
              id: `post-${i}`,
              text: values[1] || '',
              date: values[3] || new Date().toISOString().split('T')[0],
              engagement: parseFloat(values[4]) || 0,
              impressions: parseFloat(values[5]) || 0,
              likes: parseFloat(values[6]) || 0,
              comments: parseFloat(values[7]) || 0,
              shares: parseFloat(values[8]) || 0,
              format: values[9] || 'text',
              platform: values[10] || 'linkedin',
              tags: values[11] ? values[11].split(';').map(t => t.trim()) : []
            };
            posts.push(post);
          }

          resolve(posts);
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);

  return {
    isParsing,
    error,
    parseCSV,
    setIsParsing,
    setError
  };
}
