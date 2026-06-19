// ============================================================
// AiInsightWidget — AI-Powered Carbon Insight Card
// Floating glassmorphism card with 4 states:
//   idle → loading → success | error
// Uses framer-motion for bobbing animation.
// ============================================================

import React from 'react';
import { motion } from 'framer-motion';
import {
  Loader2,
  Sparkles,
  Lightbulb,
  Heart,
  Scale,
  TrendingDown,
  Car,
  Leaf,
  Zap,
  ShoppingBag,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { useGeminiInsights } from '../../../hooks/useGeminiInsights';
import type { InsightAction } from '../../../types';

// ── Props ──────────────────────────────────────────────────

interface AiInsightWidgetProps {
  totalKg?: number;
  categoryBreakdown?: string;
}

// ── Helpers ────────────────────────────────────────────────

/**
 * Maps an InsightAction.iconType to a Lucide icon component.
 */
function getActionIcon(iconType: InsightAction['iconType']): React.ReactNode {
  switch (iconType) {
    case 'transport':
      return <Car className="h-4 w-4 text-blue-400" />;
    case 'food':
      return <Leaf className="h-4 w-4 text-green-400" />;
    case 'energy':
      return <Zap className="h-4 w-4 text-yellow-400" />;
    case 'shopping':
      return <ShoppingBag className="h-4 w-4 text-purple-400" />;
    case 'general':
    default:
      return <CheckCircle className="h-4 w-4 text-teal-400" />;
  }
}

// ── Bobbing Animation Variants ─────────────────────────────

import type { Variants } from 'framer-motion';

const floatVariants: Variants = {
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ── Component ──────────────────────────────────────────────

export function AiInsightWidget({
  totalKg = 432,
  categoryBreakdown = 'Transport 41%, Energy 28%, Food 16%, Shopping 10%, Waste 5%',
}: AiInsightWidgetProps) {
  const { state, triggerAnalysis, resetState } = useGeminiInsights();

  const handleGenerate = () => {
    triggerAnalysis(totalKg, categoryBreakdown);
  };

  const handleReset = () => {
    resetState();
  };

  return (
    <motion.div
      variants={floatVariants}
      animate="animate"
      className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl"
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-[#2EEA8B]" />
        <h3 className="text-lg font-semibold text-white">AI Strategy</h3>
      </div>

      {/* ── IDLE State ─────────────────────────────────────── */}
      {state.status === 'idle' && (
        <div className="flex flex-col items-center gap-4 py-6">
          <p className="text-center text-sm text-gray-400">
            Get a personalized carbon reduction strategy powered by AI.
          </p>
          <button
            type="button"
            onClick={handleGenerate}
            aria-label="Generate a custom carbon reduction strategy"
            className="rounded-xl bg-[#2EEA8B]/20 px-6 py-3 text-sm font-medium text-[#2EEA8B] transition-colors hover:bg-[#2EEA8B]/30 focus:outline-none focus:ring-2 focus:ring-[#2EEA8B]/50"
          >
            Generate Custom Strategy
          </button>
        </div>
      )}

      {/* ── LOADING State ──────────────────────────────────── */}
      {state.status === 'loading' && (
        <div className="flex flex-col items-center gap-3 py-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#2EEA8B]" />
          <p className="text-sm text-gray-300">
            Analyzing footprint patterns…
          </p>
        </div>
      )}

      {/* ── SUCCESS State ──────────────────────────────────── */}
      {state.status === 'success' && state.data !== null && (
        <div className="space-y-4">
          {/* Tip */}
          <div className="flex items-start gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-yellow-400/80">
                Tip
              </p>
              <p className="text-sm text-gray-200">{state.data.tip}</p>
            </div>
          </div>

          {/* Encouragement */}
          <div className="flex items-start gap-3">
            <Heart className="mt-0.5 h-5 w-5 shrink-0 text-pink-400" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-pink-400/80">
                Encouragement
              </p>
              <p className="text-sm text-gray-200">
                {state.data.encouragement}
              </p>
            </div>
          </div>

          {/* Analogy */}
          <div className="flex items-start gap-3">
            <Scale className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-blue-400/80">
                Analogy
              </p>
              <p className="text-sm text-gray-200">{state.data.analogy}</p>
            </div>
          </div>

          {/* Potential Savings */}
          <div className="flex items-center gap-3 rounded-xl bg-[#2EEA8B]/10 px-4 py-3">
            <TrendingDown className="h-5 w-5 text-[#2EEA8B]" />
            <p className="text-sm font-medium text-[#2EEA8B]">
              Potential savings:{' '}
              <span className="text-base font-bold">
                {state.data.savingsKg} kg CO₂e
              </span>
            </p>
          </div>

          {/* Action Items */}
          {state.data.actions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Action Items
              </p>
              <ul className="space-y-2">
                {state.data.actions.map((action, idx) => (
                  <li
                    key={`action-${idx}`}
                    className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2"
                  >
                    {getActionIcon(action.iconType)}
                    <span className="text-sm text-gray-300">
                      {action.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleReset}
            aria-label="Generate a new strategy"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-400 transition-colors hover:border-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <RotateCcw className="h-4 w-4" />
            Generate New Strategy
          </button>
        </div>
      )}

      {/* ── ERROR State ────────────────────────────────────── */}
      {state.status === 'error' && (
        <div
          role="alert"
          className="flex flex-col items-center gap-4 rounded-xl bg-red-500/10 p-4"
        >
          <AlertTriangle className="h-6 w-6 text-red-400" />
          <p className="text-center text-sm text-red-300">
            {state.errorMessage ?? 'Something went wrong'}
          </p>
          <button
            type="button"
            onClick={handleGenerate}
            aria-label="Try generating a strategy again"
            className="rounded-lg bg-red-500/20 px-5 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          >
            Try Again
          </button>
        </div>
      )}
    </motion.div>
  );
}
