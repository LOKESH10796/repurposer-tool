"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Zap, FileText, Mic, NotebookPen, TrendingUp, Users, Star, Clock
} from 'lucide-react';

interface HeroSectionProps {
  loading: boolean;
  input: string;
  setInput: (v: string) => void;
  inputType: 'blog' | 'transcript' | 'notes';
  setInputType: (v: 'blog' | 'transcript' | 'notes') => void;
  wordCount: number;
  onGenerate: () => void;
  isProActive: boolean;
  onSampleClick: (sample: string) => void;
}

const samples = [
  {
    label: 'SaaS founder post',
    icon: TrendingUp,
    text: 'After 3 years building my SaaS, I learned that 80% of our revenue comes from 20% of features. We spent months polishing things nobody used. The lesson? Ship the minimum, measure everything, and double down on what actually moves the needle. Most founders do the opposite — they build more when they should build less.',
  },
  {
    label: 'AI hot take',
    icon: Sparkles,
    text: "Here's an unpopular opinion about AI: it's not replacing your job. It's replacing your excuses. The people who thrive in 2026 won't be the ones who \"know the most.\" They'll be the ones who ship the fastest, learn the quickest, and collaborate best with AI tools. The bottleneck was never intelligence — it's execution speed.",
  },
  {
    label: 'Personal story',
    icon: Star,
    text: "Two years ago I was broke, burned out, and ready to quit. Today I run a 7-figure business. The turning point wasn't some magical strategy — it was deciding to do one thing every single day for 365 days, no matter how small. Compound interest works for habits too. Most people overestimate what they can do in a month and underestimate what they can do in a year.",
  },
];

export function HeroSection({
  loading, input, setInput, inputType, setInputType, wordCount,
  onGenerate, isProActive, onSampleClick,
}: HeroSectionProps) {
  const [showSamples, setShowSamples] = useState(false);

  return (
    <motion.section
      className="container mx-auto px-6 pt-12 pb-16 text-center relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Trust badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 mb-6"
      >
        <div className="flex -space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <span className="text-xs font-bold text-amber-300 tracking-wider">
          2,847 creators repurposing this week
        </span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      </motion.div>

      <motion.h1
        className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        One blog post.{' '}
        <br className="hidden md:block" />
        <span className="gradient-text glow-text">A week of content.</span>
        <br />
        <span className="text-slate-400 text-4xl md:text-5xl font-bold">In 30 seconds.</span>
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        Paste anything — a blog, transcript, voice note. Get a viral Twitter thread,
        a sharp LinkedIn post, and a newsletter draft. <span className="text-indigo-400 font-semibold">No prompts to learn.</span>
      </motion.p>

      {/* Main Input Card */}
      <motion.div
        className="max-w-4xl mx-auto relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl" />
        <div className="relative glass-card-premium rounded-3xl p-6 md:p-8">
          {/* Input type selector */}
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { id: 'blog', label: 'Blog Post', icon: FileText, color: 'from-orange-500 to-red-500' },
              { id: 'transcript', label: 'Transcript', icon: Mic, color: 'from-purple-500 to-pink-500' },
              { id: 'notes', label: 'Rough Notes', icon: NotebookPen, color: 'from-blue-500 to-cyan-500' },
            ].map((t) => {
              const Icon = t.icon;
              const active = inputType === t.id;
              return (
                <motion.button
                  key={t.id}
                  onClick={() => setInputType(t.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? `bg-gradient-to-r ${t.color} text-white shadow-lg`
                      : 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/40 border border-white/5'
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                </motion.button>
              );
            })}
          </div>

          <textarea
            id="hero-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              inputType === 'blog'
                ? "Paste your blog post, article, or essay..."
                : inputType === 'transcript'
                ? "Paste your video/podcast transcript..."
                : "Drop your rough notes, voice memo, or bullet points..."
            }
            className="w-full h-48 md:h-56 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/30 resize-none text-base leading-relaxed transition-all"
          />

          <div className="flex items-center justify-between mt-3 px-2 text-xs text-slate-400">
            <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
            <span>{input.length} characters</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <motion.button
              onClick={onGenerate}
              disabled={!input.trim() || loading}
              className="flex-1 btn-premium btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed text-base"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Generating magic...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Generate Content
                  <span className="text-xs opacity-80 ml-1">·</span>
                  <span className="text-xs opacity-80">30 sec</span>
                </span>
              )}
            </motion.button>
            <motion.button
              onClick={() => setShowSamples(!showSamples)}
              className="btn-premium btn-secondary py-4"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Zap className="w-4 h-4 inline-block mr-2" />
              Try a sample
            </motion.button>
          </div>

          {!isProActive && (
            <p className="text-xs text-slate-500 mt-4 text-center">
              🔒 Sign in or upgrade to generate • 7-day free trial included
            </p>
          )}
          {isProActive && (
            <p className="text-xs text-emerald-400 mt-4 text-center flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Pro active — unlimited generations
            </p>
          )}
        </div>
      </motion.div>

      {/* Sample chips */}
      <AnimatePresence>
        {showSamples && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto mt-4 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {samples.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.button
                    key={i}
                    onClick={() => { onSampleClick(s.text); setShowSamples(false); }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card rounded-2xl p-4 text-left hover:border-indigo-500/30 transition-all"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-indigo-300" />
                      </div>
                      <span className="text-xs font-bold text-slate-300">{s.label}</span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{s.text}</p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}