"use client";

interface PricingModalProps {
  twitterContent: string[];
  linkedinContent: string;
}

export function PricingModal({ twitterContent, linkedinContent }: PricingModalProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm z-10" />
      <div className="glass-card rounded-2xl p-8 max-w-md w-full shadow-2xl relative z-20">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h3 className="text-2xl font-bold text-white mb-2">Unlock Full Content Pack</h3>
          <p className="text-slate-400 mb-6">
            Get access to all {twitterContent.length} tweets and the complete LinkedIn post
          </p>
          <div className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-6 glow-text">$15</div>
          <a
            href="https://gumroad.com/a/buy"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/25"
          >
            Unlock Now →
          </a>
          <p className="text-slate-500 text-xs mt-4">
            Secure payment. Instant access after purchase.
          </p>
        </div>
      </div>
    </div>
  );
}