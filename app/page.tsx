"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Copy, Check, Lock, MessageSquare, Crown, Rocket,
  Zap, Brain, ArrowRight, Sparkle, Star, Flame, Shield,
  TrendingUp, CheckCircle2, Infinity as InfinityIcon, Clock,
  Users, Award, Heart, X, Menu
} from 'lucide-react';
import { ResultsDisplay } from './ResultsDisplay';
import { FeaturesModal, PricingModal, FeedbackModal } from './components/NavbarModals';
import { SignInButton, useUser, UserButton } from '@clerk/nextjs';
import { PricingCard } from './components/PricingCard';
import { HeroSection } from './components/HeroSection';
import { ParticleBackground } from './components/ParticleBackground';
import { StatsBar } from './components/StatsBar';
import { Testimonials } from './components/Testimonials';
import { FeatureGrid } from './components/FeatureGrid';
import { HowItWorks } from './components/HowItWorks';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { LiveDemo } from './components/LiveDemo';

const generatingSteps = [
  "🧠 Analyzing your content...",
  "✍️ Crafting viral hooks...",
  "⚡ Optimizing for each platform...",
  "🎯 Polishing tone & style...",
  "✨ Generating your content...",
];

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ twitterThread: string[]; linkedinPost: string } | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState<number | null>(null);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showAllFormats, setShowAllFormats] = useState(false);
  const [inputType, setInputType] = useState<'blog' | 'transcript' | 'notes'>('blog');
  const [wordCount, setWordCount] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { isSignedIn, user } = useUser();

  const isProActive = user?.publicMetadata?.pro === true;
  const isPaid = isProActive;

  useEffect(() => {
    setWordCount(input.trim().split(/\s+/).filter(Boolean).length);
  }, [input]);

  const handleRepurpose = async () => {
    if (!input.trim()) return;
    if (!isProActive) {
      setShowPricing(true);
      return;
    }
    setLoading(true);
    setResults(null);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % generatingSteps.length);
    }, 700);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input, inputType }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setResults(data);
        // Scroll to results
        setTimeout(() => {
          document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch (err) {
      alert('Failed to connect to AI engine. Check your connection.');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSampleClick = (sample: string) => {
    setInput(sample);
    document.getElementById('hero-textarea')?.focus();
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      <div className="fixed inset-0 grid-overlay z-0" />

      {/* Floating orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Navigation */}
      <motion.nav
        className="container mx-auto px-6 py-4 flex justify-between items-center relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30"
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ duration: 0.4 }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <span className="text-white font-bold text-xl tracking-tight">Repurposer<span className="text-indigo-400">.</span>ai</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 items-center">
          <a href="#features" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Features</a>
          <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">How it works</a>
          <button onClick={() => setShowPricing(true)} className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Pricing</button>
          <button onClick={() => setShowFeedback(true)} className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Feedback</button>
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Login</button>
            </SignInButton>
          ) : (
            <UserButton />
          )}
          <motion.button
            onClick={() => setShowPricing(true)}
            className="btn-premium btn-gold text-sm px-5 py-2.5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Crown className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
            Get Pro
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden relative z-20 mx-6 my-2 glass-card rounded-2xl p-6 space-y-3"
          >
            <a href="#features" onClick={() => setShowMobileMenu(false)} className="block text-slate-300 hover:text-white py-2">Features</a>
            <a href="#how-it-works" onClick={() => setShowMobileMenu(false)} className="block text-slate-300 hover:text-white py-2">How it works</a>
            <button onClick={() => { setShowPricing(true); setShowMobileMenu(false); }} className="block text-slate-300 hover:text-white py-2 w-full text-left">Pricing</button>
            <button onClick={() => { setShowFeedback(true); setShowMobileMenu(false); }} className="block text-slate-300 hover:text-white py-2 w-full text-left">Feedback</button>
            <button onClick={() => { setShowPricing(true); setShowMobileMenu(false); }} className="w-full btn-premium btn-gold py-3 mt-2">
              <Crown className="w-4 h-4 inline-block mr-1.5" />
              Get Pro
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
        onGenerate={handleRepurpose}
        isProActive={isProActive}
        onSampleClick={handleSampleClick}
      />

      {/* Stats Bar */}
      <StatsBar />

      {/* Live Demo Preview */}
      <LiveDemo />

      {/* How It Works */}
      <HowItWorks />

      {/* Feature Grid */}
      <section id="features">
        <FeatureGrid />
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-6 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-4">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Lifetime Access</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            One payment. <span className="gradient-text-gold">Forever yours.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            No subscriptions. No monthly fees. Pay once, repurpose content forever.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <PricingCard
            tier="Free"
            price="$0"
            period="forever"
            description="Perfect for trying it out"
            features={[
              { text: '5 repowers per day', included: true },
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
              { text: 'Unlimited repowers — forever', included: true, highlight: true },
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

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-6 px-6 py-3 rounded-2xl glass-card text-sm text-slate-300">
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
        </motion.div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

      {/* Results Section */}
      <section id="results-section" className="container mx-auto px-6 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Content, <span className="gradient-text">Ready to Post</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            One-click copy. Multiple formats. Maximum reach.
          </p>
        </motion.div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto glass-card-premium rounded-3xl p-12 text-center"
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-10 h-10 text-white" />
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xl text-white font-semibold mb-2"
              >
                {generatingSteps[currentStep]}
              </motion.p>
            </AnimatePresence>
            <p className="text-slate-400">This usually takes 5-15 seconds...</p>
            <div className="mt-6 flex gap-2 justify-center">
              {generatingSteps.map((_, i) => (
                <motion.div
                  key={i}
                  className="h-1.5 rounded-full bg-indigo-500"
                  animate={{
                    width: currentStep === i ? 32 : 8,
                    opacity: currentStep === i ? 1 : 0.3,
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        ) : results ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="lg:col-span-2">
              <ResultsDisplay
                twitterThread={results.twitterThread}
                linkedinPost={results.linkedinPost}
                previewOnly={false}
                onCopy={handleCopy}
                copied={copied}
              />
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card-premium rounded-2xl p-6 h-fit"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">📊 Format Overview</h3>
                <span className="text-xs text-slate-400">Ready to post</span>
              </div>
              <div className="space-y-3">
                <FormatStat icon="𝕏" label="Twitter Thread" value={`${results.twitterThread.length} tweets`} color="blue" />
                <FormatStat icon="in" label="LinkedIn Post" value={`${results.linkedinPost.split(/\s+/).length} words`} color="sky" />
                <FormatStat icon="✉️" label="Newsletter" value="Draft ready" color="purple" />
              </div>

              <div className="mt-6 pt-6 border-t border-white/5">
                <div className="text-xs text-slate-400 mb-2">Engagement Score</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                      initial={{ width: 0 }}
                      animate={{ width: '92%' }}
                      transition={{ duration: 1.5, delay: 0.3 }}
                    />
                  </div>
                  <span className="text-sm font-bold gradient-text-gold">92%</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Optimized for virality</p>
              </div>

              <motion.button
                onClick={() => {
                  const blob = new Blob([
                    `=== TWITTER THREAD ===\n\n${results.twitterThread.join('\n\n---\n\n')}\n\n=== LINKEDIN POST ===\n\n${results.linkedinPost}`
                  ], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'repurposed-content.txt';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="w-full mt-6 btn-premium btn-secondary py-3 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowRight className="w-4 h-4" />
                Download All
              </motion.button>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto text-center py-12"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 flex items-center justify-center border border-white/5">
              <Sparkles className="w-10 h-10 text-slate-600" />
            </div>
            <p className="text-slate-400 text-lg">
              Paste your content above and hit <span className="text-white font-semibold">Generate</span> to see the magic ✨
            </p>
          </motion.div>
        )}
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-6 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center glass-card-premium rounded-3xl p-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl" />
          <div className="relative">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <Rocket className="w-16 h-16 text-amber-400" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Stop Writing. <span className="gradient-text-gold">Start Repurposing.</span>
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Join 2,000+ creators who turned one idea into a week's worth of content in 30 seconds.
            </p>
            <motion.button
              onClick={() => setShowPricing(true)}
              className="btn-premium btn-gold px-8 py-4 text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Crown className="w-5 h-5 inline-block mr-2 -mt-0.5" />
              Get Lifetime Pro — $15
            </motion.button>
            <p className="text-sm text-slate-400 mt-4">One-time payment. Forever access.</p>
          </div>
        </motion.div>
      </section>

      <Footer />

      {/* Modals */}
      <FeaturesModal isOpen={showFeatures} onClose={() => setShowFeatures(false)} />
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
      {showFeedback && <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />}

      {/* Floating Feedback Button */}
      <motion.button
        onClick={() => setShowFeedback(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30"
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Send feedback"
        animate={{
          boxShadow: [
            '0 10px 40px rgba(99, 102, 241, 0.3)',
            '0 10px 60px rgba(99, 102, 241, 0.5)',
            '0 10px 40px rgba(99, 102, 241, 0.3)',
          ],
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity },
          scale: { duration: 0.2 },
          rotate: { duration: 0.3 },
        }}
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>
    </main>
  );
}

function FormatStat({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-300',
    sky: 'from-sky-500/20 to-sky-600/20 border-sky-500/30 text-sky-300',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-300',
  };

  return (
    <motion.div
      whileHover={{ x: 4 }}
      className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} border`}
    >
      <div className="w-10 h-10 rounded-lg bg-slate-900/50 flex items-center justify-center font-bold">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-white">{label}</div>
        <div className="text-xs opacity-80">{value}</div>
      </div>
      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
    </motion.div>
  );
}
