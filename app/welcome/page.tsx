"use client";

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, Crown, Check, Rocket, Zap } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

export default function Welcome() {
  const { user, isSignedIn } = useUser();
  const [isPro, setIsPro] = useState(false);
  const [checked, setChecked] = useState(false);
  const reducedMotion = useReducedMotion();

  // Check if user has pro metadata from Clerk
  useEffect(() => {
    const checkProStatus = async () => {
      if (isSignedIn && user) {
        // In a real app, you might refetch user to get latest metadata
        // For now, we rely on the initial user object from useUser()
        setIsPro(!!user?.publicMetadata?.pro);
        setChecked(true);
      }
    };

    checkProStatus();

    // Poll for up to 10 seconds for webhook to update metadata
    let attempts = 0;
    const interval = setInterval(() => {
      if (checked || attempts >= 20) {
        clearInterval(interval);
        return;
      }
      checkProStatus();
      attempts++;
    }, 500);

    return () => clearInterval(interval);
  }, [isSignedIn, user, checked]);

  // Trigger confetti animation
  useEffect(() => {
    if (reducedMotion) return;
    // Only run confetti in the browser
    if (typeof window === 'undefined') return;

    import('canvas-confetti').then(({ default: confetti }) => {
      const duration = 2 * 1000;
      const end = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(() => {
        const timeLeft = end - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        (() => {
          confetti(
            Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
          );
          (() => {
            confetti(
              Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
            );
          })();
        })();
      }, 250);
      return () => clearInterval(interval);
    });
  }, [reducedMotion]);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Confetti container */}
      <div className="fixed inset-0 pointer-events-none" />

      <motion.div
        className="text-center space-y-8 bg-white/10 backdrop-blur-xl rounded-3xl p-10 max-w-md w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="flex items-center justify-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <Crown className="w-10 h-10" />
          </div>
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <Check className="w-10 h-10" />
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to Repurposer Pro! 🎉
        </h1>

        <p className="text-lg">
          Your lifetime access is <span className="font-semibold">being activated</span>.
          This usually takes just a few seconds.
        </p>

        {!isPro && !checked ? (
          <p className="text-sm text-white/80">
            We're verifying your purchase... <span className="animate-pulse">•••</span>
          </p>
        ) : isPro ? (
          <>
            <p className="text-sm text-white/80">
              Your Pro access is now active! <span className="text-indigo-400 font-semibold">Unlock unlimited generations.</span>
            </p>
            <div className="mt-4 flex items-center justify-center space-x-3">
              <motion.button
                onClick={() => {
                  // Redirect to home with a flag to show Pro status
                  window.location.href = '/';
                }}
                className="btn-premium btn-gold px-6 py-3 text-base font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Rocket className="w-5 h-5 inline-block mr-2" />
                Start Creating
              </motion.button>
              <motion.button
                onClick={() => {
                  window.location.href = '/#pricing';
                }}
                className="btn-premium btn-secondary px-6 py-3 text-base font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-5 h-5 inline-block mr-2" />
                See All Features
              </motion.button>
            </div>
          </>
        ) : (
          <p className="text-sm text-white/80">
            It looks like your purchase hasn't been processed yet. Please check your email for the receipt and try again in a moment.
          </p>
          <motion.button
            onClick={() => {
              window.location.href = '/#pricing';
            }}
            className="btn-premium btn-secondary px-6 py-3 text-base font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap className="w-5 h-5 inline-block mr-2" />
            Try Again
          </motion.button>
        )}
      </motion.div>

      <p className="mt-6 text-xs text-white/60">
        Need help? Reply to your Gumroad receipt email or visit{' '}
        <a href="https://repurposer-tool.vercel.app#faq" className="text-white hover:text-indigo-300 underline">
          our FAQ
        </a>
      </p>
    </motion.div>
  );
}