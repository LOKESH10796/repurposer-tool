"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Star, Zap, Clock, Mail, Check, Copy, Download } from 'lucide-react';

const formatMap = {
  twitter: { icon: Users, label: 'Twitter Thread' },
  linkedin: { icon: TrendingUp, label: 'LinkedIn Post' },
  newsletter: { icon: Mail, label: 'Newsletter' },
  instagram: { icon: Star, label: 'Instagram Caption' },
  reddit: { icon: Zap, label: 'Reddit Post' },
  threads: { icon: Clock, label: 'Threads Post' },
};

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="glass-card rounded-xl p-6 border border-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-slate-700/50 animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-700/50 rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-slate-700/30 rounded w-1/2 animate-pulse" />
            </div>
          </div>
          <div className="h-3 bg-slate-700/30 rounded w-full animate-pulse" />
          <div className="h-3 bg-slate-700/30 rounded w-2/3 animate-pulse" />
        </motion.div>
      ))}
    </div>
  );
}

export function FormatSelector({ formats, setFormats }: { formats: string[]; setFormats: (v: string[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(formatMap).map(([id, { icon: Icon, label }]) => (
        <motion.button
          key={id}
          onClick={() => setFormats(formats.includes(id)
            ? formats.filter(x => x !== id)
            : [...formats, id]
          )}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
            formats.includes(id)
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              : 'bg-slate-800/40 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 border-white/5'
          }`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Icon className="w-3.5 h-3.5" />
          {label}
        </motion.button>
      ))}
    </div>
  );
}

export function CopyButton({ text, onCopy }: { text: string; onCopy: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 transition-all"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
      <span className="text-xs text-slate-300">{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  );
}

export function DownloadButton({ text, onDownload }: { text: string; onDownload: () => void }) {
  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `repurposed-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onDownload();
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 transition-all"
      title="Download as file"
    >
      <Download className="w-4 h-4 text-slate-400" />
      <span className="text-xs text-slate-300">Download</span>
    </button>
  );
}