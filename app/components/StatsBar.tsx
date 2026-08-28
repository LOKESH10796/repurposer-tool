import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Crown, TrendingUp, Check, Zap, Flame, Shield, Heart, Trophy, Rocket, Gift, Users, BarChart2 } from 'lucide-react';

export function StatsBar() {
  return (
    <motion.div
      className="container mx-auto px-6 py-8 hidden md:flex justify-center items-center gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div className="flex-1 text-center border-r border-white/5 py-4 last:border-0">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp className="w-6 h-6 text-emerald-400" />
        </div>
        <div className="text-3xl font-bold text-white">1,247</div>
        <p className="text-sm text-slate-400">Content pieces repurposed today</p>
      </div>
      <div className="flex-1 text-center border-r border-white/5 py-4 last:border-0">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="w-6 h-6 text-amber-400" />
        </div>
        <div className="text-3xl font-bold text-white">8.3m</div>
        <p className="text-sm text-slate-400">Total reach generated</p>
      </div>
      <div className="flex-1 text-center border-r border-white/5 py-4 last:border-0">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-6 h-6 text-sky-400" />
        </div>
        <div className="text-3xl font-bold text-white">94%</div>
        <p className="text-sm text-slate-400">Avg. engagement boost</p>
      </div>
      <div className="flex-1 text-center py-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="w-6 h-6 text-pink-400" />
        </div>
        <div className="text-3xl font-bold text-white">2.1k</div>
        <p className="text-sm text-slate-400">Happy creators</p>
      </div>
    </motion.div>
  );
}