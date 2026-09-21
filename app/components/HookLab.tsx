"use client";

import { motion } from 'framer-motion';
import { MousePointerClick, SkipForward, FlaskConical } from 'lucide-react';

export interface HookOption {
  label: string;
  text: string;
}

interface HookLabProps {
  hooks: HookOption[];
  selected: number | null;
  onSelect: (index: number | null) => void;
  onConfirm: () => void;
  streaming?: boolean;
}

export function HookLab({ hooks, selected, onSelect, onConfirm, streaming }: HookLabProps) {
  if (hooks.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto glass-card-premium rounded-3xl p-6 md:p-8 border border-amber-500/20"
    >
      <div className="flex items-center gap-2 mb-1">
        <FlaskConical className="w-5 h-5 text-amber-400" />
        <h3 className="text-xl font-bold text-white">Hook Laboratory</h3>
      </div>
      <p className="text-sm text-slate-400 mb-5">
        Pick the opening angle — it becomes a hard constraint on all 6 streams. Or skip for full-auto.
      </p>
      <div className="grid md:grid-cols-2 gap-3">
        {hooks.map((h, i) => {
          const active = selected === i;
          return (
            <button
              key={i}
              onClick={() => onSelect(active ? null : i)}
              className={`text-left rounded-xl p-4 border transition-all ${
                active
                  ? 'bg-amber-500/10 border-amber-400/50 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-800/40 border-white/10 hover:border-amber-500/30'
              }`}
            >
              <span
                className={`inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${
                  active ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-700/60 text-slate-300'
                }`}
              >
                {h.label}
              </span>
              <p className="text-slate-100 text-sm leading-relaxed">{h.text}</p>
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3 mt-5">
        <button
          onClick={onConfirm}
          disabled={streaming}
          className="btn-premium btn-gold px-6 py-3 text-sm disabled:opacity-50"
        >
          <MousePointerClick className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
          {selected !== null ? 'Generate with this hook' : 'Generate (auto hooks)'}
        </button>
        {selected !== null && (
          <button
            onClick={() => onSelect(null)}
            className="px-5 py-3 text-sm text-slate-300 hover:text-white transition-colors"
          >
            <SkipForward className="w-4 h-4 inline-block mr-1 -mt-0.5" /> Clear selection
          </button>
        )}
      </div>
    </motion.div>
  );
}
