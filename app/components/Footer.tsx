"use client";

import { motion } from 'framer-motion';
import { Sparkles, Zap, TrendingUp, Shield, Heart, Gift, Users, Award, Clock, Code, GitBranch, Mail, X } from 'lucide-react';

export function Footer() {
  return (
    <motion.footer
      className="container mx-auto px-6 py-12 text-center text-slate-400"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ duration: 0.4 }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <span className="text-white font-bold text-xl tracking-tight">
            Repurposer<span className="text-indigo-400">.</span>ai
          </span>
        </div>
        <p className="text-sm max-w-2xl">
          Transform your ideas into platform-perfect content with AI-powered repurposing.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-left mb-8">
        <div className="space-y-3">
          <h4 className="font-semibold text-white mb-2">Product</h4>
          <p className="text-slate-400">How it works</p>
          <p className="text-slate-400">Features</p>
          <p className="text-slate-400">Pricing</p>
          <p className="text-slate-400">Roadmap</p>
          <p className="text-slate-400">Status</p>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold text-white mb-2">Company</h4>
          <p className="text-slate-400">About</p>
          <p className="text-slate-400">Blog</p>
          <p className="text-slate-400">Careers</p>
          <p className="text-slate-400">Press</p>
          <p className="text-slate-400">Contact</p>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold text-white mb-2">Legal</h4>
          <p className="text-slate-400">Terms of Service</p>
          <p className="text-slate-400">Privacy Policy</p>
          <p className="text-slate-400">Cookie Policy</p>
          <p className="text-slate-400">Security</p>
          <p className="text-slate-400">GDPR</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mb-8">
        <a href="#" className="text-slate-400 hover:text-white transition-colors">Twitter</a>
        <a href="#" className="text-slate-400 hover:text-white transition-colors">LinkedIn</a>
        <a href="#" className="text-slate-400 hover:text-white transition-colors">YouTube</a>
        <a href="#" className="text-slate-400 hover:text-white transition-colors">Instagram</a>
        <a href="#" className="text-slate-400 hover:text-white transition-colors">Discord</a>
      </div>

      <div className="border-t border-slate-700/50 pt-6">
        <p className="text-sm text-slate-500">
          © 2026 Repurposer. All rights reserved. Made with ❤️ for creators.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-slate-400">
          <span>Terms</span>
          <span>Privacy</span>
          <span>Cookies</span>
          <span>Security</span>
        </div>
      </div>
    </motion.footer>
  );
}