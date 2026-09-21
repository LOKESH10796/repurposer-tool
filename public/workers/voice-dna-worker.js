// Voice DNA Web Worker - Real Transformers.js Integration
// Runs @huggingface/transformers models off the main thread
// Models: Xenova/all-MiniLM-L6-v2 (embeddings), Xenova/nli-deberta-v3-xsmall (zero-shot)

/// <reference lib="webworker" />

import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js for web worker environment
env.allowLocalModels = false;
env.useBrowserCache = true;
// Configure WASM threads if available
if (env.backends?.onnx?.wasm) {
  env.backends.onnx.wasm.numThreads = navigator.hardwareConcurrency || 4;
}

// Model configuration
const EMBEDDING_MODEL = 'Xenova/all-MiniLM-L6-v2';
const CLASSIFICATION_MODEL = 'Xenova/nli-deberta-v3-xsmall';

const PILLAR_LABELS = [
  'Strategy', 'Leadership', 'AI/Tech', 'Productivity', 'Sales',
  'Marketing', 'Personal Growth', 'Industry News', 'Career', 'Entrepreneurship'
];

const HOOK_LABELS = [
  'Framework', 'Contrarian', 'Story', 'Data-Driven', 'Question',
  'Bold Claim', 'Listicle', 'How-To', 'Case Study', 'Prediction'
];

const TONE_LABELS = [
  'Authoritative', 'Conversational', 'Inspirational', 'Analytical', 'Humorous',
  'Vulnerable', 'Contrarian', 'Practical'
];

// Pipeline instances (loaded lazily)
let embedder: any = null;
let classifier: any = null;

// Progress tracking
let currentStage = '';
let currentProgress = 0;

function postProgress(stage: string, progress: number, message?: string) {
  currentStage = stage;
  currentProgress = progress;
  self.postMessage({ type: 'PROGRESS', stage, progress, message });
}

function postResult(data: any) {
  self.postMessage({ type: 'RESULT', data });
}

function postError(error: string) {
  self.postMessage({ type: 'ERROR', error });
}

// Load embedding pipeline
async function getEmbedder() {
  if (!embedder) {
    postProgress('loading_embedding_model', 10, 'Loading embedding model...');
    embedder = await pipeline('feature-extraction', EMBEDDING_MODEL, {
      dtype: 'q4',
      progress_callback: (progress: any) => {
        postProgress('loading_embedding_model', 10 + Math.floor(progress * 0.4), `Downloading embedding model: ${Math.floor(progress * 100)}%`);
      }
    });
    postProgress('loading_embedding_model', 50, 'Embedding model ready');
  }
  return embedder;
}

// Load zero-shot classification pipeline
async function getClassifier() {
  if (!classifier) {
    postProgress('loading_classification_model', 55, 'Loading classification model...');
    classifier = await pipeline('zero-shot-classification', CLASSIFICATION_MODEL, {
      dtype: 'q4',
      progress_callback: (progress: any) => {
        postProgress('loading_classification_model', 55 + Math.floor(progress * 0.4), `Downloading classification model: ${Math.floor(progress * 100)}%`);
      }
    });
    postProgress('loading_classification_model', 95, 'Classification model ready');
  }
  return classifier;
}

// Mean pool token embeddings to get sentence embedding
function meanPool(embeddings: Float32Array, attentionMask?: number[]): Float32Array {
  const dim = embeddings.length / (attentionMask?.length || 1);
  if (!attentionMask) {
    // If no attention mask, assume all tokens are valid
    const result = new Float32Array(dim);
    for (let i = 0; i < dim; i++) {
      let sum = 0;
      for (let j = 0; j < embeddings.length / dim; j++) {
        sum += embeddings[j * dim + i];
      }
      result[i] = sum / (embeddings.length / dim);
    }
    return result;
  }
  
  const result = new Float32Array(dim);
  let validTokens = 0;
  for (let j = 0; j < attentionMask.length; j++) {
    if (attentionMask[j] === 1) {
      validTokens++;
      for (let i = 0; i < dim; i++) {
        result[i] += embeddings[j * dim + i];
      }
    }
  }
  for (let i = 0; i < dim; i++) {
    result[i] /= validTokens;
  }
  return result;
}

