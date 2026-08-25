"use client";

import { useState } from 'react';

interface LinkedInPostProps {
  post: string;
  previewOnly?: boolean;
}

export function LinkedInPost({ post, previewOnly = false }: LinkedInPostProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-sky-600/20 rounded-xl flex items-center justify-center">
          <span className="text-sky-400 text-xl font-bold">in</span>
        </div>
        <div>
          <div className="text-white text-lg font-semibold">LinkedIn Insight</div>
          <div className="text-slate-400 text-sm">Professional post with key takeaways</div>
        </div>
      </div>

      <div className="prose prose-invert max-w-none">
        <div className="text-slate-200 whitespace-pre-wrap">
          {previewOnly ? (
            post.substring(0, 150) + (post.length > 150 ? '...' : '')
          ) : (
            expanded ? post : post.substring(0, 150) + '...'
          )}
        </div>
      </div>

      {previewOnly && post.length > 150 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-indigo-400 text-sm mt-4 hover:text-indigo-300"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}