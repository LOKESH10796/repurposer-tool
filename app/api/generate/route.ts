import { NextRequest, NextResponse } from 'next/server';
import {
  GoogleGenerativeAI,
  GoogleGenerativeAIResponseError,
} from '@google/generative-ai';

// Parse comma-separated API keys from environment variable
function getApiKeys(): string[] {
  const rawKeys = process.env.GEMINI_API_KEY || '';
  const keys = rawKeys
    .split(',')
    .map((key) => key.trim())
    .filter((key) => key.length > 0);
  return keys;
}

// Exponential backoff delay in milliseconds
function getDelay(attempt: number): number {
  return Math.min(1000 * Math.pow(2, attempt), 10000); // max 10 seconds
}

// Sleep utility
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Extract HTTP status from various error types
function getErrorStatus(error: unknown): number | undefined {
  if (error instanceof GoogleGenerativeAIResponseError) {
    // ResponseError has .response.status (HTTP status code)
    return error.response?.status;
  }
  // Some errors may have a status property directly
  if (error && typeof error === 'object' && 'status' in error) {
    return (error as { status: number }).status;
  }
  return undefined;
}

// Extract error message from various error types
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

// Determine if an error is retryable (rate limits, server errors, network issues)
function isRetryableError(error: unknown): boolean {
  const status = getErrorStatus(error);

  // Retry on rate limits
  if (status === 429) return true;
  // Retry on server errors
  if (status && status >= 500) return true;
  // Retry on service unavailable
  if (status === 503) return true;

  // Check for network/timeout errors by message
  const msg = getErrorMessage(error).toLowerCase();
  if (msg.includes('timeout')) return true;
  if (msg.includes('network')) return true;
  if (msg.includes('econnrefused')) return true;
  if (msg.includes('econnreset')) return true;
  if (msg.includes('fetch') && !msg.includes('invalid')) return true;

  return false;
}

// Determine if error is specifically an invalid/expired API key
function isKeyError(error: unknown): boolean {
  const status = getErrorStatus(error);

  // 401 Unauthorized — invalid key
  if (status === 401) return true;
  // 403 Forbidden — key not authorized for this model/operation
  if (status === 403) return true;

  // Check for key-related error messages
  const msg = getErrorMessage(error).toLowerCase();
  if (msg.includes('api key') || msg.includes('apikey')) return true;
  if (msg.includes('invalid') && msg.includes('key')) return true;
  if (msg.includes('unauthorized')) return true;
  if (msg.includes('forbidden')) return true;
  if (msg.includes('permission denied')) return true;

  return false;
}

async function generateWithKey(
  apiKey: string,
  systemPrompt: string,
  content: string,
  maxRetries: number = 3
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 2048,
    },
  });

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(
        systemPrompt + '\n\nContent to repurpose:\n\n' + content
      );
      const response = await result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from Gemini API');
      }

      return text;
    } catch (error) {
      lastError = error;

      // If it's a key-specific error (invalid/expired key), don't retry on this key — propagate immediately
      if (isKeyError(error)) {
        throw error;
      }

      // If not retryable, propagate immediately
      if (!isRetryableError(error) || attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff before retry
      const delay = getDelay(attempt);
      console.warn(
        `Gemini API attempt ${attempt + 1} failed for key (last 8: ...${apiKey.slice(-8)}), retrying in ${delay}ms:`,
        getErrorMessage(error)
      );
      await sleep(delay);
    }
  }

  throw lastError;
}

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content || content.trim().length < 10) {
      return NextResponse.json(
        { error: 'Content is required and must be at least 10 characters' },
        { status: 400 }
      );
    }

    const apiKeys = getApiKeys();

    if (apiKeys.length === 0) {
      return NextResponse.json(
        { error: 'No GEMINI_API_KEY configured' },
        { status: 500 }
      );
    }

    const systemPrompt = `You are an elite ghostwriter. The user will provide raw content. Repurpose it into two things: 1) A highly engaging, punchy Twitter thread (3-5 tweets, use hooks). 2) A professional, insightful LinkedIn post with a strong hook and line breaks. Return ONLY a valid JSON object with two keys: 'twitterThread' (an array of strings) and 'linkedinPost' (a single string). Do not include markdown code blocks like \`\`\`json.`;

    let lastError: unknown = null;
    let text: string | null = null;

    // Try each API key in sequence until one succeeds
    for (let keyIndex = 0; keyIndex < apiKeys.length; keyIndex++) {
      const apiKey = apiKeys[keyIndex];
      const maskedKey = `...${apiKey.slice(-8)}`;

      try {
        console.log(`Attempting Gemini API call with key ${keyIndex + 1}/${apiKeys.length} (${maskedKey})`);
        text = await generateWithKey(apiKey, systemPrompt, content, 3);
        console.log(`Gemini API call succeeded with key ${keyIndex + 1}/${apiKeys.length} (${maskedKey})`);
        break; // Success — exit the key rotation loop
      } catch (error) {
        lastError = error;

        // If it's a key-specific error (invalid/expired key), try the next key
        if (isKeyError(error)) {
          console.warn(
            `API key ${keyIndex + 1}/${apiKeys.length} (${maskedKey}) is invalid or expired, rotating to next key:`,
            getErrorMessage(error)
          );
          continue;
        }

        // For non-key errors (rate limits, server errors, etc.), we still try the next key
        // as a different key might have a fresh quota
        console.warn(
          `Gemini API call failed with key ${keyIndex + 1}/${apiKeys.length} (${maskedKey}), rotating to next key:`,
          getErrorMessage(error)
        );
        continue;
      }
    }

    if (!text) {
      // All keys failed
      console.error('All Gemini API keys failed. Last error:', lastError);

      // Check if it was a key error to give better diagnostics
      const isKeyRelated = isKeyError(lastError);

      return NextResponse.json(
        {
          error: isKeyRelated
            ? 'All API keys are invalid or expired. Please check your GEMINI_API_KEY configuration.'
            : 'AI generation failed after exhausting all API keys and retries.',
          details: getErrorMessage(lastError),
        },
        { status: 502 }
      );
    }

    // Parse the AI response as JSON
    try {
      const parsed = JSON.parse(text);

      // Validate the response structure
      if (
        !parsed.twitterThread ||
        !Array.isArray(parsed.twitterThread) ||
        !parsed.linkedinPost ||
        typeof parsed.linkedinPost !== 'string'
      ) {
        return NextResponse.json(
          {
            error: 'AI response did not match expected schema. Please try again with different content.',
            rawResponse: text.substring(0, 500),
          },
          { status: 502 }
        );
      }

      return NextResponse.json({
        twitterThread: parsed.twitterThread,
        linkedinPost: parsed.linkedinPost,
      });
    } catch (e) {
      return NextResponse.json(
        {
          error: 'Failed to parse AI response as JSON',
          rawResponse: text.substring(0, 500),
        },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      {
        error: 'AI generation failed',
        details: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
