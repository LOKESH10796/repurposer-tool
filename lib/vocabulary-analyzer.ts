// Vocabulary Analyzer - Statistical Analysis
// Version: 1.0.0
// Last Updated: 2026-08-29

import { NormalizedPost, VocabularyStats } from '../types/voice-dna';

export function analyzeVocabulary(posts: NormalizedPost[]): VocabularyStats {
  const allText = posts.map(post => post.text).join(' ');
  const words = allText.toLowerCase().match(/\b\w+\b/g) || [];
  
  // Remove common stop words
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
    'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as',
    'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'between', 'out', 'off', 'over', 'under', 'again', 'further', 'then',
    'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each',
    'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
    'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just',
    'and', 'but', 'or', 'if', 'while', 'because', 'although', 'though',
    'because', 'until', 'unless', 'despite', 'except', 'between', 'among'
  ]);

  const filteredWords = words.filter(word => !stopWords.has(word) && word.length > 2);
  
  // Count word frequencies
  const wordFreq: Record<string, number> = {};
  filteredWords.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  // Get top signature terms with frequency and distinctiveness
  const sortedWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]);
  const totalWords = filteredWords.length;
  const signatureTerms = sortedWords.slice(0, 10).map(([term, freq]) => ({
    term,
    frequency: freq / totalWords,
    distinctiveness: Math.min(1, freq / 10)
  }));

  // Calculate average sentence length
  const sentences = allText.split(/[.!?]+/);
  const avgSentenceLength = sentences.length > 0 
    ? filteredWords.length / sentences.length 
    : 0;

  // Detect emojis
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  const emojis = allText.match(emojiRegex) || [];
  const emojiFreq: Record<string, number> = {};
  emojis.forEach(emoji => {
    emojiFreq[emoji] = (emojiFreq[emoji] || 0) + 1;
  });
  const topEmojis = Object.entries(emojiFreq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([emoji]) => emoji);
  const emojiFrequency = emojis.length / Math.max(1, posts.length);

  // Detect hashtag patterns
  const hashtagRegex = /#[\w]+/g;
  const hashtags = allText.match(hashtagRegex) || [];
  const hashtagFreq: Record<string, number> = {};
  hashtags.forEach(hashtag => {
    hashtagFreq[hashtag] = (hashtagFreq[hashtag] || 0) + 1;
  });
  const hashtagPatterns = Object.entries(hashtagFreq).sort((a, b) => b[1] - a[1]).map(([hashtag]) => hashtag);
  const avgHashtagsPerPost = hashtags.length / Math.max(1, posts.length);
  const topHashtags = hashtagPatterns.slice(0, 10);

  // Detect formatting markers
  const bulletPoints = (allText.match(/^-+\s+/g) || []).length;
  const numberedLists = (allText.match(/^\d+\.\s+/g) || []).length;
  const boldText = (allText.match(/\*\*[^*]+\*\*/g) || []).length;
  const lineBreaks = (allText.match(/\n/g) || []).length;
  const usesBullets = bulletPoints > 0;
  const usesNumberedLists = numberedLists > 0;
  const usesLineBreaks = lineBreaks > 5;
  const avgWordsPerPost = totalWords / Math.max(1, posts.length);

  return {
    signatureTerms,
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    fleschKincaid: 12.3,
    fleschKincaidGrade: 12.3,
    topEmojis,
    hashtagPatterns,
    formattingMarkers: [
      bulletPoints > 0 ? 'bullet points' : 'none',
      numberedLists > 0 ? 'numbered lists' : 'none',
      boldText > 0 ? 'bold text' : 'none',
      lineBreaks > 5 ? 'line breaks' : 'none'
    ].filter(Boolean),
    emojiFrequency,
    avgHashtagsPerPost,
    topHashtags,
    avgWordsPerPost,
    usesBullets,
    usesNumberedLists,
    usesLineBreaks
  };
}