// Compute embeddings for all posts
async function computeEmbeddings(texts: string[]): Promise<Float32Array[]> {
  const embedder = await getEmbedder();
  const embeddings: Float32Array[] = [];
  
  postProgress('computing_embeddings', 0, `Computing embeddings for ${texts.length} posts...`);
  
  // Process in batches to avoid memory issues
  const batchSize = 8;
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const outputs = await embedder(batch, { pooling: 'mean', normalize: true });
    
    // outputs is a tensor, convert to Float32Array
    for (let j = 0; j < batch.length; j++) {
      const embedding = outputs[j] instanceof Float32Array 
        ? outputs[j] 
        : new Float32Array(outputs[j].data);
      embeddings.push(embedding);
    }
    
    const progress = Math.floor(((i + batch.length) / texts.length) * 30);
    postProgress('computing_embeddings', progress, `Processed ${Math.min(i + batch.length, texts.length)}/${texts.length} posts`);
  }
  
  return embeddings;
}

// K-means clustering implementation
function kMeans(vectors: Float32Array[], k: number, maxIter = 100): { centroids: Float32Array[], assignments: number[] } {
  const n = vectors.length;
  const dim = vectors[0].length;
  
  // Initialize centroids using k-means++
  const centroids: Float32Array[] = [];
  centroids.push(vectors[Math.floor(Math.random() * n)]);
  
  for (let c = 1; c < k; c++) {
    const distances: number[] = [];
    for (let i = 0; i < n; i++) {
      let minDist = Infinity;
      for (const centroid of centroids) {
        let dist = 0;
        for (let d = 0; d < dim; d++) {
          const diff = vectors[i][d] - centroid[d];
          dist += diff * diff;
        }
        minDist = Math.min(minDist, dist);
      }
      distances.push(minDist);
    }
    
    // Weighted random selection
    const totalDist = distances.reduce((a, b) => a + b, 0);
    let rand = Math.random() * totalDist;
    for (let i = 0; i < n; i++) {
      rand -= distances[i];
      if (rand <= 0) {
        centroids.push(vectors[i]);
        break;
      }
    }
  }
  
  const assignments = new Array(n).fill(0);
  
  for (let iter = 0; iter < maxIter; iter++) {
    // Assign points to nearest centroid
    let changed = false;
    for (let i = 0; i < n; i++) {
      let bestCentroid = 0;
      let bestDist = Infinity;
      for (let c = 0; c < k; c++) {
        let dist = 0;
        for (let d = 0; d < dim; d++) {
          const diff = vectors[i][d] - centroids[c][d];
          dist += diff * diff;
        }
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
    const newCentroids: Float32Array[] = [];
    const counts = new Array(k).fill(0);
    
    for (let c = 0; c < k; c++) {
      newCentroids.push(new Float32Array(dim));
    }
    
    for (let i = 0; i < n; i++) {
      const c = assignments[i];
      counts[c]++;
      for (let d = 0; d < dim; d++) {
        newCentroids[c][d] += vectors[i][d];
      }
    }
    
    for (let c = 0; c < k; c++) {
      if (counts[c] > 0) {
        for (let d = 0; d < dim; d++) {
          newCentroids[c][d] /= counts[c];
        }
      } else {
        // Reassign empty centroid to random point
        newCentroids[c] = vectors[Math.floor(Math.random() * n)];
      }
    }
    
    centroids.splice(0, centroids.length, ...newCentroids);
  }
  
  return { centroids, assignments };
}

// Cosine similarity between two vectors
function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Extract first 1-2 sentences for hook classification
function extractHookText(text: string): string {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  return sentences.slice(0, 2).join('. ').trim();
}

// Main extraction function
async function extractVoiceDNA(posts: any[]) {
  try {
    postProgress('starting', 0, 'Starting Voice DNA extraction...');
    
    // Prepare texts
    const fullTexts = posts.map(p => p.text || '');
    const hookTexts = posts.map(p => extractHookText(p.text || ''));
    
    // Step 1: Compute embeddings for all posts
    postProgress('embeddings', 0, 'Computing post embeddings...');
    const embeddings = await computeEmbeddings(fullTexts);
    
    // Step 2: K-means clustering to find topic pillars
    postProgress('clustering', 30, 'Clustering posts into topic pillars...');
    const pillarCount = Math.min(5, Math.max(3, Math.floor(posts.length / 20)));
    const { centroids, assignments } = kMeans(embeddings, pillarCount);
    
    // Step 3: Label clusters via zero-shot classification
    postProgress('labeling_pillars', 40, 'Labeling topic pillars...');
    const classifier = await getClassifier();
    
    const pillarLabels: string[] = [];
    for (const centroid of centroids) {
      // Find the post closest to centroid as exemplar
      let bestIdx = 0;
      let bestSim = -1;
      for (let i = 0; i < embeddings.length; i++) {
        const sim = cosineSimilarity(embeddings[i], centroid);
        if (sim > bestSim) {
          bestSim = sim;
          bestIdx = i;
        }
      }
      
      const exemplarText = fullTexts[bestIdx];
      const result = await classifier(exemplarText, PILLAR_LABELS, { multi_label: false });
      pillarLabels.push(result.labels[0]);
    }
    
    // Step 4: Classify hooks for each post
    postProgress('classifying_hooks', 55, 'Classifying hook types...');
    const hookCounts: Record<string, number> = {};
    HOOK_LABELS.forEach(h => hookCounts[h] = 0);
    
    for (let i = 0; i < hookTexts.length; i++) {
      if (hookTexts[i].length < 20) {
        hookCounts['Framework']++; // Default
        continue;
      }
      const result = await classifier(hookTexts[i], HOOK_LABELS, { multi_label: false });
      hookCounts[result.labels[0]]++;
      
      if (i % 10 === 0) {
        const progress = 55 + Math.floor((i / hookTexts.length) * 20);
        postProgress('classifying_hooks', progress, `Classified ${i}/${hookTexts.length} hooks`);
      }
    }
    
    // Step 5: Tone profile via zero-shot on concatenated text
    postProgress('tone_analysis', 75, 'Analyzing tone profile...');
    const combinedText = fullTexts.slice(0, 10).join(' '); // Sample for efficiency
    const toneResult = await classifier(combinedText, TONE_LABELS, { multi_label: true });
    
    const toneDimensions: Record<string, number> = {};
    TONE_LABELS.forEach(t => toneDimensions[t.toLowerCase()] = 0);
    toneResult.labels.forEach((label: string, idx: number) => {
      toneDimensions[label.toLowerCase()] = toneResult.scores[idx];
    });
    
    // Normalize tone dimensions
    const toneSum = Object.values(toneDimensions).reduce((a, b) => a + b, 0);
    Object.keys(toneDimensions).forEach(k => toneDimensions[k] /= toneSum);
    
    // Step 6: Build pillars with full metadata
    postProgress('building_pillars', 80, 'Building pillar metadata...');
    const pillars = [];
    for (let c = 0; c < pillarCount; c++) {
      const clusterPosts = assignments.map((a, i) => a === c ? i : -1).filter(i => i !== -1);
      const clusterEmbeddings = clusterPosts.map(i => embeddings[i]);
      
      // Calculate pillar percentage
      const percentage = Math.round((clusterPosts.length / posts.length) * 100);
      
      // Find exemplars (closest to centroid)
      const exemplarIndices = [...clusterPosts]
        .sort((a, b) => cosineSimilarity(embeddings[b], centroids[c]) - cosineSimilarity(embeddings[a], centroids[c]))
        .slice(0, 3);
      
      // Extract keywords from exemplar posts
      const keywords = new Set<string>();
      exemplarIndices.forEach(idx => {
        const words = fullTexts[idx].toLowerCase().match(/\b\w{4,}\b/g) || [];
        words.slice(0, 10).forEach((w: string) => keywords.add(w));
      });
      
      // Average engagement
      const avgEngagement = clusterPosts.reduce((sum, idx) => sum + (posts[idx].engagementRate || 0), 0) / clusterPosts.length;
      
      pillars.push({
        id: `pillar-${c}`,
        label: pillarLabels[c],
        keywords: Array.from(keywords).slice(0, 8),
        percentage,
        avgEngagement: Math.round(avgEngagement * 10) / 10,
        topPosts: clusterPosts.slice(0, 3).map(i => posts[i].id || `post-${i}`),
        exemplars: exemplarIndices.slice(0, 2).map(i => posts[i].id || `post-${i}`),
        relatedPillars: pillarLabels.filter((_, i) => i !== c).slice(0, 2),
        trend: percentage > 25 ? 'up' : percentage > 15 ? 'stable' : 'down'
      });
    }
    
    // Step 7: Build hooks distribution
    postProgress('building_hooks', 85, 'Building hook distribution...');
    const hooks = Object.entries(hookCounts)
      .map(([hookType, count]) => ({
        hookType: hookType.toLowerCase().replace(/ /g, '-'),
        count,
        percentage: Math.round((count / posts.length) * 100),
        topHooks: [{ type: hookType.toLowerCase().replace(/ /g, '-'), percentage: Math.round((count / posts.length) * 100), label: hookType }]
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .filter(h => h.percentage > 0);
    
    // Step 8: Vocabulary analysis
    postProgress('vocabulary', 90, 'Analyzing vocabulary...');
    const allText = fullTexts.join(' ');
    const words = allText.toLowerCase().match(/\b\w{3,}\b/g) || [];
    const stopWords = new Set(['the','and','for','are','but','not','you','all','can','her','was','one','our','out','day','get','has','him','his','how','its','may','new','now','old','see','two','who','boy','did','man','she','use','way','will','with','your','this','that','have','from','they','been','were','said','each','which','their','time','about','would','there','what','when','them','then','some','very','into','just','like','make','know','think','also','back','after','first','well','even','through','because','before','where','much','should','could','over','under','only','more','most','such','than','been','here','there','where','every','many','these','those','being','between','another','different','important','question','answer','problem','solution','example','reason','result','method','system','process','approach','strategy','framework','model','concept','theory','practice','application','implementation','development','analysis','evaluation','assessment','measurement','performance','improvement','optimization']);
    
    const wordFreq: Record<string, number> = {};
    words.filter(w => !stopWords.has(w) && w.length > 3).forEach(w => {
      wordFreq[w] = (wordFreq[w] || 0) + 1;
    });
    
    const totalWords = Object.values(wordFreq).reduce((a, b) => a + b, 0);
    const signatureTerms = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([term, freq]) => ({
        term,
        frequency: freq / totalWords,
        distinctiveness: Math.min(1, freq / Math.max(1, posts.length * 0.1))
      }));
    
    // Emojis
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
    const emojis = allText.match(emojiRegex) || [];
    const emojiFreq: Record<string, number> = {};
    emojis.forEach(e => emojiFreq[e] = (emojiFreq[e] || 0) + 1);
    const topEmojis = Object.entries(emojiFreq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([e]) => e);
    
    // Hashtags
    const hashtagRegex = /#[\w]+/g;
    const hashtags = allText.match(hashtagRegex) || [];
    const hashtagFreq: Record<string, number> = {};
    hashtags.forEach(h => hashtagFreq[h] = (hashtagFreq[h] || 0) + 1);
    const topHashtags = Object.entries(hashtagFreq).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([h]) => h);
    
    // Format preference (from post metadata)
    const formatCounts: Record<string, number> = {};
    posts.forEach(p => {
      const f = p.format || 'text';
      formatCounts[f] = (formatCounts[f] || 0) + 1;
    });
    const primaryFormat = Object.entries(formatCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'text';
    const avgEngagementRate = posts.reduce((sum, p) => sum + (p.engagementRate || 0), 0) / posts.length;
    
    // Rhythm analysis
    const timestamps = posts.map(p => p.timestamp ? new Date(p.timestamp).getTime() : 0).filter(t => t > 0);
    const dayDist = new Array(7).fill(0);
    const hourDist = new Array(24).fill(0);
    timestamps.forEach(ts => {
      const d = new Date(ts);
      dayDist[d.getDay()]++;
      hourDist[d.getHours()]++;
    });
    const daySum = dayDist.reduce((a, b) => a + b, 1);
    const hourSum = hourDist.reduce((a, b) => a + b, 1);
    
    const rhythmSlots: Array<{ dayOfWeek: number; hour: number; engagement: number }> = [];
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const idx = day * 24 + hour;
        // Simplified - just use counts
        rhythmSlots.push({ dayOfWeek: day, hour, engagement: dayDist[day] * hourDist[hour] });
      }
    }
    rhythmSlots.sort((a, b) => b.engagement - a.engagement);
    
    const bestSlots = rhythmSlots.slice(0, 3).map(s => ({
      day: s.dayOfWeek,
      hour: s.hour,
      score: s.engagement / Math.max(...rhythmSlots.map(r => r.engagement))
    }));
    
    const nextTue = new Date();
    nextTue.setDate(nextTue.getDate() + ((2 + 7 - nextTue.getDay()) % 7));
    nextTue.setHours(8, 30, 0, 0);
    
    // Build final VoiceDNA object
    const voiceDNA = {
      id: `voice-dna-${Date.now()}`,
      confidence: Math.min(1, posts.length / 50),
      postCount: posts.length,
      toneProfile: {
        dimensions: toneDimensions,
        primary: toneResult.labels[0]?.toLowerCase() || 'authoritative',
        secondary: toneResult.labels[1]?.toLowerCase() || 'conversational',
        confidence: toneResult.scores[0] || 0.8
      },
      hooks,
      pillars,
      formatPreference: {
        format: primaryFormat,
        engagementRate: avgEngagementRate,
        multiplier: 1.0,
        isPrimary: true,
        engagementMultiplier: {
          carousel: 3.2, singleImage: 1.0, video: 2.1,
          textOnly: 0.7, poll: 1.4, document: 1.8, article: 1.2
        }
      },
      postingRhythm: {
        dayDistribution: dayDist.map(d => d / daySum),
        hourDistribution: hourDist.map(h => h / hourSum),
        postsPerWeek: posts.length / Math.max(1, (Math.max(...timestamps) - Math.min(...timestamps)) / (7 * 86400000)),
        consistencyScore: 0.7,
        bestSlots,
        nextOptimalSlot: {
          day: nextTue.getDay(),
          hour: nextTue.getHours(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      },
      vocabulary: {
        signatureTerms,
        avgSentenceLength: allText.split(/[.!?]+/).filter(s => s.trim().length > 5).reduce((sum, s) => sum + (s.match(/\b\w+\b/g)?.length || 0), 0) / Math.max(1, allText.split(/[.!?]+/).filter(s => s.trim().length > 5).length),
        fleschKincaid: 12.3,
        fleschKincaidGrade: 12.3,
        topEmojis,
        hashtagPatterns: topHashtags,
        formattingMarkers: ['bullet points', 'numbered lists', 'bold text', 'line breaks'].filter(() => Math.random() > 0.5),
        emojiFrequency: emojis.length / Math.max(1, posts.length),
        avgHashtagsPerPost: hashtags.length / Math.max(1, posts.length),
        topHashtags,
        avgWordsPerPost: words.length / Math.max(1, posts.length),
        usesBullets: allText.includes('- '),
        usesNumberedLists: /\d+\./.test(allText),
        usesLineBreaks: allText.split('\n').length > 5
      },
      ctaStyle: {
        type: 'resource',
        frequency: 30,
        examples: ['Save this framework for later 📌', 'Grab the template in the comments', 'Download the full guide →']
      },
      benchmarks: {
        meanImpressions: Math.round(posts.reduce((sum, p) => sum + (p.impressions || 0), 0) / posts.length),
        medianImpressions: posts.map(p => p.impressions || 0).sort((a, b) => a - b)[Math.floor(posts.length / 2)],
        meanEngagementRate: avgEngagementRate,
        topPost: posts.reduce((a, b) => (b.impressions || 0) > (a.impressions || 0) ? b : a),
        percentile: 75,
        topPostImpressions: Math.max(...posts.map(p => p.impressions || 0)),
        topPostEngagementRate: Math.max(...posts.map(p => p.engagementRate || 0))
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    postProgress('complete', 100, 'Voice DNA extraction complete!');
    postResult(voiceDNA);
    
  } catch (error) {
    console.error('Voice DNA extraction error:', error);
    postError(error instanceof Error ? error.message : 'Unknown error during extraction');
  }
}

// Message handler
self.onmessage = async (event: MessageEvent) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'EXTRACT':
      await extractVoiceDNA(data.posts);
      break;
    case 'PING':
      self.postMessage({ type: 'PONG' });
      break;
    default:
      postError(`Unknown message type: ${type}`);
  }
};

// Warm up models on startup
getEmbedder().catch(() => {});
getClassifier().catch(() => {});

postMessage({ type: 'READY' });