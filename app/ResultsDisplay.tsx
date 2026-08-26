"use client";

import { useSearchParams } from 'next/navigation';
import { TwitterThread } from './components/TwitterThread';
import { LinkedInPost } from './components/LinkedInPost';
import { PricingModal } from './components/PricingModal';

export function ResultsDisplay({ twitterThread, linkedinPost, onCopy, copied, previewOnly }: { twitterThread: string[]; linkedinPost: string; onCopy: (text: string, index: number) => void; copied: number | null; previewOnly?: boolean }) {
  const searchParams = useSearchParams();
  const isPaid = searchParams.get('paid') === 'true';
  const showFull = isPaid || previewOnly === false;

  if (showFull) {
    return (
      <div className="space-y-6">
        <TwitterThread tweets={twitterThread} onCopy={onCopy} copied={copied} />
        <LinkedInPost post={linkedinPost} onCopy={onCopy} copied={copied} />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="space-y-6">
        <TwitterThread tweets={twitterThread} previewOnly onCopy={onCopy} copied={copied} />
        <LinkedInPost post={linkedinPost} previewOnly onCopy={onCopy} copied={copied} />
      </div>
      <div className="absolute bottom-0 left-0 w-full h-3/4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent backdrop-blur-[2px] flex items-end justify-center pb-10 z-10">
        <PricingModal twitterContent={twitterThread} linkedinContent={linkedinPost} />
      </div>
    </div>
  );
}