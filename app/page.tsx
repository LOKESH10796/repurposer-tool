"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Check, Lock, MessageSquare } from 'lucide-react';
import { ResultsDisplay } from './ResultsDisplay';
import { FeaturesModal, PricingModal, FeedbackModal } from './components/NavbarModals';
import { SignInButton, useUser, UserButton } from '@clerk/nextjs';

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
  const [showFeatures, setShowFeatures] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [inputType, setInputType] = useState<'blog' | 'transcript' | 'notes'>('blog');
  const { isSignedIn, user } = useUser();

  // Pro = signed-in user with pro metadata (set securely by Gumroad webhook)
  const isProActive = user?.publicMetadata?.pro === true;

  const handleRepurpose = async () => {
    if (!input.trim()) return;
    if (!isProActive) {
      alert('Please sign in or upgrade to generate content.');
      return;
    }
    setLoading(true);
    setResults(null);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % generatingSteps.length);
    }, 800);

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
      <div className="fixed inset-0 grid-overlay z-0" />

      <motion.div
        className="fixed top-20 left-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"
        animate={{ x: [0, 30, -20, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        animate={{ x: [0, -20, 30, 0], y: [0, 30, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

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
          <button onClick={() => setShowFeatures(true)} className="text-slate-400 hover:text-white transition-colors text-sm">Features</button>
          <button onClick={() => setShowPricing(true)} className="text-slate-400 hover:text-white transition-colors text-sm">Pricing</button>
          <button onClick={() => setShowFeedback(true)} className="text-slate-400 hover:text-white transition-colors text-sm">Feedback</button>
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Login</button>
            </SignInButton>
          ) : (
            <UserButton />
          )}
          {paid && !isSignedIn && (
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Pro Active</span>
          )}
        </div>
      </nav>

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

        <motion.div
          className="max-w-3xl mx-auto glass rounded-2xl p-8 shadow-2xl border border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setInputType('blog')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${inputType === 'blog' ? 'bg-indigo-600 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'}`}
            >
              <span className="w-5 h-5 bg-orange-500 rounded-sm flex items-center justify-center text-xs font-bold">B</span> Blog
            </button>
            <button
              onClick={() => setInputType('transcript')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${inputType === 'transcript' ? 'bg-indigo-600 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'}`}
            >
              <span className="w-5 h-5 bg-purple-500 rounded-sm flex items-center justify-center text-xs font-bold">T</span> Transcript
            </button>
            <button
              onClick={() => setInputType('notes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${inputType === 'notes' ? 'bg-indigo-600 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'}`}
            >
              <span className="w-5 h-5 bg-blue-500 rounded-sm flex items-center justify-center text-xs font-bold">N</span> Notes
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputType === 'blog' ? "Paste your blog post here..." : inputType === 'transcript' ? "Paste your video/audio transcript here..." : "Paste your notes here..."}
            className="w-full h-48 bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleRepurpose}
              disabled={!input.trim() || loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/25"
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
            <button
              onClick={() => setShowPricing(true)}
              className="px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-xl font-semibold transition-all border border-white/10"
            >
              Upgrade
            </button>
          </div>
          {!isProActive && !paid && (
            <p className="text-xs text-slate-500 mt-3">Sign in or upgrade to unlock unlimited generation</p>
          )}
          {isProActive && paid && (
            <p className="text-xs text-green-400 mt-3">✓ Lifetime Pro Active — unlimited generation</p>
          )}
        </motion.div>
      </motion.section>

      <motion.div
        className="container mx-auto px-6 py-20 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Your Content, Ready to Post</h2>
        {results ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <ResultsDisplay
              twitterThread={results.twitterThread}
              linkedinPost={results.linkedinPost}
              previewOnly={false}
              onCopy={handleCopy}
              copied={copied}
            />
            <div className="glass rounded-2xl p-8 border border-white/5">
              <h3 className="text-xl font-bold text-white mb-4">Preview of all formats</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 text-xs font-bold">𝕏</span>
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium mb-1">Twitter Thread</div>
                    <div className="text-slate-400 text-xs">@You</div>
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
        ) : (
          <motion.div
            className="max-w-5xl mx-auto text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <p className="text-slate-500 text-lg">Paste your content above and click Generate to see your repurposed content</p>
          </motion.div>
        )}
      </motion.div>

      <motion.footer
        className="container mx-auto px-6 py-8 text-center text-slate-500 text-sm relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.8 }}
      >
        <p>© 2026 Repurposer. Built with ❤️ for content creators.</p>
      </motion.footer>

      <FeaturesModal isOpen={showFeatures} onClose={() => setShowFeatures(false)} />
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
      {showFeedback && <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />}

      <motion.button
        onClick={() => setShowFeedback(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-indigo-600/30 transition-all shadow-lg shadow-indigo-500/25"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Send feedback"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>
    </main>
  );
}