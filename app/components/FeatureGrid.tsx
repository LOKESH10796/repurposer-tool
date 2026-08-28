"use client";

import { motion } from 'framer-motion';
import { Sparkles, Zap, TrendingUp, Brain, Shield, Rocket, Users, Award, Heart, Clock, Star, ShieldCheck, Infinity, CheckCircle2, BarChart3, Flame } from 'lucide-react';

export function FeatureGrid() {
  return (
    <motion.section
      id="features"
      className="container mx-auto px-6 py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Features</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Built for serious creators who ship
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Every feature engineered to save you 10+ hours per week on content distribution.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Feature 1 */}
        <motion.div
          key="1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card-premium rounded-2xl p-6"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-300" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">1-Click Repurpose</h3>
          <p className="text-sm text-slate-400">
            Paste any content → get Twitter thread + LinkedIn post + newsletter in seconds. No prompts to learn, no settings to tweak.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Save 45+ minutes per piece</span>
          </div>
        </motion.div>

        {/* Feature 2 */}
        <motion.div
          key="2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card-premium rounded-2xl p-6"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-indigo-300" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Viral Hook Optimization</h3>
          <p className="text-sm text-slate-400">
            Our AI doesn't just rewrite — it rewrites for maximum engagement. Platform-native hooks that stop the scroll and drive action.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>2-5x more engagement</span>
          </div>
        </motion.div>

        {/* Feature 3 */}
        <motion.div
          key="3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass-card-premium rounded-2xl p-6"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-indigo-300" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Platform-Native Formatting</h3>
          <p className="text-sm text-slate-400">
            Outputs are pre-formatted for each platform: Twitter threads with proper spacing, LinkedIn with line breaks, newsletters with scannable sections.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>Zero manual tweaking</span>
          </div>
        </motion.div>

        {/* Feature 4 */}
        <motion.div
          key="4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="glass-card-premium rounded-2xl p-6"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
              <Rocket className="w-6 h-6 text-indigo-300" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Unlimited Generation</h3>
          <p className="text-sm text-slate-400">
            Pay once, repurpose forever. No monthly fees, no usage caps, no surprise bills. Your lifetime pass includes all current and future features.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <Infinity className="w-3 h-3 text-emerald-400" />
            <span>Forever access</span>
          </div>
        </motion.div>

        {/* Feature 5 */}
        <motion.div
          key="5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="glass-card-premium rounded-2xl p-6"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-indigo-300" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Team & Collaboration</h3>
          <p className="text-sm text-slate-400">
            Share generations with team members, clients, or collaborators. Perfect for agencies, content teams, and solopreneurs with VAs.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <Award className="w-3 h-3 text-emerald-400" />
            <span>Unlimited seats</span>
          </div>
        </motion.div>

        {/* Feature 6 */}
        <motion.div
          key="6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="glass-card-premium rounded-2xl p-6"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
              <Heart className="w-6 h-6 text-indigo-300" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Money-Back Guarantee</h3>
          <p className="text-sm text-slate-400">
            Try it risk-free for 30 days. If you don't love it, we'll refund you — no questions asked. We only win when you win.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>30-day refund</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}