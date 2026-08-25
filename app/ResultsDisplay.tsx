"use client";

import { useSearchParams } from 'next/navigation';
import { TwitterThread } from './components/TwitterThread';
import { LinkedInPost } from './components/LinkedInPost';
import { PricingModal } from './components/PricingModal';

export function ResultsDisplay({ twitterThread, linkedinPost }: { twitterThread: string[]; linkedinPost: string }) {
  const searchParams = useSearchParams();
  const isPaid = searchParams.get('paid') === 'true';

  if (isPaid) {
    return (
      <div className="space-y-6">
        <TwitterThread tweets={twitterThread} />
        <LinkedInPost post={linkedinPost} />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="space-y-6">
        <TwitterThread tweets={twitterThread} previewOnly />
        <LinkedInPost post={linkedinPost} previewOnly />
      </div>
      <div className="absolute bottom-0 left-0 w-full h-3/4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent backdrop-blur-[2px] flex items-end justify-center pb-10 z-10">
        <PricingModal twitterContent={twitterThread} linkedinContent={linkedinPost} />
      </div>
    </div>
  );
}