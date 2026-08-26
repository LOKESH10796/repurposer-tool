"use client";

import { Fragment, useState, useEffect } from "react";
import { X, Check, Sparkles, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Features Modal ───────────────────────────────────────────────
export function FeaturesModal({ isOpen, onClose }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay onClose={onClose} title="Features">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 text-gray-300"
          >
            <FeatureItem
              icon={<Sparkles className="w-6 h-6 text-purple-400" />}
              title="1-Click Blog-to-Social Pipeline"
              desc="Paste any blog post or raw content and instantly generate a Twitter thread + LinkedIn post in seconds."
            />
            <FeatureItem
              icon={<BarChart3 className="w-6 h-6 text-blue-400" />}
              title="AI Hook Optimization"
              desc="Our ghostwriter engine crafts punchy, high-engagement hooks tailored to each platform's algorithm."
            />
            <FeatureItem
              icon={<i className="fab fa-github text-gray-400"></i>}
              title="Platform Formatting"
              desc="Outputs are pre-formatted for Twitter/X, LinkedIn, GitHub, and Instagram — no manual tweaking needed."
              extra={
                <div className="flex gap-2 mt-2">
                  <i className="fab fa-twitter text-blue-400"></i>
                  <i className="fab fa-linkedin-in text-blue-500"></i>
                  <i className="fab fa-github text-gray-300"></i>
                  <i className="fab fa-instagram text-pink-400"></i>
                </div>
              }
            />
          </motion.div>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
}

function FeatureItem({
  icon,
  title,
  desc,
  extra,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div>
        <h3 className="font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
        {extra}
      </div>
    </div>
  );
}

// ─── Pricing Modal ────────────────────────────────────────────────
export function PricingModal({ isOpen, onClose }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay onClose={onClose} title="Pricing">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Free Tier */}
            <div className="p-6 rounded-2xl bg-gray-800/30 border border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-2">Free Tier</h3>
              <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-500 mb-3">
                $0
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" /> 5 repowers per day
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" /> Basic Twitter + LinkedIn output
                </li>
                <li className="flex items-center gap-2">
                  <X className="w-4 h-4 text-red-400" /> No platform formatting
                </li>
                <li className="flex items-center gap-2">
                  <X className="w-4 h-4 text-red-400" /> No AI hook optimization
                </li>
              </ul>
            </div>

            {/* Lifetime Pass */}
            <div className="relative p-6 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-pink-600/20 rounded-2xl" />
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                Most Popular
              </div>
              <h3 className="relative text-xl font-bold text-white mb-2">Lifetime Pass</h3>
              <p className="relative text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 mb-3">
                $15
              </p>
              <ul className="relative space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" /> Unlimited repowers — forever
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" /> All platforms (Twitter, LinkedIn, GitHub, Instagram)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" /> AI hook optimization + platform formatting
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" /> No subscriptions — pay once, use forever
                </li>
              </ul>
              <a
                href="https://loki1996.gumroad.com/l/repurposer"
                className="relative mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                Get Lifetime Pass
              </a>
            </div>
          </motion.div>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
}

// ─── Auth Modal ───────────────────────────────────────────────────
export function AuthModal({ isOpen, onClose }: ModalProps) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Load saved session from localStorage on open
  useEffect(() => {
    if (isOpen) {
      const savedEmail = localStorage.getItem("snapfeed_email") || "";
      const savedName = localStorage.getItem("snapfeed_name") || "";
      setEmail(savedEmail);
      setName(savedName);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save to localStorage
    localStorage.setItem("snapfeed_email", email);
    if (name) localStorage.setItem("snapfeed_name", name);

    // Success toast
    toast.success(
      tab === "login" ? "Logged in successfully!" : "Account created!"
    );

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay onClose={onClose} title="Account">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Tab Switcher */}
            <div className="flex gap-1 p-1 rounded-lg bg-gray-800/50 border border-gray-700/50">
              <button
                onClick={() => setTab("login")}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                  tab === "login"
                    ? "bg-gray-700/50 text-white"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setTab("signup")}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                  tab === "signup"
                    ? "bg-gray-700/50 text-white"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === "signup" && (
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
                    placeholder="Jane Doe"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
              >
                {tab === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>
          </motion.div>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
}

// ─── Shared Modal Overlay ─────────────────────────────────────────
function ModalOverlay({
  onClose,
  title,
  children,
}: {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg glass rounded-2xl p-6 shadow-2xl border border-gray-700/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {children}
      </motion.div>
    </motion.div>
  );
}

// ─── Feedback Modal ───────────────────────────────────────────────
export function FeedbackModal({ isOpen, onClose }: ModalProps) {
  const { user } = useUser();
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    try {
      await fetch("https://formspree.io/f/mkjwdvde", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: feedback,
          email: user?.primaryEmailAddress?.emailAddress || "Anonymous",
          name: user?.fullName || "Anonymous",
        }),
      });
      toast.success("Thanks for the feedback!");
      setFeedback("");
      onClose();
    } catch {
      toast.error("Failed to send feedback. Please try again.");
    }
  };

  return (
    <ModalOverlay onClose={onClose} title="Send Feedback">
      <div className="space-y-4">
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="What can we improve? What do you love?..."
          className="w-full h-32 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
        />
        <button
          onClick={handleSubmit}
          disabled={!feedback.trim()}
          className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/25"
        >
          Submit Feedback
        </button>
      </div>
    </ModalOverlay>
  );
}
