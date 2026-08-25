"use client";

import { useState } from 'react';

interface PricingModalProps {
  twitterContent: string[];
  linkedinContent: string;
}

export function PricingModal({ twitterContent, linkedinContent }: PricingModalProps) {
  const [isPaying, setIsPaying] = useState(false);

  const handlePayment = async () => {
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          twitterContent,
          linkedinContent,
          amount: 15,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Payment failed. Please try again.');
      }
    } catch (error) {
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm z-10">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Unlock Full Content Pack</h3>
            <p className="text-slate-600 mb-6">
              Get access to all {twitterContent.length} tweets and the complete LinkedIn post
            </p>
            <div className="text-4xl font-bold text-indigo-600 mb-6">$15</div>
            <button
              onClick={handlePayment}
              disabled={isPaying}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50"
            >
              {isPaying ? 'Processing...' : 'Unlock Now'}
            </button>
            <p className="text-slate-500 text-xs mt-4">
              Secure payment via Stripe. Instant access after purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}