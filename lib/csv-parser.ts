/**
 * CSV Parser Utility
 * Wrapper around PapaParse with streaming, validation, and progress callbacks
 */

import Papa from 'papaparse';
import type {
  LinkedInPostRow,
  NormalizedPost,
} from '@/types/voice-dna';
import type {
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from '@/lib/linkedin-csv-schema';
import {
  validateHeaders,
  parsePostRow,
  parseLinkedInDate,
  normalizePostType,
  calculateEngagementRate,
  ALL_EXPECTED_COLUMNS,
} from '@/lib/linkedin-csv-schema';

// Parse options
export interface ParseOptions {
  // Callbacks
  onProgress?: (progress: { stage: string; processed: number; total: number; percentage: number }) => void;
  onRow?: (row: NormalizedPost, index: number) => void;
  onComplete?: (results: NormalizedPost[]) => void;
  onError?: (error: Error) => void;
  
  // Limits
  maxRows?: number;
  skipEmptyRows?: boolean;
  
  // Preview mode (first N rows only)
  preview?: number;
}

// Parse result
export interface ParseResult {
  posts: NormalizedPost[];
  validation: ValidationResult;
  errors: Error[];
}

// Streaming parser for large files
export function createStreamingParser(options: ParseOptions = {}) {
  const {
    onProgress,
    onRow,
    onComplete,
    onError,
    maxRows = 10000,
    skipEmptyRows = true,
    preview,
  } = options;

  let processed = 0;
  let total = 0;
  const posts: NormalizedPost[] = [];
  const validationErrors: ValidationError[] = [];
  const validationWarnings: ValidationWarning[] = [];
  let headersValidated = false;
  let headerMap: Record<string, string> = {};

  return Papa.parse<Record<string, string>>('', {
    download: false,
    header: true,
    skipEmptyLines: skipEmptyRows ? 'greedy' : false,
    preview: preview || 0,
    step: (results, parser) => {
      // First row = headers
      if (!headersValidated) {
        const headerValidation = validateHeaders(results.meta.fields || []);
        headerMap = headerValidation.mapped;
        
        if (!headerValidation.valid) {
          parser.abort();
          const error = new Error(
            `Missing required columns: ${headerValidation.missing.join(', ')}`
          );
          onError?.(error);
          return;
        }
        
        headersValidated = true;
        total = preview || maxRows; // Will be updated on complete
        return;
      }

      // Check row limit
      if (processed >= maxRows) {
        parser.abort();
        return;
      }

      // Map row using header map
      const mappedRow: Record<string, string> = {};
      for (const [original, canonical] of Object.entries(headerMap)) {
        mappedRow[canonical] = results.data[original] ?? '';
      }

      // Parse and validate row
      const { data, errors, warnings } = parsePostRow(mappedRow, processed + 1);
      
      validationErrors.push(...errors);
      validationWarnings.push(...warnings);

      // Skip rows with critical errors
      if (errors.some(e => e.field === 'Post Date' || e.field === 'Post URL')) {
        processed++;
        onProgress?.({
          stage: 'parsing',
          processed,
          total,
          percentage: Math.round((processed / total) * 100),
        });
        return;
      }

      // Normalize the post
      const normalized = normalizePost(data, processed);
      posts.push(normalized);
      
      if (onRow) onRow(normalized, processed);

      processed++;
      
      onProgress?.({
        stage: 'parsing',
        processed,
        total,
        percentage: Math.round((processed / total) * 100),
      });
    },
    complete: (results) => {
      total = processed;
      onProgress?.({
        stage: 'complete',
        processed,
        total,
        percentage: 100,
      });
      
      const validation: ValidationResult = {
        valid: validationErrors.length === 0,
        errors: validationErrors,
        warnings: validationWarnings,
        stats: {
          totalRows: results.meta.fields ? processed + 1 : 0, // +1 for header
          validRows: posts.length,
          emptyRows: results.data.filter((r: any) => Object.values(r).every(v => !v)).length,
          dateRange: posts.length > 0 ? {
            earliest: new Date(Math.min(...posts.map(p => p.timestamp?.getTime() ?? 0))),
            latest: new Date(Math.max(...posts.map(p => p.timestamp?.getTime() ?? 0))),
          } : undefined,
        },
      };

      onComplete?.(posts);
    },
    error: (error: Error) => {
      onError?.(error);
    },
  });
}

// Synchronous parse for smaller files / preview
export function parseCSVSync(
  csvText: string,
  options: ParseOptions = {}
): ParseResult {
  const {
    maxRows = 10000,
    skipEmptyRows = true,
    preview,
  } = options;

  const posts: NormalizedPost[] = [];
  const validationErrors: ValidationError[] = [];
  const validationWarnings: ValidationWarning[] = [];

  // Parse with PapaParse
  const parseResult = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: skipEmptyRows ? 'greedy' : false,
    preview: preview || 0,
  });

  if (parseResult.errors.length > 0) {
    // PapaParse parsing errors (malformed CSV)
    const errors = parseResult.errors.map(e => new Error(`${e.type}: ${e.message} at row ${e.row}`));
    return { posts: [], validation: emptyValidation(), errors };
  }

  // Validate headers
  const headerValidation = validateHeaders(parseResult.meta.fields || []);
  
  if (!headerValidation.valid) {
    return {
      posts: [],
      validation: {
        valid: false,
        errors: headerValidation.missing.map((field, i) => ({
          row: 0,
          field,
          message: `Missing required column: ${field}`,
          value: null,
        })),
        warnings: [],
        stats: { totalRows: 0, validRows: 0, emptyRows: 0 },
      },
      errors: [new Error(`Missing required columns: ${headerValidation.missing.join(', ')}`)],
    };
  }

  // Process rows
  const rowsToProcess = preview ? Math.min(preview, parseResult.data.length) : 
                        Math.min(maxRows, parseResult.data.length);

  for (let i = 0; i < rowsToProcess; i++) {
    const row = parseResult.data[i];
    
    // Map columns
    const mappedRow: Record<string, string> = {};
    for (const [original, canonical] of Object.entries(headerValidation.mapped)) {
      mappedRow[canonical] = row[original] ?? '';
    }

    // Parse row
    const { data, errors, warnings } = parsePostRow(mappedRow, i + 1);
    validationErrors.push(...errors);
    validationWarnings.push(...warnings);

    // Skip rows with critical errors
    if (errors.some(e => e.field === 'Post Date' || e.field === 'Post URL')) {
      continue;
    }

    // Normalize
    const normalized = normalizePost(data, i);
    posts.push(normalized);
  }

  // Calculate date range
  let dateRange: { earliest: Date; latest: Date } | undefined;
  if (posts.length > 0) {
    const timestamps = posts.map(p => p.timestamp?.getTime() ?? 0);
    dateRange = {
      earliest: new Date(Math.min(...timestamps)),
      latest: new Date(Math.max(...timestamps)),
    };
  }

  return {
    posts,
    validation: {
      valid: validationErrors.length === 0,
      errors: validationErrors,
      warnings: validationWarnings,
      stats: {
        totalRows: parseResult.data.length,
        validRows: posts.length,
        emptyRows: parseResult.data.filter(r => Object.values(r).every(v => !v)).length,
        dateRange,
      },
    },
    errors: validationErrors.length > 0 ? [new Error(`${validationErrors.length} validation errors`)] : [],
  };
}

