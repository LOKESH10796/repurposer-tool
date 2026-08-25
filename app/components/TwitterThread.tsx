"use client";

import { useState } from 'react';

interface TwitterThreadProps {
  tweets: string[];
  previewOnly?: boolean;
}

export function TwitterThread({ tweets, previewOnly = false }: TwitterThreadProps) {
  const [expandedTweet, setExpandedTweet] = useState<number | null>(null);

  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8">
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
          <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-400 text-sm font-bold">𝕏</span>
              <span className="text-slate-500 text-xs">@You</span>
            </div>
            <p className="text-slate-200 whitespace-pre-wrap">
              {previewOnly ? tweet.substring(0, 150) + (tweet.length > 150 ? '...' : '') : tweet}
            </p>
            {previewOnly && tweet.length > 150 && (
              <button
                onClick={() => setExpandedTweet(expandedTweet === i ? null : i)}
                className="text-indigo-400 text-sm mt-2 hover:text-indigo-300"
              >
                {expandedTweet === i ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}