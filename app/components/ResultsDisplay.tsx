"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Download, Sparkles, AlertCircle, Zap, BarChart3, Flame, Loader2 } from 'lucide-react';

export type RefineModifier = 'punchier' | 'metric' | 'contrarian';

export interface GeneratedContent {
  twitterThread?: string[];
  linkedinPost?: string;
  newsletter?: string;
  instagramCaption?: string;
  redditPost?: { title: string; body: string };
  threadsPost?: string[];
}

interface FormatResult {
  id: string;
  label: string;
  content: string;
  type: 'text' | 'thread' | 'object';
}

interface ResultsDisplayProps {
  twitterThread?: string[];
  linkedinPost?: string;
  newsletter?: string;
  instagramCaption?: string;
  redditPost?: { title: string; body: string };
  threadsPost?: string[];
  onCopy?: (text: string, index?: number) => void;
  copied?: number | null;
  previewOnly?: boolean;
  streamingFormats?: string[];
  onRefine?: (formatId: string, modifier: RefineModifier) => void;
  refiningFormat?: string | null;
}

const REFINE_BUTTONS: Array<{ modifier: RefineModifier; label: string; icon: typeof Zap }> = [
  { modifier: 'punchier', label: 'Punchier', icon: Zap },
  { modifier: 'metric', label: 'Add metric', icon: BarChart3 },
  { modifier: 'contrarian', label: 'Contrarian', icon: Flame },
];

export function ResultsDisplay({
  twitterThread,
  linkedinPost,
  newsletter,
  instagramCaption,
  redditPost,
  threadsPost,
  onCopy,
  copied,
  previewOnly = false,
  streamingFormats = [],
  onRefine,
  refiningFormat = null,
}: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState<string>('twitter');

  const formatResults: FormatResult[] = [
    { id: 'twitter', label: 'Twitter Thread', content: twitterThread?.join('\n') || '', type: 'thread' },
    { id: 'linkedin', label: 'LinkedIn Post', content: linkedinPost || '', type: 'text' },
    { id: 'newsletter', label: 'Newsletter', content: newsletter || '', type: 'text' },
    { id: 'instagram', label: 'Instagram', content: instagramCaption || '', type: 'text' },
    { id: 'reddit', label: 'Reddit', content: redditPost?.body || '', type: 'object' },
    { id: 'threads', label: 'Threads', content: threadsPost?.join('\n') || '', type: 'thread' },
  ];

  const activeResult = formatResults.find(r => r.id === activeTab);

  const handleCopy = async (text: string, index?: number) => {
    await navigator.clipboard.writeText(text);
    onCopy?.(text, index);
  };

  const handleDownload = (text: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `repurposed-${activeTab}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!activeResult) return null;

  return (
    <motion.div
      className="glass-card-premium rounded-2xl p-6 md:p-8 border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {formatResults.map((result) => (
          <button
            key={result.id}
            onClick={() => setActiveTab(result.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === result.id
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-slate-800/40 text-slate-400 hover:text-slate-200 border border-white/5'
            }`}
          >
            {result.label}
            {streamingFormats.includes(result.id) && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content display */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {activeResult.type === 'thread' ? (
              <div className="space-y-3">
                {onRefine && !previewOnly && activeResult.content && (
                  <RefineBar
                    formatId={activeTab}
                    refining={refiningFormat === activeTab}
                    streaming={streamingFormats.includes(activeTab)}
                    onRefine={onRefine}
                  />
                )}
                {((activeResult.content as unknown as string[])).map((tweet, index) => (
                  <motion.div
                    key={index}
                    className="glass rounded-xl p-4 border border-white/5 hover:border-indigo-500/20 transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{tweet}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <CopyButton text={tweet} onCopy={() => handleCopy(tweet, index)} />
                      <DownloadButton text={tweet} onDownload={() => handleDownload(tweet)} />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="glass rounded-xl p-6 border border-white/5">
                <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{activeResult.content}</p>
                <div className="flex items-center gap-2 mt-4">
                  <CopyButton text={activeResult.content} onCopy={() => handleCopy(activeResult.content)} />
                  <DownloadButton text={activeResult.content} onDownload={() => handleDownload(activeResult.content)} />
                </div>
                {onRefine && !previewOnly && activeResult.content && (
                  <RefineBar
                    formatId={activeTab}
                    refining={refiningFormat === activeTab}
                    streaming={streamingFormats.includes(activeTab)}
                    onRefine={onRefine}
                  />
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Character count */}
      <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
        <span>{activeResult.content.length} characters</span>
        <span>{activeResult.content.split(/\s+/).filter(Boolean).length} words</span>
      </div>
    </motion.div>
  );
}

function CopyButton({ text, onCopy }: { text: string; onCopy: () => void }) {
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

function DownloadButton({ text, onDownload }: { text: string; onDownload: () => void }) {
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

function RefineBar({
  formatId,
  refining,
  streaming,
  onRefine,
}: {
  formatId: string;
  refining: boolean;
  streaming: boolean;
  onRefine: (formatId: string, modifier: RefineModifier) => void;
}) {
  const disabled = refining || streaming;
  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/5">
      <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mr-1">Humanize</span>
      {REFINE_BUTTONS.map(({ modifier, label, icon: Icon }) => (
        <button
          key={modifier}
          disabled={disabled}
          onClick={() => onRefine(formatId, modifier)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-200 transition-all disabled:opacity-40"
        >
          {refining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" />}
          {modifier === 'punchier' ? '⚡ ' : modifier === 'metric' ? '📊 ' : '🌶️ '}{label}
        </button>
      ))}
    </div>
  );
}