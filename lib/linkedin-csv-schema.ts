/**
 * LinkedIn CSV Schema Validation
 * Zod schemas for validating LinkedIn data export CSVs
 */

import { z } from 'zod';

// Raw CSV row from LinkedIn Posts.csv export
export const LinkedInPostRowSchema = z.object({
  'Post URL': z.string().url().optional().or(z.literal('')),
  'Post Text': z.string().optional().or(z.literal('')),
  'Post Date': z.string().optional().or(z.literal('')),
  'Post Type': z
    .enum(['article', 'image', 'video', 'poll', 'document', 'shared', 'text'])
    .optional()
    .or(z.literal('')),
  Impressions: z.string().optional().or(z.literal('')),
  Likes: z.string().optional().or(z.literal('')),
  Comments: z.string().optional().or(z.literal('')),
  Shares: z.string().optional().or(z.literal('')),
  'Click-throughs': z.string().optional().or(z.literal('')),
  'Engagement Rate': z.string().optional().or(z.literal('')),
});

// More lenient schema for parsing (handles missing/extra columns)
export const LenientPostRowSchema = z.record(z.string());

export const LinkedInReactionRowSchema = z.object({
  'Reaction Type': z.string().optional().or(z.literal('')),
  'Post URL': z.string().optional().or(z.literal('')),
  Date: z.string().optional().or(z.literal('')),
});

export const LinkedInCommentRowSchema = z.object({
  'Comment Text': z.string().optional().or(z.literal('')),
  'Post URL': z.string().optional().or(z.literal('')),
  Date: z.string().optional().or(z.literal('')),
});

// Validation result types
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  stats: {
    totalRows: number;
    validRows: number;
    emptyRows: number;
    dateRange?: { earliest: Date; latest: Date };
  };
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
  value: unknown;
}

export interface ValidationWarning {
  row: number;
  field: string;
  message: string;
  value: unknown;
}

// Required columns for a valid LinkedIn Posts.csv
export const REQUIRED_COLUMNS = [
  'Post URL',
  'Post Text',
  'Post Date',
  'Post Type',
] as const;

export type RequiredColumn = typeof REQUIRED_COLUMNS[number];

export const OPTIONAL_COLUMNS = [
  'Impressions',
  'Likes',
  'Comments',
  'Shares',
  'Click-throughs',
  'Engagement Rate',
] as const;

export const ALL_EXPECTED_COLUMNS = [...REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS] as const;

// Column mapping for flexible matching (case-insensitive, fuzzy)
export const COLUMN_ALIASES: Record<string, string[]> = {
  'Post URL': ['post url', 'url', 'link', 'post link'],
  'Post Text': ['post text', 'text', 'content', 'post content', 'message'],
  'Post Date': ['post date', 'date', 'timestamp', 'created at', 'posted at'],
  'Post Type': ['post type', 'type', 'format', 'post format'],
  Impressions: ['impressions', 'views', 'reach', 'impression count'],
  Likes: ['likes', 'reactions', 'like count', 'reaction count'],
  Comments: ['comments', 'comment count', 'replies'],
  Shares: ['shares', 'reposts', 'share count', 'repost count'],
  'Click-throughs': ['click-throughs', 'clicks', 'click throughs', 'link clicks'],
  'Engagement Rate': ['engagement rate', 'engagement', 'engagement %'],
};

// Normalize column name for matching
export function normalizeColumnName(name: string): string {
  return name.trim().toLowerCase().replace(/[_\-\s]+/g, ' ');
}

// Find matching canonical column name
export function matchColumnName(input: string): string | null {
  const normalized = normalizeColumnName(input);
  
  // Exact match first
  for (const [canonical, aliases] of Object.entries(COLUMN_ALIASES)) {
    if (normalizeColumnName(canonical) === normalized) {
      return canonical;
    }
    if (aliases.some((alias) => normalizeColumnName(alias) === normalized)) {
      return canonical;
    }
  }
  
  return null;
}

// Validate and map CSV headers
export function validateHeaders(headers: string[]): {
  mapped: Record<string, string>; // original -> canonical
  missing: string[];
  extra: string[];
  valid: boolean;
} {
  const mapped: Record<string, string> = {};
  const missing: string[] = [...REQUIRED_COLUMNS];
  const extra: string[] = [];
  
  for (const header of headers) {
    const canonical = matchColumnName(header);
    if (canonical) {
      mapped[header] = canonical;
      const idx = missing.indexOf(canonical);
      if (idx !== -1) missing.splice(idx, 1);
    } else {
      extra.push(header);
    }
  }
  
  return {
    mapped,
    missing,
    extra,
    valid: missing.length === 0,
  };
}

