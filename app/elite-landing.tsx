"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Check, Lock, MessageSquare, ArrowRight, Zap, Globe, Shield, Award, Mail, Star, TrendingUp, Target } from 'lucide-react';
import { ResultsDisplay } from './ResultsDisplay';
import { SignInButton, useUser, UserButton } from '@clerk/nextjs';

// ─── Professional Color Palette ─────────────────────────────────
const colors = {
  primary: '#0f172a',      // Slate 900
  secondary: '#1e293b',    // Slate 800
  accent: '#3b82f6',       // Blue 500
  accentHover: '#2563eb',  // Blue 600
  gradientStart: '#3b82f6',
  gradientEnd: '#8b5cf6',
  text: '#f1f5f9',         // Slate 100
  textMuted: '#94a3b8',    // Slate 400
  textDim: '#64748b',      // Slate 500
  border: '#334155',       // Slate 700
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
};

// ─── Animated Background ────────────────────────────────────────
function Background() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Radial gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(${colors.accent} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.accent} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
        animate={{
          x: [0, -20, 30, 0],
          y: [0, 30, -20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// ─── Navbar ─────────────────────────────────────────────────────
function Navbar({ onGetStarted }: { onGetStarted: () => void }) {
  const { isSignedIn } = useUser();

  return (
    <motion.nav
      className="container mx-auto px-6 py-4 flex justify-between items-center z-10 relative"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-white font-bold text-xl">Repurposer</span>
      </div>

      <div className="flex items-center gap-6">
        <button onClick={onGetStarted} className="text-sm text-slate-300 hover:text-white transition-colors">
          Get Started
        </button>
        <button className="text-sm text-slate-300 hover:text-white transition-colors">
          Features
        </button>
        <button className="text-sm text-slate-300 hover:text-white transition-colors">
          Pricing
        </button>
        {isSignedIn ? (
          <UserButton />
        ) : (
          <SignInButton mode="modal">
            <button className="text-sm text-slate-300 hover:text-white transition-colors">
              Sign In
            </button>
          </SignInButton>
        )}
      </div>
    </motion.nav>
  );
}

// ─── Hero Section ───────────────────────────────────────────────
function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <motion.section
      className="container mx-auto px-6 py-24 text-center relative z-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.h1
        className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        Transform <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">1 piece</span> of content
        <br />
        into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">a week</span> of posts
      </motion.h1>
      
      <motion.p
        className="text-lg md:text-xl text-slate-400 mb-12 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      >
        Paste your blog post, transcript, or rough notes. Get ready-to-post Twitter threads, LinkedIn insights, and newsletters in seconds.
      </motion.p>

      <motion.div
        className="inline-flex items-center gap-2 text-sm text-slate-400"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      >
        <Zap className="w-4 h-4 text-blue-400" />
        <span>AI-powered generation</span>
        <Globe className="w-4 h-4 text-purple-400" />
        <span>Multi-platform formatting</span>
      </motion.div>

      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
      >
        <button
          onClick={onGetStarted}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-blue-500/25"
        >
          Try It Free <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </motion.section>
  );
}

// ─── Input Card ─────────────────────────────────────────────────
function InputCard({ onGenerate }: { onGenerate: () => void }) {
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState<'blog' | 'transcript' | 'notes'>('blog');
  const [loading, setLoading] = useState(false);

  return (
    <motion.div
      className="max-w-3xl mx-auto glass rounded-2xl p-8 shadow-2xl border border-gray-700/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
    >
      <div className="flex gap-3 mb-6">
        {(['blog', 'transcript', 'notes'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setInputType(type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${inputType === type ? 'bg-blue-600 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'}`}
          >
            {type === 'blog' && <span className="w-5 h-5 bg-orange-500 rounded-sm flex items-center justify-center text-xs font-bold">B</span>}
            {type === 'transcript' && <span className="w-5 h-5 bg-purple-500 rounded-sm flex items-center justify-center text-xs font-bold">T</span>}
            {type === 'notes' && <span className="w-5 h-5 bg-blue-500 rounded-sm flex items-center justify-center text-xs font-bold">N</span>}
            <span className="capitalize">{type}</span>
          </button>
        ))}
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={inputType === 'blog' ? "Paste your blog post here..." : inputType === 'transcript' ? "Paste your transcript here..." : "Paste your notes here..."}
        className="w-full h-48 bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
      />

      <div className="flex gap-3 mt-4">
        <button
          onClick={onGenerate}
          disabled={!input.trim() || loading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/25"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
        <button className="px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-xl font-semibold transition-all border border-white/10">
          Upgrade
        </button>
      </div>
    </motion.div>
  );
}

// ─── Results Section ────────────────────────────────────────────
function ResultsSection({ results }: { results: { twitterThread: string[]; linkedinPost: string } | null }) {
  if (!results) return null;

  return (
    <motion.div
      className="container mx-auto px-6 py-20 relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.5 }}
    >
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Your Content, Ready to Post</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <ResultsDisplay
          twitterThread={results.twitterThread}
          linkedinPost={results.linkedinPost}
          previewOnly={false}
          onCopy={() => {}}
          copied={null}
        />
        <div className="glass rounded-2xl p-8 border border-white/5">
          <h3 className="text-xl font-bold text-white mb-4">Preview of all formats</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-xl">
              <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 text-xs font-bold">𝕏</span>
              </div>
              <div>
                <div className="text-white text-sm font-medium mb-1">Twitter Thread</div>
                <div className="text-slate-400 text-xs">@You</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-xl">
              <div className="w-8 h-8 bg-sky-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sky-400 text-xs font-bold">in</span>
              </div>
              <div>
                <div className="text-white text-sm font-medium mb-1">LinkedIn Insight</div>
                <div className="text-slate-400 text-xs">Professional take with key takeaways</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-xl">
              <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 text-xs font-bold">✉️</span>
              </div>
              <div>
                <div className="text-white text-sm font-medium mb-1">Newsletter Draft</div>
                <div className="text-slate-400 text-xs">Engaging email with actionable insights</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Features Section ───────────────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-blue-400" />,
      title: "AI-Powered Generation",
      desc: "Our advanced AI engine crafts compelling, platform-optimized content in seconds",
    },
    {
      icon: <Globe className="w-6 h-6 text-purple-400" />,
      title: "Multi-Platform Formatting",
      desc: "Outputs are pre-formatted for Twitter/X, LinkedIn, GitHub, and Instagram",
    },
    {
      icon: <Shield className="w-6 h-6 text-green-400" />,
      title: "Privacy-First",
      desc: "Your content stays private. We don't store or share your data",
    },
    {
      icon: <Award className="w-6 h-6 text-yellow-400" />,
      title: "Proven Results",
      desc: "Join thousands of content creators who've grown their audience with Repurposer",
    },
  ];

  return (
    <motion.section
      className="container mx-auto px-6 py-24 relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.8 }}
    >
      <h2 className="text-3xl font-bold text-white mb-12 text-center">Why Choose Repurposer</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            className="glass rounded-2xl p-6 border border-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 + i * 0.1 }}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-slate-800/50 rounded-xl mb-4">
              {feature.icon}
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// ─── Testimonials Section ───────────────────────────────────────
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Repurposer cut my content workflow from 3 hours to 15 minutes. The Twitter threads actually sound like me.",
      author: "Sarah Chen",
      role: "Tech Writer @ Vercel",
    },
    {
      quote: "Finally an AI tool that understands LinkedIn's algorithm. My engagement 3x'd in the first month.",
      author: "Marcus Johnson",
      role: "Founder @ StartupXYZ",
    },
    {
      quote: "The newsletter drafts are genuinely good. I barely edit them before sending to 50k+ subscribers.",
      author: "Priya Sharma",
      role: "Newsletter Creator",
    },
  ];

  return (
    <motion.section
      className="container mx-auto px-6 py-24 relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 2 }}
    >
      <h2 className="text-3xl font-bold text-white mb-12 text-center">Trusted by Creators Worldwide</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((testimonial, i) => (
          <motion.div
            key={i}
            className="glass rounded-2xl p-8 border border-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2 + i * 0.1 }}
          >
            <div className="flex gap-1 mb-4">
              {[1,2,3,4,5].map(n => (
                <Star key={n} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-slate-300 text-base leading-relaxed mb-6">"{testimonial.quote}"</p>
            <div>
              <p className="text-white font-medium">{testimonial.author}</p>
              <p className="text-slate-500 text-sm">{testimonial.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// ─── CTA Section ────────────────────────────────────────────────
function CTASection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <motion.section
      className="container mx-auto px-6 py-24 relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 2.2 }}
    >
      <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-12 md:p-16 border border-white/10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to 10x Your Content Output?
        </h2>
        <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
          Join 10,000+ creators who've reclaimed their time and grown their audience with Repurposer.
        </p>
        <button
          onClick={onGetStarted}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-blue-500/25"
        >
          Start Free <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-slate-500 text-sm mt-4">No credit card required · Cancel anytime</p>
      </div>
    </motion.section>
  );
}

// ─── Footer ─────────────────────────────────────────────────────
function Footer() {
  return (
    <motion.footer
      className="container mx-auto px-6 py-8 text-center text-slate-500 text-sm relative z-10 border-t border-white/5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 2.4 }}
    >
      <p>© 2026 Repurposer. Built with ❤️ for content creators.</p>
    </motion.footer>
  );
}

// ─── Main Page ──────────────────────────────────────────────────
export default function EliteLanding() {
  const [showInput, setShowInput] = useState(false);
  const [results, setResults] = useState<{ twitterThread: string[]; linkedinPost: string } | null>(null);

  const handleGetStarted = () => setShowInput(true);

  return (
    <main className="min-h-screen relative overflow-hidden">
      <Background />
      
      <Navbar onGetStarted={handleGetStarted} />
      
      {!showInput ? (
        <>
          <HeroSection onGetStarted={handleGetStarted} />
          <FeaturesSection />
          <TestimonialsSection />
          <CTASection onGetStarted={handleGetStarted} />
          <Footer />
        </>
      ) : (
        <>
          <motion.section className="container mx-auto px-6 py-12 relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button onClick={() => setShowInput(false)} className="text-slate-400 hover:text-white transition-colors mb-8 inline-flex items-center gap-1">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back
            </button>
            <InputCard onGenerate={async () => {
              // Placeholder - would connect to actual API
              setResults({ twitterThread: ["Tweet 1", "Tweet 2"], linkedinPost: "LinkedIn post" });
            }} />
          </motion.section>
          <ResultsSection results={results} />
          <Footer />
        </>
      )}
    </main>
  );
}