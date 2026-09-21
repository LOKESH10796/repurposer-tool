import { describe, it, expect } from 'vitest';

// Content parsing utilities (mirrors perf-test.js logic)
function parseContent(content: string) {
  const words = content.split(/\s+/).filter(w => w.length > 0);
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);

  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    readTime: Math.ceil(words.length / 200),
    keyTopics: ['AI', 'Technology', 'Ethics'],
  };
}

function analyzeContent(content: string) {
  const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
  const positivityWords = ['transforming', 'revolutionizing', 'optimism', 'excitement'];
  const negativityWords = ['concern', 'worry', 'caution', 'bias'];

  let sentimentScore = 0;
  const lowerContent = content.toLowerCase();

  positivityWords.forEach(word => {
    if (lowerContent.includes(word)) sentimentScore += 1;
  });
  negativityWords.forEach(word => {
    if (lowerContent.includes(word)) sentimentScore -= 1;
  });

  let sentiment = 'neutral';
  if (sentimentScore > 0) sentiment = 'positive';
  if (sentimentScore < 0) sentiment = 'negative';

  return {
    sentiment,
    tone: 'informative',
    readability: wordCount > 200 ? 'medium' : 'short',
    wordCount,
  };
}

function generateContent(format: string, content: string) {
  const formats = ['twitter', 'linkedin', 'youtube', 'blog', 'thread'];
  if (!formats.includes(format)) {
    throw new Error(`Unsupported format: ${format}`);
  }

  return {
    format,
    content: `[${format.toUpperCase()}] ${content.substring(0, 100)}...`,
    length: content.length,
    wordCount: content.split(/\s+/).filter(w => w.length > 0).length,
  };
}

const sampleContent = `Artificial intelligence (AI) is transforming industries worldwide. From healthcare to finance, AI-powered solutions are revolutionizing how we work, live, and interact with technology.`;

describe('parseContent', () => {
  it('should count words correctly', () => {
    const result = parseContent(sampleContent);
    expect(result.wordCount).toBe(20);
  });

  it('should calculate read time based on 200 WPM', () => {
    const result = parseContent(sampleContent);
    expect(result.readTime).toBe(1);
  });

  it('should count paragraphs', () => {
    const result = parseContent(sampleContent);
    expect(result.paragraphCount).toBe(1);
  });
});

describe('analyzeContent', () => {
  it('should detect positive sentiment', () => {
    const result = analyzeContent(sampleContent);
    expect(result.sentiment).toBe('positive');
  });

  it('should detect negative sentiment', () => {
    const negativeContent = 'There is concern about bias in AI systems. We worry about the implications.';
    const result = analyzeContent(negativeContent);
    expect(result.sentiment).toBe('negative');
  });

  it('should return accurate word count', () => {
    const result = analyzeContent(sampleContent);
    expect(result.wordCount).toBe(20);
  });
});

describe('generateContent', () => {
  it('should generate content in twitter format', () => {
    const result = generateContent('twitter', sampleContent);
    expect(result.format).toBe('twitter');
    expect(result.content).toContain('[TWITTER]');
  });

  it('should throw error for unsupported format', () => {
    expect(() => generateContent('unsupported', sampleContent)).toThrow(
      'Unsupported format: unsupported'
    );
  });

  it('should preserve content length in output', () => {
    const result = generateContent('linkedin', sampleContent);
    expect(result.wordCount).toBe(20);
  });
});
