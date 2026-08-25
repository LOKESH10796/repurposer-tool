"use client";

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface TwitterThreadProps {
  tweets: string[];
  previewOnly?: boolean;
  onCopy?: (text: string, index: number) => void;
  copied?: number | null;
}

export function TwitterThread({ tweets, previewOnly = false, onCopy, copied }: TwitterThreadProps) {
  const [expandedTweet, setExpandedTweet] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    if (onCopy) onCopy(text, index);
    else {
      navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    }
  };

  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
          <span className="text-blue-400 text-2xl">𝕏</span>
        </div>
        <div>
          <div className="text-white text-lg font-semibold">Twitter Thread</div>
          <div className="text-slate-400 text-sm">Ready to post — {tweets.length} tweets</div>
        </div>
      </div>

      <div className="space-y-4">
        {tweets.map((tweet, i) => (
          <div key={i} className="glass-card rounded-xl p-5 border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-blue-400 text-sm font-bold">𝕏</span>
              <span className="text-slate-500 text-xs">@You</span>
            </div>
            <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
              {previewOnly ? tweet.substring(0, 150) + (tweet.length > 150 ? '...' : '') : tweet}
            </p>
            {previewOnly && tweet.length > 150 && (
              <button
                onClick={() => setExpandedTweet(expandedTweet === i ? null : i)}
                className="text-indigo-400 text-sm mt-3 hover:text-indigo-300 transition-colors"
              >
                {expandedTweet === i ? 'Show less' : 'Show more'}
              </button>
            )}
            <button
              onClick={() => handleCopy(tweet, i)}
              className="flex items-center gap-1.5 mt-3 text-xs text-slate-400 hover:text-white transition-colors"
            >
              {copied === i ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy tweet</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}