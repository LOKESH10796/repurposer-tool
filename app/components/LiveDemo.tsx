"use client";

import { motion } from 'framer-motion';
import { Sparkles, Zap, TrendingUp, Flame, FileText } from 'lucide-react';

export function LiveDemo() {
  return (
    <motion.div
      className="container mx-auto px-6 py-16 hidden lg:block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">See it in action</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Watch 1 blog post become 5 platform-ready posts
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          No fluff. No setup. Just paste and go.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Input */}
        <motion.div
          className="glass-card-premium rounded-2xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-center mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
              <FileText className="w-4 h-4 text-indigo-300" />
            </div>
            <h4 className="text-lg font-semibold text-white">Input</h4>
          </div>
          <div className="h-36 bg-slate-900/30 rounded-xl border border-white/5 p-2 overflow-hidden">
            <div className="text-sm text-slate-400 p-2 leading-relaxed h-full" style={{ lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
              {`The future of work isn't remote or hybrid — it's asynchronous. Companies that master async communication will outperform those stuck in meetings all day. Here's why:

1. Deep work requires uninterrupted blocks
2. Global teams need overlap flexibility
3. Written communication creates clarity
4. Meetings are the tax you pay for lack of preparation`}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-xs">
            <span>142 words</span>
            <span>~45 sec read</span>
          </div>
        </motion.div>

        {/* Arrow */}
        <motion.div
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Sparkles className="w-10 h-10 text-indigo-400 mb-2 animate-pulse" />
          <div className="w-1 h-24 bg-gradient-to-br from-indigo-500 to-purple-600" />
          <span className="text-xs text-indigo-300">AI processing</span>
        </motion.div>

        {/* Output */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-sky-500/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-300" />
              </div>
              <h4 className="text-lg font-semibold text-white">Output</h4>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                3.2x engagement
              </span>
              <span className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                Ready in 8s
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div className="glass-card rounded-xl p-4 border border-white/5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-blue-400 text-xs font-bold">𝕏</span>
                </div>
                <div>
                  <p className="text-sm text-slate-200 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                    {`The future of work isn't remote or hybrid — it's asynchronous.

🔥 Here's why async wins:
1️⃣ Deep work needs uninterrupted blocks
2️⃣ Global teams need overlap flexibility
3️⃣ Written = clarity & accountability
4️⃣ Meetings = tax for poor prep

Stop scheduling. Start shipping.

// async > meetings`}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <ButtonCopy />
                    <ButtonCopy />
                  </div>
                </div>
              </div>
            </div>
            <div className="glass-card rounded-xl p-4 border border-white/5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-sky-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-sky-400 text-xs font-bold">in</span>
                </div>
                <div>
                  <p className="text-sm text-slate-200 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                    {`Why asynchronous work is the future (and how to implement it)

The shift to async isn't just about flexibility — it's a competitive advantage.

Top performers in 2026 will be those who master communication without constant meetings.

Key principles:
• Protect deep work blocks
• Over-communicate in writing
• Default to async, meet only when necessary
• Measure output, not hours

The companies winning tomorrow are building async-first cultures today.`}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <ButtonCopy />
                    <ButtonCopy />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Helper button for demo
function ButtonCopy() {
  return (
    <button className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
      <Sparkles className="w-3 h-3" />
      Copy
    </button>
  );
}