// Parse and validate a single row
export function parsePostRow(
  row: Record<string, string>,
  rowIndex: number
): { data: Partial<LinkedInPostRow>; errors: ValidationError[]; warnings: ValidationWarning[] } {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const data: Partial<LinkedInPostRow> = {};
  
  // Helper to safely get value
  const getVal = (key: string): string => row[key]?.trim() ?? '';
  
  // Required fields
  const url = getVal('Post URL');
  if (!url) {
    errors.push({ row: rowIndex, field: 'Post URL', message: 'Missing post URL', value: url });
  } else if (!url.startsWith('http')) {
    warnings.push({ row: rowIndex, field: 'Post URL', message: 'URL may be invalid', value: url });
  }
  data['Post URL'] = url;
  
  const text = getVal('Post Text');
  if (!text) {
    warnings.push({ row: rowIndex, field: 'Post Text', message: 'Empty post text', value: text });
  }
  data['Post Text'] = text;
  
  const dateStr = getVal('Post Date');
  if (!dateStr) {
    errors.push({ row: rowIndex, field: 'Post Date', message: 'Missing post date', value: dateStr });
  } else {
    const parsed = parseLinkedInDate(dateStr);
    if (!parsed) {
      errors.push({ row: rowIndex, field: 'Post Date', message: 'Invalid date format', value: dateStr });
    }
  }
  data['Post Date'] = dateStr;
  
  const type = getVal('Post Type').toLowerCase();
  const validTypes = ['article', 'image', 'video', 'poll', 'document', 'shared', 'text'];
  if (!validTypes.includes(type)) {
    warnings.push({ row: rowIndex, field: 'Post Type', message: `Unknown type: ${type}`, value: type });
  }
  data['Post Type'] = type as LinkedInPostRow['Post Type'];
  
  // Optional numeric fields
  const numericFields = ['Impressions', 'Likes', 'Comments', 'Shares', 'Click-throughs'] as const;
  for (const field of numericFields) {
    const val = getVal(field);
    data[field] = val;
    if (val && isNaN(Number(val.replace(/,/g, '')))) {
      warnings.push({ row: rowIndex, field, message: 'Non-numeric value', value: val });
    }
  }
  
  // Engagement rate (can be percentage string)
  const engagementRate = getVal('Engagement Rate');
  data['Engagement Rate'] = engagementRate;
  if (engagementRate && !engagementRate.match(/^[\d.]+%?$/)) {
    warnings.push({ row: rowIndex, field: 'Engagement Rate', message: 'Unexpected format', value: engagementRate });
  }
  
  return { data, errors, warnings };
}

// Parse LinkedIn date formats
export function parseLinkedInDate(dateStr: string): Date | null {
  const formats = [
    // "2024-01-15 14:30:00"
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
    // "2024-01-15T14:30:00Z"
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z?$/,
    // "Jan 15, 2024"
    /^[A-Za-z]{3} \d{1,2}, \d{4}$/,
    // "01/15/2024"
    /^\d{2}\/\d{2}\/\d{4}$/,
    // "15/01/2024"
    /^\d{2}\/\d{2}\/\d{4}$/,
    // "2024-01-15"
    /^\d{4}-\d{2}-\d{2}$/,
  ];
  
  // Try direct parse first
  const direct = new Date(dateStr);
  if (!isNaN(direct.getTime())) return direct;
  
  // Try common LinkedIn formats
  for (const format of formats) {
    if (format.test(dateStr)) {
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) return parsed;
    }
  }
  
  // Try parsing with specific locale
  try {
    // "Jan 15, 2024, 2:30 PM"
    const withTime = new Date(dateStr.replace(/([A-Za-z]{3}) (\d{1,2}), (\d{4}),?/, '$1 $2, $3'));
    if (!isNaN(withTime.getTime())) return withTime;
  } catch {}
  
  return null;
}

// Normalize post type to canonical
export function normalizePostType(type: string): LinkedInPostRow['Post Type'] {
  const normalized = type.toLowerCase().trim();
  const mapping: Record<string, LinkedInPostRow['Post Type']> = {
    article: 'article',
    post: 'text',
    text: 'text',
    image: 'image',
    photo: 'image',
    video: 'video',
    poll: 'poll',
    document: 'document',
    pdf: 'document',
    shared: 'shared',
    reshare: 'shared',
    repost: 'shared',
  };
  
  return mapping[normalized] ?? 'text';
}

// Calculate engagement rate from raw numbers
export function calculateEngagementRate(
  impressions: number,
  likes: number,
  comments: number,
  shares: number
): number {
  if (impressions === 0) return 0;
  return ((likes + comments + shares) / impressions) * 100;
}

// Export types for consumers
export type LinkedInPostRow = z.infer<typeof LinkedInPostRowSchema>;
export type LinkedInReactionRow = z.infer<typeof LinkedInReactionRowSchema>;
export type LinkedInCommentRow = z.infer<typeof LinkedInCommentRowSchema>;