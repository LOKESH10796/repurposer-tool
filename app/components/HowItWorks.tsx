"use client";

import { motion } from 'framer-motion';
import { Sparkles, Zap, TrendingUp, FileText, Mic, NotebookPen, Brain, ArrowRight, CheckCircle2, Shield, Clock } from 'lucide-react';

export function HowItWorks() {
  return (
    <motion.section
      id="how-it-works"
      className="container mx-auto px-6 py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">How it works</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          From paste to post in 3 simple steps
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          No complicated workflows. Just paste your content and let our AI do the heavy lifting.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Step 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center gap-6 text-center p-8 glass-card-premium rounded-2xl"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-indigo-300" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">1. Paste Your Content</h3>
          <p className="text-sm text-slate-400">
            Drop in a blog post, video transcript, podcast notes, or any raw content. Works with any length or format.
          </p>
          <div className="mt-6 w-full h-1 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5 }}
            />
          </div>
        </motion.div>

        {/* Step 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col items-center gap-6 text-center p-8 glass-card-premium rounded-2xl"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-indigo-300" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">2. AI Gets to Work</h3>
          <p className="text-sm text-slate-400">
            Our elite ghostwriter engine analyzes your content, extracts key insights, and crafts platform-native variations optimized for engagement.
          </p>
          <div className="mt-6 flex items-center justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="h-2 w-2 rounded-full bg-indigo-500/30"
                initial={{ scale: 0.3 }}
                animate={{ scale: [0.3, 1, 0.8, 1] }}
                transition={{ delay: i * 0.1, type: "spring", damping: 20, stiffness: 100 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Step 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col items-center gap-6 text-center p-8 glass-card-premium rounded-2xl"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-4">
            <ArrowRight className="w-8 h-8 text-indigo-300" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">3. Copy & Post</h3>
          <p className="text-sm text-slate-400">
            Get ready-to-post Twitter threads, LinkedIn posts, newsletter drafts, and more. One-click copy to any platform.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <div className="glass-card rounded-xl p-3">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-white">Twitter</span>
            </div>
            <div className="glass-card rounded-xl p-3">
              <Zap className="w-4 h-4 text-sky-400" />
              <span className="text-xs text-white">LinkedIn</span>
            </div>
            <div className="glass-card rounded-xl p-3">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-white">Newsletter</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Process badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="mt-16 flex items-center justify-center gap-4 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
      >
        <Clock className="w-4 h-4 text-emerald-400" />
        <span className="text-sm font-medium text-white">Average processing time: 8-12 seconds</span>
        <Shield className="w-4 h-4 text-emerald-400" />
        <span className="text-sm font-medium text-white">99.2% success rate</span>
      </motion.div>
    </motion.section>
  );
}