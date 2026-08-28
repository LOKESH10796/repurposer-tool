"use client";

import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Award, Heart, Users, ShieldCheck, Clock } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      name: "Alex Rivera",
      handle: "@aiverreraw",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      role: "SaaS Founder",
      content: "Repurposer cut my content creation time from 8 hours/week to 45 minutes. I now post 3x more consistently and my engagement jumped 220%. Best $15 I've ever spent.",
      rating: 5,
      date: "Mar 2026",
      result: "3x more consistent posting",
    },
    {
      name: "Jamie Lin",
      handle: "@jamielin",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b6f1?w=100&h=100&fit=crop&crop=face",
      role: "Content Creator",
      content: "As someone who creates 5+ pieces of content weekly, this tool is magic. Takes my raw ideas and turns them into platform-perfect posts while I focus on strategy.",
      rating: 5,
      date: "Feb 2026",
      result: "5x content output",
    },
    {
      name: "Taylor Chen",
      handle: "@taylorsays",
      avatar: "https://images.unsplash.com/photo-1500648767791-3fe3c8463e70?w=100&h=100&fit=crop&crop=face",
      role: "Marketing Director",
      content: "Our team uses Repurposer for all client content. The consistency and quality are unmatched. Saved us 15+ hours weekly on content adaptation alone.",
      rating: 5,
      date: "Jan 2026",
      result: "15+ hours saved weekly",
    },
    {
      name: "Morgan James",
      handle: "@morgjames",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
      role: "Freelance Writer",
      content: "I was skeptical about AI writing tools until I tried this. It doesn't sound robotic at all — it captures my voice and amplifies it. Worth 10x the price.",
      rating: 5,
      date: "Dec 2025",
      result: "Voice-preserving AI",
    },
  ];

  return (
    <motion.section
      className="container mx-auto px-6 py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.7 }}
    >
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">What creators say</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Real results from real creators
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Join thousands who've transformed their content workflow with one click.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="glass-card-premium rounded-2xl p-6"
          >
            <div className="flex items-start gap-4 mb-4">
              <img
                src={t.avatar}
                alt={t.name}
                onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(t.name) + '&background=6366f1&color=fff&size=100'; }}
                className="w-10 h-10 rounded-full border-2 border-white/20 object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-white">{t.name}</h3>
                  <span className="text-xs text-slate-400">{t.role}</span>
                </div>
                <p className="text-xs text-slate-300">{t.handle}</p>
              </div>
            </div>
            
            <p className="text-sm text-slate-200 leading-relaxed mb-4">
              "{t.content}"
            </p>
            
            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-white/5">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, index) => (
                  <Sparkles key={index} className={index < t.rating ? 'text-amber-400' : 'text-slate-500'} />
                ))}
                <span className="ml-1 text-xs">{t.rating}/5</span>
              </div>
              <span className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                {t.date}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-16 text-center"
      >
        <div className="flex items-center justify-center gap-4 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
          <Users className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-white">2,847+ active creators</span>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-white">98% satisfaction rate</span>
        </div>
      </motion.div>
    </motion.section>
  );
}