/**
 * Utility Functions
 * Shared helpers across the project
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with clsx
 * Handles conflicting classes correctly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

/**
 * Format percentage
 */
export function formatPercent(num: number, decimals = 1): string {
  return `${num.toFixed(decimals)}%`;
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  });
}

/**
 * Format time for display
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get day name from index (0 = Sunday)
 */
export function getDayName(dayIndex: number): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[dayIndex] || '';
}

/**
 * Get full day name
 */
export function getFullDayName(dayIndex: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex] || '';
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Generate unique ID
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Mean pool token embeddings to get sentence embedding
 */
export function meanPool(embeddings: number[][]): number[] {
  if (embeddings.length === 0) return [];
  const dim = embeddings[0].length;
  const result = new Array(dim).fill(0);
  
  for (const emb of embeddings) {
    for (let i = 0; i < dim; i++) {
      result[i] += emb[i];
    }
  }
  
  return result.map(v => v / embeddings.length);
}

/**
 * Simple K-means clustering (for browser use)
 */
export function kMeans(
  points: number[][],
  k: number,
  maxIterations = 100
): { centroids: number[]; assignments: number[] } {
  if (points.length === 0 || k <= 0) return { centroids: [], assignments: [] };
  if (points.length <= k) {
    return { centroids: points.map((_, i) => i), assignments: points.map((_, i) => i) };
  }
  
  const dim = points[0].length;
  
  // Initialize centroids (k-means++)
  const centroids: number[][] = [];
  centroids.push(points[Math.floor(Math.random() * points.length)]);
  
  while (centroids.length < k) {
    const distances = points.map(p => 
      Math.min(...centroids.map(c => 
        p.reduce((sum, val, i) => sum + (val - c[i]) ** 2, 0)
      ))
    );
    const totalDist = distances.reduce((a, b) => a + b, 0);
    let rand = Math.random() * totalDist;
    for (let i = 0; i < points.length; i++) {
      rand -= distances[i];
      if (rand <= 0) {
        centroids.push(points[i]);
        break;
      }
    }
  }
  
  const assignments = new Array(points.length).fill(0);
  
  for (let iter = 0; iter < maxIterations; iter++) {
    // Assign points to nearest centroid
    let changed = false;
    for (let i = 0; i < points.length; i++) {
      let bestDist = Infinity;
      let bestCentroid = 0;
      for (let c = 0; c < k; c++) {
        const dist = points[i].reduce((sum, val, d) => sum + (val - centroids[c][d]) ** 2, 0);
        if (dist < bestDist) {
          bestDist = dist;
          bestCentroid = c;
        }
      }
      if (assignments[i] !== bestCentroid) {
        assignments[i] = bestCentroid;
        changed = true;
      }
    }
    
    if (!changed) break;
    
    // Update centroids
    const counts = new Array(k).fill(0);
    const newCentroids = new Array(k).fill(0).map(() => new Array(dim).fill(0));
    
    for (let i = 0; i < points.length; i++) {
      const c = assignments[i];
      counts[c]++;
      for (let d = 0; d < dim; d++) {
        newCentroids[c][d] += points[i][d];
      }
    }
    
    for (let c = 0; c < k; c++) {
      if (counts[c] > 0) {
        for (let d = 0; d < dim; d++) {
          centroids[c][d] = newCentroids[c][d] / counts[c];
        }
      }
    }
  }
  
  return { centroids: centroids as any, assignments };
}

/**
 * Extract top keywords using TF-IDF (simplified)
 */
export function extractKeywords(
  documents: string[],
  maxKeywords = 10
): Array<{ term: string; score: number }> {
  // Simple term frequency across all documents
  const termFreq = new Map<string, number>();
  const docFreq = new Map<string, number>();
  const totalDocs = documents.length;
  
  for (const doc of documents) {
    const words = doc.toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3);
    
    const uniqueWords = new Set(words);
    
    for (const word of words) {
      termFreq.set(word, (termFreq.get(word) || 0) + 1);
    }
    for (const word of uniqueWords) {
      docFreq.set(word, (docFreq.get(word) || 0) + 1);
    }
  }
  
  // Calculate TF-IDF
  const tfidf = new Map<string, number>();
  for (const [term, tf] of termFreq) {
    const df = docFreq.get(term) || 1;
    const idf = Math.log(totalDocs / df);
    tfidf.set(term, tf * idf);
  }
  
  return Array.from(tfidf.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([term, score]) => ({ term, score }));
}

/**
 * Calculate Flesch-Kincaid Grade Level
 */
export function fleschKincaidGrade(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1;
  const words = text.trim().split(/\s+/).length || 1;
  const syllables = text.toLowerCase().match(/[aeiouy]+/g)?.length || words;
  
  return 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
}

/**
 * Get color for confidence level
 */
export function confidenceColor(confidence: number): string {
  if (confidence >= 0.7) return 'text-green-600 dark:text-green-400';
  if (confidence >= 0.4) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

export function confidenceLabel(confidence: number): string {
  if (confidence >= 0.7) return 'High';
  if (confidence >= 0.4) return 'Medium';
  return 'Learning';
}

export function confidenceBadgeClass(confidence: number): string {
  if (confidence >= 0.7) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  if (confidence >= 0.4) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
  return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Parse timezone offset for display
 */
export function getTimezoneAbbr(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}