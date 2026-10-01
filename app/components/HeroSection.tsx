"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FileText, Mic, NotebookPen, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

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
  formats: string[];
  setFormats: (v: string[]) => void;
}

export function HeroSection({
  loading, input, setInput, inputType, setInputType, wordCount,
  onGenerate, isProActive, onSampleClick,
  formats, setFormats,
}: HeroSectionProps) {
  const [showSamples, setShowSamples] = useState(false);

  return (
    <motion.section
      className="container mx-auto px-4 pt-20 pb-24 text-center relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 mb-8"
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-medium text-slate-300">Reframe.ai Engine v2 Live</span>
      </motion.div>

      <motion.h1
        className="text-5xl md:text-7xl font-semibold text-white mb-6 tracking-tight leading-[1.1]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Transform ideas into <br className="hidden md:block" />
        <span className="text-slate-400">content engines.</span>
      </motion.h1>

      <motion.p
        className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Paste a blog, transcript, or rough notes. Our AI analyzes the core message and reframes it for every major platform in 30 seconds.
      </motion.p>

      <motion.div
        className="max-w-4xl mx-auto text-left relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50" />
        
        <div className="relative bg-[#09090b] rounded-3xl p-2 md:p-3 border border-white/[0.08] shadow-2xl">
          <div className="bg-[#18181b] rounded-2xl p-4 md:p-6 border border-white/[0.05]">
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: 'blog', label: 'Blog Post', icon: FileText },
                { id: 'transcript', label: 'Transcript', icon: Mic },
                { id: 'notes', label: 'Rough Notes', icon: NotebookPen },
              ].map((t) => {
                const Icon = t.icon;
                const active = inputType === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setInputType(t.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-white text-black shadow-sm'
                        : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t.label}
                  </button>
                );
              })}
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                inputType === 'blog'
                  ? "Paste your blog post, article, or essay..."
                  : inputType === 'transcript'
                  ? "Paste your video/podcast transcript or YouTube URL..."
                  : "Drop your rough notes, voice memo, or bullet points..."
              }
              className="w-full h-48 md:h-56 bg-transparent text-slate-200 placeholder-slate-600 focus:outline-none resize-none text-base md:text-lg leading-relaxed"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500 font-medium">
                  {wordCount} words
                </span>
                <button
                  onClick={() => setShowSamples(!showSamples)}
                  className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Try sample
                </button>
              </div>

              <button
                onClick={onGenerate}
                disabled={!input.trim() || loading}
                className="group relative flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-black rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-all overflow-hidden"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full" />
                    Reframing...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Content</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showSamples && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="max-w-4xl mx-auto mt-4 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['SaaS founder post', 'AI hot take', 'Personal story'].map((label, i) => (
                <button
                  key={label}
                  onClick={() => {
                    setInput(
                      i === 0 ? "After 3 years building my SaaS, I learned that 80% of our revenue comes from 20% of features. We spent months polishing things nobody used. The lesson? Ship the minimum, measure everything, and double down on what actually moves the needle."
                      : i === 1 ? "Here's an unpopular opinion about AI: it's not replacing your job. It's replacing your excuses. The people who thrive won't be the ones who 'know the most.' They'll be the ones who ship the fastest and collaborate best with AI tools."
                      : "Two years ago I was broke, burned out, and ready to quit. Today I run a 7-figure business. The turning point wasn't some magical strategy — it was deciding to do one thing every single day for 365 days, no matter how small."
                    );
                    setShowSamples(false);
                  }}
                  className="p-4 rounded-xl bg-[#09090b] border border-white/10 text-left hover:border-white/20 transition-colors"
                >
                  <p className="text-sm font-medium text-slate-200 mb-2">{label}</p>
                  <p className="text-xs text-slate-500 line-clamp-2">Click to load this sample text into the engine.</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}