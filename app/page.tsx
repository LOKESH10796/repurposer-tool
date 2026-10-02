"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Copy, Check, Lock, MessageSquare, Crown, Rocket,
  Zap, Brain, ArrowRight, Sparkle, Star, Flame, Shield,
  TrendingUp, CheckCircle2, Infinity as InfinityIcon, Clock,
  Users, Award, Heart, X, Menu, Trophy, AlertCircle, Download
} from 'lucide-react';
import { ResultsDisplay, type GeneratedContent, type RefineModifier } from './components/ResultsDisplay';
import { detectInputKind, extractFirstUrl } from '@/lib/input-resolver';
import { FeaturesModal, PricingModal, FeedbackModal } from './components/NavbarModals';
import { SignInButton, useUser, UserButton } from '@clerk/nextjs';
import { PricingCard } from './components/PricingCard';
import { HeroSection } from './components/HeroSection';
import { Testimonials } from './components/Testimonials';
import { FeatureGrid } from './components/FeatureGrid';
import { HowItWorks } from './components/HowItWorks';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';

const generatingSteps = [
  "Analyzing your content...",
  "Crafting viral hooks...",
  "Optimizing for each platform...",
  "Polishing tone & style...",
  "Generating your content...",
];

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GeneratedContent | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState<number | null>(null);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [inputType, setInputType] = useState<'blog' | 'transcript' | 'notes'>('blog');
  const [formats] = useState<string[]>(['twitter', 'linkedin', 'newsletter', 'instagram', 'reddit', 'threads']);
  const [wordCount, setWordCount] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [voiceApplied, setVoiceApplied] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'extracting' | 'streaming' | 'done'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [streamingFormats, setStreamingFormats] = useState<string[]>([]);
  const [refiningFormat, setRefiningFormat] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('voiceDNA') || localStorage.getItem('voiceDNA');
      setVoiceApplied(!!raw);
    } catch { /* storage unavailable */ }
  }, []);

  const isProActive = user?.publicMetadata?.pro === true;

  useEffect(() => {
    setWordCount(input.trim().split(/\s+/).filter(Boolean).length);
  }, [input]);

  const getVoiceDna = (): unknown => {
    try {
      const raw = sessionStorage.getItem('voiceDNA') || localStorage.getItem('voiceDNA');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  };

  const splitThreadText = (t: string): string[] =>
    t.split(/---TWEET---/).map((s) => s.trim()).filter(Boolean);

  const parseRedditText = (t: string): { title: string; body: string } => {
    const m = t.match(/^\s*Title:\s*(.+?)\s*\n+([\s\S]*)$/);
    if (m) return { title: m[1].trim(), body: m[2].trim() };
    const lines = t.split('\n').filter((l) => l.trim());
    return { title: (lines[0] ?? 'Reframed post').slice(0, 200), body: lines.slice(1).join('\n').trim() || t };
  };

  // Main generate function — resolves input then streams all formats via SSE
  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResults(null);
    setCurrentStep(0);
    setPhase('streaming');

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % generatingSteps.length);
    }, 700);

    // Scroll to results section immediately
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      // --- Omni-input resolution ---
      const kind = detectInputKind(input);
      let effective = input;
      let effectiveType = inputType;

      if (kind === 'youtube' || kind === 'url') {
        setPhase('extracting');
        const url = extractFirstUrl(input) ?? input.trim();
        setStatusMessage(kind === 'youtube' ? 'Pulling YouTube transcript...' : 'Reading URL content...');
        const res = await fetch(kind === 'youtube' ? '/api/extract/youtube' : '/api/extract/url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          setStatusMessage('');
          setPhase('idle');
          setLoading(false);
          clearInterval(interval);
          setResults({ error: data.error || 'Could not read that link. Paste the text instead.' });
          return;
        }
        effective = data.text;
        effectiveType = kind === 'youtube' ? 'transcript' : 'blog';
      }

      setStatusMessage('');
      setPhase('streaming');

      // --- Stream all formats via SSE ---
      const buffers: Record<string, string> = Object.fromEntries(formats.map((f) => [f, '']));
      setStreamingFormats([...formats]);
      setResults({});

      const push = () => {
        const out: GeneratedContent = {};
        if (buffers.twitter?.trim()) out.twitterThread = splitThreadText(buffers.twitter);
        if (buffers.linkedin?.trim()) out.linkedinPost = buffers.linkedin.trim();
        if (buffers.newsletter?.trim()) out.newsletter = buffers.newsletter.trim();
        if (buffers.instagram?.trim()) out.instagramCaption = buffers.instagram.trim();
        if (buffers.reddit?.trim()) out.redditPost = parseRedditText(buffers.reddit);
        if (buffers.threads?.trim()) out.threadsPost = splitThreadText(buffers.threads);
        setResults({ ...out });
      };

      const res = await fetch('/api/generate/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
        body: JSON.stringify({
          content: effective,
          inputType: effectiveType,
          formats,
          voiceDna: getVoiceDna(),
        }),
      });

      if (!res.ok || !res.body) throw new Error(`stream ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      let gotChunk = false;

      for (;;) {
        const { done: rDone, value } = await reader.read();
        if (rDone) break;
        buf += decoder.decode(value, { stream: true });
        const parts = buf.split('\n\n');
        buf = parts.pop() ?? '';
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith('data:')) continue;
          try {
            const evt = JSON.parse(line.slice(5).trim()) as
              | { type: 'chunk'; format: string; text: string }
              | { type: 'done-format'; format: string }
              | { type: 'error-format'; format: string }
              | { type: 'done' }
              | { type: 'error'; error: string };
            if (evt.type === 'chunk') {
              gotChunk = true;
              buffers[evt.format] = (buffers[evt.format] ?? '') + evt.text;
              push();
            } else if (evt.type === 'done-format' || evt.type === 'error-format') {
              setStreamingFormats((s) => s.filter((f) => f !== evt.format));
              push();
            }
          } catch { /* partial SSE frame — ignore */ }
        }
      }

      if (!gotChunk) throw new Error('empty stream');
      setPhase('done');
    } catch {
      // Fallback: non-streaming JSON endpoint
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: input,
            inputType,
            formats,
            voiceDna: getVoiceDna(),
          }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          setResults({ error: data.error || `Generation failed (${res.status})` });
          setPhase('idle');
        } else {
          setResults(data);
          setPhase('done');
        }
      } catch {
        setResults({ error: 'Failed to connect to AI engine. Check your connection.' });
        setPhase('idle');
      }
    } finally {
      clearInterval(interval);
      setLoading(false);
      setStreamingFormats([]);
    }
  };

  // Refine (Humanize buttons)
  const handleRefine = async (formatId: string, modifier: RefineModifier) => {
    if (!results || refiningFormat) return;
    const current = formatTextForRefine(results, formatId);
    if (!current) return;
    setRefiningFormat(formatId);
    try {
      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: current, modifier, format: formatId, voiceDna: getVoiceDna() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) return;
      setResults((prev) => (prev ? applyRefinedText(prev, formatId, String(data.text)) : prev));
    } catch { /* silently fail */ } finally {
      setRefiningFormat(null);
    }
  };

  const handleCopy = (text: string, index?: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index ?? null);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSampleClick = (sample: string) => {
    setInput(sample);
  };

  const formatTextForRefine = (r: GeneratedContent, formatId: string): string => {
    switch (formatId) {
      case 'twitter': return r.twitterThread?.join('\n\n---\n\n') || '';
      case 'linkedin': return r.linkedinPost || '';
      case 'newsletter': return r.newsletter || '';
      case 'instagram': return r.instagramCaption || '';
      case 'reddit': return r.redditPost ? `Title: ${r.redditPost.title}\n\n${r.redditPost.body}` : '';
      case 'threads': return r.threadsPost?.join('\n\n---\n\n') || '';
      default: return '';
    }
  };

  const applyRefinedText = (r: GeneratedContent, formatId: string, newText: string): GeneratedContent => {
    const out = { ...r };
    switch (formatId) {
      case 'twitter': out.twitterThread = newText.split(/---TWEET---/).map(s => s.trim()).filter(Boolean); break;
      case 'linkedin': out.linkedinPost = newText; break;
      case 'newsletter': out.newsletter = newText; break;
      case 'instagram': out.instagramCaption = newText; break;
      case 'reddit': out.redditPost = parseRedditText(newText); break;
      case 'threads': out.threadsPost = newText.split(/---TWEET---/).map(s => s.trim()).filter(Boolean); break;
    }
    return out;
  };

  const handleDownloadAll = () => {
    if (!results) return;
    const blob = new Blob([
      `=== TWITTER THREAD ===\n\n${results.twitterThread?.join('\n\n---\n\n') || ''}\n\n=== LINKEDIN POST ===\n\n${results.linkedinPost || ''}\n\n=== NEWSLETTER ===\n\n${results.newsletter || ''}\n\n=== INSTAGRAM ===\n\n${results.instagramCaption || ''}\n\n=== REDDIT ===\n\n${results.redditPost ? `Title: ${results.redditPost.title}\n\n${results.redditPost.body}` : ''}\n\n=== THREADS ===\n\n${results.threadsPost?.join('\n\n---\n\n') || ''}`
    ], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reframed-content.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">Reframe<span className="text-slate-400">.ai</span></span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 items-center">
          <a href="#features" className="text-slate-400 hover:text-white transition-colors text-sm">Features</a>
          <a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors text-sm">How it works</a>
          <a href="/voice-dna/cold-start" className="text-slate-400 hover:text-white transition-colors text-sm">Voice DNA</a>
          <button onClick={() => setShowPricing(true)} className="text-slate-400 hover:text-white transition-colors text-sm">Pricing</button>
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button className="text-sm text-slate-400 hover:text-white transition-colors">Sign in</button>
            </SignInButton>
          ) : (
            <UserButton />
          )}
          <button
            onClick={() => setShowPricing(true)}
            className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Get Pro
          </button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-3">
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button className="text-sm text-slate-400">Sign in</button>
            </SignInButton>
          ) : (
            <UserButton />
          )}
          <button className="text-white" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden relative z-20 mx-4 my-2 bg-[#18181b] border border-white/10 rounded-xl p-4 space-y-2"
          >
            <a href="#features" onClick={() => setShowMobileMenu(false)} className="block text-slate-300 hover:text-white py-2 text-sm">Features</a>
            <a href="#how-it-works" onClick={() => setShowMobileMenu(false)} className="block text-slate-300 hover:text-white py-2 text-sm">How it works</a>
            <a href="/voice-dna/cold-start" onClick={() => setShowMobileMenu(false)} className="block text-slate-300 hover:text-white py-2 text-sm">Voice DNA</a>
            <button onClick={() => { setShowPricing(true); setShowMobileMenu(false); }} className="block text-slate-300 hover:text-white py-2 w-full text-left text-sm">Pricing</button>
            <button onClick={() => { setShowPricing(true); setShowMobileMenu(false); }} className="w-full bg-white text-black text-sm font-medium py-2.5 rounded-lg mt-2">
              Get Pro — $15
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <HeroSection
        loading={loading}
        input={input}
        setInput={setInput}
        inputType={inputType}
        setInputType={setInputType}
        wordCount={wordCount}
        onGenerate={handleGenerate}
        isProActive={isProActive}
        onSampleClick={handleSampleClick}
        formats={formats}
        setFormats={() => {}}
      />

      {/* ===== RESULTS SECTION — Right after hero ===== */}
      <div ref={resultsRef} />
      <section id="results-section" className="container mx-auto px-4 md:px-6 pb-20 relative z-10">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto rounded-2xl bg-[#09090b] border border-white/10 p-12 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-white/5 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-lg text-white font-medium mb-2"
              >
                {generatingSteps[currentStep]}
              </motion.p>
            </AnimatePresence>
            {statusMessage && (
              <p className="text-sm text-slate-400 mt-2">{statusMessage}</p>
            )}
            <div className="mt-6 flex gap-1.5 justify-center">
              {generatingSteps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    currentStep === i ? 'w-8 bg-white' : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        ) : results ? (
          results.error ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-lg mx-auto text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-lg text-white font-medium mb-2">Something went wrong</h3>
              <p className="text-slate-400 text-sm">{results.error}</p>
              <button
                onClick={() => { setResults(null); setPhase('idle'); }}
                className="mt-4 text-sm text-white/60 hover:text-white underline underline-offset-4"
              >
                Try again
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">Your content</h2>
                <div className="flex items-center gap-3">
                  {voiceApplied && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-300">
                      <Brain className="w-3 h-3" /> Voice DNA
                    </span>
                  )}
                  <button
                    onClick={handleDownloadAll}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-slate-300 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download all
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ResultsDisplay
                    twitterThread={results?.twitterThread}
                    linkedinPost={results?.linkedinPost}
                    newsletter={results?.newsletter}
                    instagramCaption={results?.instagramCaption}
                    redditPost={results?.redditPost}
                    threadsPost={results?.threadsPost}
                    previewOnly={false}
                    onCopy={handleCopy}
                    copied={copied}
                    streamingFormats={streamingFormats}
                    onRefine={handleRefine}
                    refiningFormat={refiningFormat}
                  />
                </div>
                <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 h-fit">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-medium text-white">Format Overview</h3>
                    <span className="text-xs text-slate-500">Ready to post</span>
                  </div>
                  <div className="space-y-2">
                    {results.twitterThread && (
                      <FormatStat icon="𝕏" label="Twitter Thread" value={`${results.twitterThread.length} tweets`} />
                    )}
                    {results.linkedinPost && (
                      <FormatStat icon="in" label="LinkedIn Post" value={`${results.linkedinPost.split(/\s+/).length} words`} />
                    )}
                    {results.newsletter && (
                      <FormatStat icon="✉️" label="Newsletter" value="Draft ready" />
                    )}
                    {results.instagramCaption && (
                      <FormatStat icon="📷" label="Instagram" value="Caption ready" />
                    )}
                    {results.redditPost && (
                      <FormatStat icon="🔴" label="Reddit" value="Post ready" />
                    )}
                    {results.threadsPost && (
                      <FormatStat icon="↗️" label="Threads" value={`${results.threadsPost.length} posts`} />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        ) : phase === 'idle' ? (
          null /* Don't show empty state — hero IS the CTA */
        ) : null}
      </section>

      {/* ===== Marketing sections ===== */}
      <section id="how-it-works">
        <HowItWorks />
      </section>

      <section id="features">
        <FeatureGrid />
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            One payment. Forever yours.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            No subscriptions. No monthly fees. Pay once, reframe content forever.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <PricingCard
            tier="Free"
            price="$0"
            period="forever"
            description="Perfect for trying it out"
            features={[
              { text: '5 generations per day', included: true },
              { text: 'Basic Twitter + LinkedIn output', included: true },
              { text: 'AI Hook Optimization', included: false },
              { text: 'All formats preview', included: false },
              { text: 'Priority support', included: false },
            ]}
            cta="Start Free"
            variant="free"
          />
          <PricingCard
            tier="Lifetime Pro"
            price="$15"
            period="one-time"
            description="Best for serious creators"
            features={[
              { text: 'Unlimited generations — forever', included: true, highlight: true },
              { text: 'All platforms: Twitter, LinkedIn, Newsletter, Threads', included: true },
              { text: 'AI Hook Optimization + Platform Formatting', included: true, highlight: true },
              { text: 'Priority 24/7 support', included: true },
              { text: 'Future features included', included: true, highlight: true },
            ]}
            cta="Get Lifetime Pass"
            variant="premium"
            badge="Most Popular"
            gumroadUrl="https://loki1996.gumroad.com/l/repurposer"
          />
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-6 px-6 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              30-day money-back guarantee
            </span>
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Instant access after payment
            </span>
            <span className="flex items-center gap-2">
              <InfinityIcon className="w-4 h-4 text-indigo-400" />
              Pay once, use forever
            </span>
          </div>
        </div>
      </section>

      <Testimonials />
      <FAQ />

      {/* Final CTA */}
      <section className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center bg-[#09090b] border border-white/10 rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Stop writing. Start reframing.
          </h2>
          <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
            Join 2,000+ creators who turned one idea into a week of content in 30 seconds.
          </p>
          <button
            onClick={() => setShowPricing(true)}
            className="bg-white text-black font-medium px-8 py-3 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Get Lifetime Pro — $15
          </button>
          <p className="text-sm text-slate-500 mt-4">One-time payment. Forever access.</p>
        </div>
      </section>

      <Footer />

      {/* Modals */}
      <FeaturesModal isOpen={showFeatures} onClose={() => setShowFeatures(false)} />
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
      {showFeedback && <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />}

      {/* Floating Feedback Button */}
      <button
        onClick={() => setShowFeedback(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/10 transition-colors"
        aria-label="Send feedback"
      >
        <MessageSquare className="w-5 h-5" />
      </button>
    </main>
  );
}

function FormatStat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm font-medium text-white">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white">{label}</div>
        <div className="text-xs text-slate-500">{value}</div>
      </div>
      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
    </div>
  );
}
