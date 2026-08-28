"use client";

import { motion } from 'framer-motion';
import { Sparkles, Zap, CheckCircle2, Shield, Sparkle, TrendingUp, Users, Award, Heart, Clock, MessageSquare, Settings, GitCommit, Code, FileText } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  icon: typeof Sparkles;
  bgColor: string;
}

export function FAQ() {
  const faqItems: FAQItem[] = [
    {
      question: "How does Repurposer actually work?",
      answer: "Our AI analyzes your input content, extracts key insights, themes, and tone, then generates platform-native variations optimized for each channel's algorithm and audience expectations. It's not just rewriting — it's strategic repurposing.",
      icon: Sparkles,
      bgColor: "from-indigo-500/10 via-purple-500/10 to-pink-500/10"
    },
    {
      question: "What content types work best?",
      answer: "Blog posts, articles, video transcripts, podcast transcripts, newsletters, presentation slides, meeting notes, and even rough bullet-point ideas work great. The more substance you provide, the better the output.",
      icon: FileText,
      bgColor: "from-purple-500/10 via-pink-500/10 to-red-500/10"
    },
    {
      question: "Is my content safe and private?",
      answer: "Absolutely. We don't store your content longer than needed for processing. All generations happen in real-time and nothing is saved to our servers after the session ends. Your ideas stay yours.",
      icon: Shield,
      bgColor: "from-emerald-500/10 via-teal-500/10 to-blue-500/10"
    },
    {
      question: "Can I edit the generated content?",
      answer: "Yes! The output is fully editable. Think of it as a brilliant first draft from your elite ghostwriter — you get to review, tweak, and approve before posting. One-click copy makes it easy to use anywhere.",
      icon: CheckCircle2,
      bgColor: "from-green-500/10 via-lime-500/10 to-yellow-500/10"
    },
    {
      question: "What platforms do you support?",
      answer: "Currently: Twitter/X threads, LinkedIn posts, and newsletter drafts. We're actively working on Instagram captions, Twitter/X long-form, Reddit posts, and more based on creator feedback.",
      icon: TrendingUp,
      bgColor: "from-blue-500/10 via-indigo-500/10 to-purple-500/10"
    },
    {
      question: "Do I need to be a tech expert to use this?",
      answer: "Not at all. If you can paste text and click a button, you can use Repurposer. Zero learning curve, zero setup, zero configuration. Just paste your content and let the AI do the heavy lifting.",
      icon: Users,
      bgColor: "from-sky-500/10 via-cyan-500/10 to-blue-500/10"
    },
    {
      question: "What makes this different from other AI tools?",
      answer: "Most AI tools give you generic outputs. Repurposer is engineered specifically for content repurposing with platform-native formatting, viral hook optimization, and zero-fluff generation. It's a specialized tool, not a general-purpose chatbot.",
      icon: Award,
      bgColor: "from-amber-500/10 via-orange-500/10 to-red-500/10"
    },
    {
      question: "How fast does it generate content?",
      answer: "Typically 8-15 seconds depending on content length and complexity. We use parallel processing across multiple API keys to ensure speed and reliability even during peak usage.",
      icon: Clock,
      bgColor: "from-rose-500/10 via-fuchsia-500/10 to-purple-500/10"
    },
    {
      question: "Can I use this for client work or my agency?",
      answer: "Yes! The lifetime pass includes unlimited seats, so you can share it with your team, VAs, or clients. Many agencies use it to scale content production without scaling headcount.",
      icon: MessageSquare,
      bgColor: "from-indigo-500/10 via-blue-500/10 to-purple-500/10"
    },
    {
      question: "What if I don't like the generated content?",
      answer: "Just hit generate again! Each run produces different variations. You can also adjust your input or try different content types (blog vs transcript vs notes) to get different angles.",
      icon: GitCommit,
      bgColor: "from-gray-500/10 via-slate-500/10 to-zinc-500/10"
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! Everyone gets 5 free repowers per day to test the service. If you love it (and you will), the lifetime pass is just $15 one-time for unlimited access forever.",
      icon: Sparkle,
      bgColor: "from-lime-500/10 via-yellow-500/10 to-amber-500/10"
    },
    {
      question: "How does the lifetime pass work?",
      answer: "One payment of $15 gets you unlimited access forever — no subscriptions, no hidden fees, no surprise bills. Includes all current features plus all future updates at no additional cost.",
      icon: Settings,
      bgColor: "from-purple-500/10 via-indigo-500/10 to-pink-500/10"
    }
  ];

  return (
    <motion.section
      className="container mx-auto px-6 py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.8 }}
    >
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Frequently asked</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Everything you need to know
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          We've anticipated your questions. If you don't see yours here, just ask!
        </p>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        {faqItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="glass-card-premium rounded-2xl p-6 border-l-4"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-900/50">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white mb-1">{item.question}</h3>
                <p className="text-sm text-slate-400">{item.answer}</p>
              </div>
            </div>
            <div className={`h-0.5 w-full bg-gradient-to-r ${item.bgColor} `} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}