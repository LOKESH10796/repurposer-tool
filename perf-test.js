/**
 * Performance test suite for Repurposer Tool
 * Run with: node perf-test.js
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const config = {
  iterations: 1000,
  warmupIterations: 100,
  metrics: {
    parseDuration: [],
    analyzeDuration: [],
    generateDuration: [],
    memoryUsage: []
  }
};

// Sample test data
const sampleContent = `Artificial intelligence (AI) is transforming industries worldwide. From healthcare to finance, AI-powered solutions are revolutionizing how we work, live, and interact with technology. Machine learning algorithms can now analyze medical images with accuracy rivaling human radiologists, predict stock market trends with unprecedented precision, and even compose music that moves listeners to tears.

The rapid advancement of AI has sparked both excitement and concern. While proponents argue that AI will create more jobs than it destroys, critics worry about the ethical implications of algorithmic decision-making and the potential for bias in AI systems. As we stand on the brink of a new era, it's crucial that we approach AI development with both optimism and caution.`;

/**
 * Simulate content parsing performance
 */
function parseContent(content) {
  const startTime = performance.now();
  
  // Simulate parsing operations
  const words = content.split(/\s+/);
  const sentences = content.split(/[.!?]+/);
  const paragraphs = content.split(/\n\s*\n/);
  
  const metrics = {
    wordCount: words.length,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    readTime: Math.ceil(words.length / 200),
    keyTopics: ['AI', 'Machine Learning', 'Technology', 'Ethics']
  };
  
  const endTime = performance.now();
  return { metrics, duration: endTime - startTime };
}

/**
 * Simulate AI analysis performance
 */
function analyzeContent(content) {
  const startTime = performance.now();
  
  // Simulate AI processing
  const analysis = {
    sentiment: 'positive',
    tone: 'informative',
    readability: 'medium',
    wordCount: content.split(/\s+/).length,
    estimatedReadTime: Math.ceil(content.split(/\s+/).length / 200)
  };
  
  const endTime = performance.now();
  return { analysis, duration: endTime - startTime };
}

/**
 * Simulate content generation performance
 */
function generateContent(format, content) {
  const startTime = performance.now();
  
  // Simulate generation
  const generated = {
    format,
    content: `[${format.toUpperCase()}] ${content.substring(0, 100)}...`,
    length: content.length
  };
  
  const endTime = performance.now();
  return { generated, duration: endTime - startTime };
}

/**
 * Run benchmark test
 */
function runBenchmark() {
  console.log('\n🚀 Running Performance Benchmarks\n');
  console.log('='.repeat(50));
  
  const results = {
    parse: { total: 0, min: Infinity, max: 0, avg: 0 },
    analyze: { total: 0, min: Infinity, max: 0, avg: 0 },
    generate: { total: 0, min: Infinity, max: 0, avg: 0 }
  };
  
  // Warmup
  console.log(`\n📊 Warming up (${config.warmupIterations} iterations)...`);
  for (let i = 0; i < config.warmupIterations; i++) {
    parseContent(sampleContent);
    analyzeContent(sampleContent);
    generateContent('twitter', sampleContent);
  }
  
  // Benchmark
  console.log(`\n⚡ Running benchmarks (${config.iterations} iterations)...`);
  
  for (let i = 0; i < config.iterations; i++) {
    const parseResult = parseContent(sampleContent);
    const analyzeResult = analyzeContent(sampleContent);
    const generateResult = generateContent('twitter', sampleContent);
    
    // Parse metrics
    results.parse.total += parseResult.duration;
    results.parse.min = Math.min(results.parse.min, parseResult.duration);
    results.parse.max = Math.max(results.parse.max, parseResult.duration);
    
    // Analyze metrics
    results.analyze.total += analyzeResult.duration;
    results.analyze.min = Math.min(results.analyze.min, analyzeResult.duration);
    results.analyze.max = Math.max(results.analyze.max, analyzeResult.duration);
    
    // Generate metrics
    results.generate.total += generateResult.duration;
    results.generate.min = Math.min(results.generate.min, generateResult.duration);
    results.generate.max = Math.max(results.generate.max, generateResult.duration);
  }
  
  // Calculate averages
  results.parse.avg = results.parse.total / config.iterations;
  results.analyze.avg = results.analyze.total / config.iterations;
  results.generate.avg = results.generate.total / config.iterations;
  
  return results;
}

/**
 * Print results
 */
function printResults(results) {
  console.log('\n' + '='.repeat(50));
  console.log('📈 PERFORMANCE RESULTS\n');
  
  const formatResult = (name, data) => {
    console.log(`\n${name}:`);
    console.log(`  Average: ${data.avg.toFixed(3)}ms`);
    console.log(`  Min:     ${data.min.toFixed(3)}ms`);
    console.log(`  Max:     ${data.max.toFixed(3)}ms`);
    console.log(`  Total:   ${data.total.toFixed(1)}ms`);
    console.log(`  Ops/sec: ${(config.iterations / (data.total / 1000)).toFixed(0)}`);
  };
  
  formatResult('Content Parsing', results.parse);
  formatResult('AI Analysis', results.analyze);
  formatResult('Content Generation', results.generate);
  
  const totalOps = config.iterations * 3;
  const totalTime = results.parse.total + results.analyze.total + results.generate.total;
  console.log('\n' + '='.repeat(50));
  console.log(`\n🎯 SUMMARY`);
  console.log(`  Total operations: ${totalOps}`);
  console.log(`  Total time: ${totalTime.toFixed(1)}ms`);
  console.log(`  Throughput: ${(totalOps / (totalTime / 1000)).toFixed(0)} ops/sec`);
  console.log(`\n✅ Benchmarks complete!\n`);
}

/**
 * Memory usage test
 */
function testMemory() {
  console.log('\n🧪 Memory Usage Test\n');
  console.log('='.repeat(50));
  
  const initialMemory = process.memoryUsage();
  console.log(`\nInitial memory: ${initialMemory.heapUsed / 1024 / 1024} MB`);
  
  const allocations = [];
  for (let i = 0; i < 10000; i++) {
    allocations.push({
      id: i,
      content: sampleContent,
      timestamp: Date.now()
    });
  }
  
  const afterAlloc = process.memoryUsage();
  console.log(`After 10k allocations: ${afterAlloc.heapUsed / 1024 / 1024} MB`);
  console.log(`Memory increase: ${(afterAlloc.heapUsed - initialMemory.heapUsed) / 1024 / 1024} MB`);
  
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
    const afterGC = process.memoryUsage();
    console.log(`After GC: ${afterGC.heapUsed / 1024 / 1024} MB`);
  }
  
  // Clear allocations
  allocations.length = 0;
  
  const finalMemory = process.memoryUsage();
  console.log(`Final memory: ${finalMemory.heapUsed / 1024 / 1024} MB`);
  console.log('\n' + '='.repeat(50) + '\n');
}

// Run tests
if (require.main === module) {
  const results = runBenchmark();
  printResults(results);
  testMemory();
}

module.exports = { parseContent, analyzeContent, generateContent, runBenchmark };
