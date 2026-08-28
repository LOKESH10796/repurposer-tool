"use client";

import { motion } from 'framer-motion';
import { Check, X, Crown, Sparkles, Zap, TrendingUp, Shield, Gift, Clock } from 'lucide-react';

interface PricingCardProps {
  tier: string;
  price: string;
  period: string;
  description: string;
  features: Array<{ text: string; included: boolean; highlight?: boolean }>;
  cta: string;
  variant: 'free' | 'premium';
  badge?: string;
  gumroadUrl?: string;
}

export function PricingCard({
  tier,
  price,
  period,
  description,
  features,
  cta,
  variant,
  badge,
  gumroadUrl,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden"
    >
      {badge && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          {badge}
        </div>
      )}
      <div className={`relative p-8 rounded-2xl ${variant === 'premium' 
        ? 'overflow-hidden bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-indigo-900/20'
        : 'glass-card'}`}>
        {variant === 'premium' && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-pink-600/10 rounded-2xl" />
        )}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-xl font-bold text-white ${variant === 'premium' ? 'gradient-text-gold' : ''}`}>
              {tier}
            </h3>
            {variant === 'premium' && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-4 h-4" />
                <span>Lifetime access</span>
              </div>
            )}
          </div>
          <p className={`text-4xl font-extrabold text-transparent bg-clip-text ${
            variant === 'premium' 
              ? 'bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400' 
              : 'bg-gradient-to-r from-gray-400 to-gray-500'
          } mb-3`}>
            {price}
          </p>
          <p className="text-sm text-slate-400 mb-6">{period}</p>
          <p className="text-base text-slate-300 mb-6">{description}</p>
          
          <ul className="space-y-3 text-sm text-slate-300">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3"
              >
                {f.included ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <X className="w-4 h-4 text-red-400" />
                )}
                <span className={f.highlight ? 'font-medium text-white' : 'text-slate-400'}>
                  {f.text}
                </span>
              </motion.div>
            ))}
          </ul>
          
          {variant === 'premium' && gumroadUrl ? (
            <motion.a
              href={gumroadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full btn-premium btn-gold py-3 mt-6 flex items-center justify-center gap-2 text-base font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Crown className="w-4 h-4 inline-block mr-2" />
              {cta}
            </motion.a>
          ) : variant === 'premium' ? (
            <motion.button
              onClick={() => alert('Coming soon!')}
              className="w-full btn-premium btn-gold py-3 mt-6 flex items-center justify-center gap-2 text-base font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Crown className="w-4 h-4 inline-block mr-2" />
              {cta}
            </motion.button>
          ) : (
            <motion.button
              onClick={() => window.location.href = '/#pricing'}
              className="w-full btn-premium btn-secondary py-3 mt-6 flex items-center justify-center gap-2 text-base font-semibold"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {cta}
            </motion.button>
          )}
          
          <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400">
            <div className="flex items-center justify-between">
              <span>
                <Gift className="w-4 h-4 text-indigo-400" />
                No hidden fees
              </span>
              <span>
                <Shield className="w-4 h-4 text-emerald-400" />
                30-day refund
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}