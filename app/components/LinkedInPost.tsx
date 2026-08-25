"use client";

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface LinkedInPostProps {
  post: string;
  previewOnly?: boolean;
  onCopy?: (text: string, index: number) => void;
  copied?: number | null;
}

export function LinkedInPost({ post, previewOnly = false, onCopy, copied }: LinkedInPostProps) {
  const [expanded, setExpanded] = useState(false);

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
        <div className="w-10 h-10 bg-sky-600/20 rounded-xl flex items-center justify-center">
          <span className="text-sky-400 text-xl font-bold">in</span>
        </div>
        <div>
          <div className="text-white text-lg font-semibold">LinkedIn Insight</div>
          <div className="text-slate-400 text-sm">Professional post with key takeaways</div>
        </div>
      </div>

      <div className="prose prose-invert max-w-none">
        <div className="text-slate-200 whitespace-pre-wrap leading-relaxed">
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
          className="text-indigo-400 text-sm mt-4 hover:text-indigo-300 transition-colors"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}

      <button
        onClick={() => handleCopy(post, 0)}
        className="flex items-center gap-1.5 mt-4 text-xs text-slate-400 hover:text-white transition-colors"
      >
        {copied === 0 ? (
          <>
            <Check className="w-3.5 h-3.5 text-green-400" />
            <span className="text-green-400">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Copy LinkedIn post</span>
          </>
        )}
      </button>
    </div>
  );
}