// Normalize raw parsed data to NormalizedPost
function normalizePost(data: Record<string, string>, index: number): NormalizedPost {
  const text = data['Post Text'] ?? '';
  const timestamp = parseLinkedInDate(data['Post Date'] ?? '') ?? new Date();
  const type = normalizePostType(data['Post Type'] ?? 'text');
  
  const impressions = parseNumber(data['Impressions']);
  const likes = parseNumber(data['Likes']);
  const comments = parseNumber(data['Comments']);
  const shares = parseNumber(data['Shares']);
  const clickThroughs = parseNumber(data['Click-throughs']);
  
  const engagementRate = data['Engagement Rate'] 
    ? parsePercentage(data['Engagement Rate'])
    : calculateEngagementRate(impressions, likes, comments, shares);

  // Extract entities
  const hashtags = extractHashtags(text);
  const mentions = extractMentions(text);
  const emojis = extractEmojis(text);
  
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const engagement = likes + comments + shares;
  const date = timestamp ? timestamp.toISOString() : new Date().toISOString();
  const format = type || 'text';
  const platform = 'linkedin';
  const tags = hashtags;
  
  const post: NormalizedPost = {
    id: `post-${index}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    url: data['Post URL'] ?? '',
    text,
    date,
    timestamp,
    engagement,
    impressions,
    likes,
    comments,
    shares,
    format,
    platform,
    tags,
    clickThroughs,
    engagementRate,
    wordCount,
    hashtags,
    mentions,
    emojis,
    hasLink: text.includes('http'),
    hasImage: type === 'image',
    hasVideo: type === 'video',
    hasDocument: type === 'document',
  };
  return post;
}

// Helper: Parse number with comma handling
function parseNumber(val: string | undefined): number {
  if (!val) return 0;
  const cleaned = val.replace(/,/g, '').trim();
  const num = Number(cleaned);
  return isNaN(num) ? 0 : num;
}

// Helper: Parse percentage string
function parsePercentage(val: string): number {
  const cleaned = val.replace('%', '').trim();
  const num = Number(cleaned);
  return isNaN(num) ? 0 : num;
}

// Helper: Extract hashtags
function extractHashtags(text: string): string[] {
  const matches = text.match(/#[\p{L}\p{N}_]+/gu);
  return matches ? matches.map(h => h.slice(1).toLowerCase()) : [];
}

// Helper: Extract mentions
function extractMentions(text: string): string[] {
  const matches = text.match(/@[\p{L}\p{N}_]+/gu);
  return matches ? matches.map(m => m.slice(1).toLowerCase()) : [];
}

// Helper: Extract emojis
function extractEmojis(text: string): string[] {
  const matches = text.match(/\p{Emoji}/gu);
  return matches || [];
}

// Empty validation result
function emptyValidation(): ValidationResult {
  return {
    valid: false,
    errors: [],
    warnings: [],
    stats: { totalRows: 0, validRows: 0, emptyRows: 0 },
  };
}

// Generate a template CSV for users
export function generateTemplateCSV(): string {
  const headers = ALL_EXPECTED_COLUMNS.join(',');
  const sampleRow = [
    'https://linkedin.com/posts/example-123',
    'Just shipped a new feature! 🚀 Building in public has been the best decision for our startup. The feedback loop with users is incredible. #buildinpublic #startup #saas',
    '2024-01-15 14:30:00',
    'text',
    '12500',
    '342',
    '28',
    '15',
    '120',
    '3.08',
  ].map(v => `"${v}"`).join(',');
  
  return `${headers}\n${sampleRow}`;
}

// Parse multiple CSV files (Posts + Reactions + Comments)
export async function parseLinkedInExport(files: {
  posts: File;
  reactions?: File;
  comments?: File;
}): Promise<{
  posts: NormalizedPost[];
  reactions: any[];
  comments: any[];
  validation: ValidationResult;
}> {
  // Parse posts (required)
  const postsText = await readFileAsText(files.posts);
  const postsResult = parseCSVSync(postsText);
  
  // Parse reactions (optional)
  let reactions: any[] = [];
  if (files.reactions) {
    const reactionsText = await readFileAsText(files.reactions);
    const reactionsResult = Papa.parse(reactionsText, { header: true });
    reactions = reactionsResult.data;
  }
  
  // Parse comments (optional)
  let comments: any[] = [];
  if (files.comments) {
    const commentsText = await readFileAsText(files.comments);
    const commentsResult = Papa.parse(commentsText, { header: true });
    comments = commentsResult.data;
  }
  
  return {
    posts: postsResult.posts,
    reactions,
    comments,
    validation: postsResult.validation,
  };
}

// Read File as text
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// Estimate processing time
export function estimateProcessingTime(postCount: number): { 
  parseMs: number; 
  extractMs: number; 
  totalMs: number;
  humanReadable: string;
} {
  // Rough estimates based on benchmarks
  const parseMs = postCount * 0.5; // 0.5ms per row
  const extractMs = postCount * 2; // 2ms per row for NLP
  const totalMs = parseMs + extractMs + 500; // 500ms overhead
  
  let humanReadable: string;
  if (totalMs < 1000) {
    humanReadable = '< 1 second';
  } else if (totalMs < 60000) {
    humanReadable = `${Math.round(totalMs / 1000)} seconds`;
  } else {
    humanReadable = `${Math.round(totalMs / 60000)} minutes`;
  }
  
  return { parseMs, extractMs, totalMs, humanReadable };
}