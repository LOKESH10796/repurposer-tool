"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Check, Lock } from 'lucide-react';
import { ResultsDisplay } from './ResultsDisplay';

const generatingSteps = [
  "Analyzing context...",
  "Drafting viral hooks...",
  "Optimizing for algorithm...",
  "Polishing tone...",
  "Generating output...",
];

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ twitterThread: string[]; linkedinPost: string } | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState<number | null>(null);

  const handleRepurpose = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResults(null);
    setCurrentStep(0);

    // Cycle through generating steps
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % generatingSteps.length);
    }, 800);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setResults(data);
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

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 grid-overlay z-0" />

      {/* Floating orbs */}
      <motion.div
        className="fixed top-20 left-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, -20, 30, 0],
          y: [0, 30, -20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <span className="text-white font-semibold text-lg">Repurposer</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Features</a>
          <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Pricing</a>
          <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Login</a>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        className="container mx-auto px-6 py-20 text-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight glow-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Transform 1 piece of content into a week of high-impact social posts
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-slate-400 mb-10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          Paste your blog post, transcript, or rough notes. Get ready-to-post Twitter threads, LinkedIn insights, and newsletters in seconds.
        </motion.p>

        {/* Input Card */}
        <motion.div
          className="max-w-4xl mx-auto glass-card rounded-2xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <div className="flex gap-2 mb-4">
            <button className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-white rounded-lg text-sm font-medium transition-all border border-indigo-500/20">
              Blog Post
            </button>
            <button className="px-4 py-2 bg-slate-700/20 hover:bg-slate-700/30 text-slate-200 rounded-lg text-sm font-medium transition-all border border-white/5">
              Transcript
            </button>
            <button className="px-4 py-2 bg-slate-700/20 hover:bg-slate-700/30 text-slate-200 rounded-lg text-sm font-medium transition-all border border-white/5">
              Notes
            </button>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your content here... (e.g., blog post, meeting notes, podcast transcript)"
            className="w-full h-48 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
          />

          <div className="flex justify-between items-center mt-4">
            <span className="text-slate-500 text-sm">{input.length} characters</span>
            <button
              onClick={handleRepurpose}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/25"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Generating...
                </span>
              ) : (
                'Repurpose Content'
              )}
            </button>
          </div>
        </motion.div>

        {/* Generating States */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key={currentStep}
              className="mt-8 max-w-md mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className="w-2 h-2 bg-indigo-500 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-slate-300 font-medium">Generating your content...</span>
                </div>
                <div className="space-y-2">
                  {generatingSteps.map((step, index) => (
                    <motion.div
                      key={step}
                      className={`flex items-center gap-2 text-sm ${
                        index === currentStep
                          ? 'text-indigo-400'
                          : index < currentStep
                          ? 'text-slate-500'
                          : 'text-slate-700'
                      }`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {index < currentStep ? (
                        <Check className="w-4 h-4" />
                      ) : index === currentStep ? (
                        <motion.div
                          className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                      ) : null}
                      <span className={index === currentStep ? 'font-medium' : ''}>{step}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        {results && (
          <motion.div
            className="mt-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ResultsDisplay
              twitterThread={results.twitterThread}
              linkedinPost={results.linkedinPost}
              onCopy={handleCopy}
              copied={copied}
            />
          </motion.div>
        )}

        {/* Dummy Preview (hidden when results exist) */}
        {!results && !loading && (
          <motion.div
            className="mt-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-slate-400 text-sm font-medium">Ready to repurpose</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 text-xs font-bold">𝕏</span>
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium mb-1">Twitter Thread</div>
                    <div className="text-slate-400 text-xs">5 tweets ready to post</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-xl">
                  <div className="w-8 h-8 bg-sky-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sky-400 text-xs font-bold">in</span>
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium mb-1">LinkedIn Insight</div>
                    <div className="text-slate-400 text-xs">Professional take with key takeaways</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-xl">
                  <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-400 text-xs font-bold">✉️</span>
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium mb-1">Newsletter Draft</div>
                    <div className="text-slate-400 text-xs">Engaging email with actionable insights</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="container mx-auto px-6 py-8 text-center text-slate-500 text-sm relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <p>© 2026 Repurposer. Built with ❤️ for content creators.</p>
      </motion.footer>
    </main>
  );
}