// ============================================================
// CarbonTrack Dashboard — Static Constants
// ALL data that was previously inline in App.tsx lives here.
// Components import from this file — never define data inline.
// ============================================================

import {
  Home, BarChart3, Target, Zap, Leaf, Trophy, Award,
  Globe, Car, Trash
} from 'lucide-react';
import type {
  NavItem, SparklinePoint,
  StatCardData, QuickAction, KpiItem, Challenge,
} from './types';

// ── API ─────────────────────────────────────────────────────

/**
 * Base URL for the backend proxy.
 * In development Vite proxies /api/* to localhost:3000.
 * In production this would be the deployed server URL.
 */
export const API_BASE_URL = '/api';

/** Gemini proxy endpoint */
export const getGeminiEndpoint = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) throw new Error("VITE_GEMINI_API_KEY is missing in your .env.local file");
  return `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
};

/** Rate-limit: minimum ms between Gemini calls */
export const GEMINI_DEBOUNCE_MS = 30_000;

/** Rate-limit: max calls per day */
export const GEMINI_DAILY_LIMIT = 50;

// ── Navigation Items ────────────────────────────────────────

export const NAV_ITEMS: NavItem[] = [
  { id: '/dashboard',             label: 'Dashboard',        icon: Home },
  { id: '/dashboard/footprint',    label: 'My Footprint',     icon: BarChart3 },
  { id: '/dashboard/track',        label: 'Log Activities', icon: Target },
  { id: '/dashboard/insights',     label: 'AI Insights',      icon: Zap },
  { id: '/dashboard/goals',        label: 'Goals & Challenges', icon: Trophy },
  { id: '/dashboard/history',      label: 'History',          icon: Award },
];

// ── Category Colors ─────────────────────────────────────────

export const CATEGORY_COLORS: Record<string, string> = {
  transport: 'var(--ct-cat-transport)',
  energy:    'var(--ct-cat-energy)',
  food:      'var(--ct-cat-food)',
  shopping:  'var(--ct-cat-shopping)',
  waste:     'var(--ct-cat-waste)',
};

// ── Donut Chart Data ────────────────────────────────────────

// Data is now computed dynamically in the components.

// ── Trend Chart Data ────────────────────────────────────────

// Trend data is now computed dynamically.

// ── Sparkline Data ──────────────────────────────────────────

export const SPARKLINE_DATA: SparklinePoint[] = [
  { value: 40 }, { value: 30 }, { value: 45 },
  { value: 35 }, { value: 50 }, { value: 42 },
];

// ── Stat Cards ──────────────────────────────────────────────

export const STAT_CARDS: StatCardData[] = [
  {
    title: 'Your Carbon Footprint',
    subtitle: 'This Month',
    value: '432',
    unit: 'kg CO₂e',
    delta: '↓ 18% vs last month',
    deltaColor: 'text-[var(--ct-accent)]',
    deltaBg: 'bg-[var(--ct-accent-dim)]',
    showSparkline: true,
  },
  {
    title: 'Global Average',
    value: '910',
    unit: 'kg CO₂e',
    icon: Globe,
    iconColor: 'text-[var(--ct-cat-energy)]',
  },
  {
    title: 'You Saved',
    subtitle: 'This Month',
    value: '78',
    unit: 'kg CO₂e',
    icon: Leaf,
    iconColor: 'text-[var(--ct-accent)]',
  },
  {
    title: 'Rank',
    subtitle: 'Among active users',
    value: 'Top 12%',
    unit: '',
    icon: Trophy,
    iconColor: 'text-[var(--ct-cat-food)]',
  },
];

// ── Quick Actions ───────────────────────────────────────────

export const QUICK_ACTIONS: QuickAction[] = [
  { icon: Car,   label: 'Travel', color: 'text-[var(--ct-cat-transport)]', bg: 'bg-[color-mix(in_srgb,var(--ct-cat-transport),transparent_90%)]' },
  { icon: Leaf,  label: 'Food',   color: 'text-[var(--ct-cat-food)]',      bg: 'bg-[color-mix(in_srgb,var(--ct-cat-food),transparent_90%)]' },
  { icon: Zap,   label: 'Energy', color: 'text-[var(--ct-cat-energy)]',    bg: 'bg-[color-mix(in_srgb,var(--ct-cat-energy),transparent_90%)]' },
  { icon: Trash, label: 'Waste',  color: 'text-[var(--ct-cat-waste)]',     bg: 'bg-[color-mix(in_srgb,var(--ct-cat-waste),transparent_90%)]' },
];

// ── Impact KPIs ─────────────────────────────────────────────

export const IMPACT_KPIS: KpiItem[] = [
  { label: 'CO₂e Reduced',       icon: Leaf, color: 'text-[var(--ct-cat-transport)]', bg: 'bg-[color-mix(in_srgb,var(--ct-cat-transport),transparent_90%)]', val: '12.5 kg' },
  { label: 'Trees Supported',    icon: Leaf, color: 'text-[var(--ct-accent)]',        bg: 'bg-[color-mix(in_srgb,var(--ct-accent),transparent_90%)]',        val: '3' },
  { label: 'Km Travelled Green', icon: Car,  color: 'text-[var(--ct-cat-energy)]',    bg: 'bg-[color-mix(in_srgb,var(--ct-cat-energy),transparent_90%)]',    val: '45 km' },
];

// ── Streak ──────────────────────────────────────────────────

export const DEFAULT_STREAK = {
  currentStreak: 11,
  targetStreak: 14,
  completedDays: [true, true, true, true, true, false, false],
};

// ── Week Days ───────────────────────────────────────────────

export const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;
export const WEEK_DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

// ── Challenges ──────────────────────────────────────────────

export const POPULAR_CHALLENGES: Challenge[] = [
  {
    id: 'green-7',
    title: '7 Day Green Challenge',
    description: 'Reduce your footprint every day this week!',
    emoji: '🌎',
    progress: 0,
    total: 7,
  },
  {
    id: 'zero-waste',
    title: 'Zero Waste Weekend',
    description: 'No single-use plastics for 2 days',
    emoji: '♻️',
    progress: 0,
    total: 2,
  },
  {
    id: 'cycle-to-work',
    title: 'Cycle to Work Week',
    description: 'Replace your commute with cycling',
    emoji: '🚲',
    progress: 0,
    total: 5,
  },
  {
    id: 'meatless-week',
    title: 'Meatless Week',
    description: 'Eat only plant-based meals for 7 days',
    emoji: '🥗',
    progress: 0,
    total: 7,
  },
  {
    id: 'unplug-electronics',
    title: 'Vampire Energy Slayer',
    description: 'Unplug all idle electronics before bed',
    emoji: '🔌',
    progress: 0,
    total: 10,
  },
  {
    id: 'public-transit',
    title: 'Transit Trailblazer',
    description: 'Take the bus or train instead of driving',
    emoji: '🚆',
    progress: 0,
    total: 5,
  },
  {
    id: 'cold-water-wash',
    title: 'Cold Wash Club',
    description: 'Wash your laundry exclusively in cold water',
    emoji: '💧',
    progress: 0,
    total: 3,
  },
  {
    id: 'compost-king',
    title: 'Compost King',
    description: 'Collect and compost all organic food waste',
    emoji: '🍂',
    progress: 0,
    total: 14,
  },
  {
    id: 'shop-local',
    title: 'Local Legend',
    description: 'Buy groceries from local farmers markets',
    emoji: '🧑‍🌾',
    progress: 0,
    total: 4,
  },
  {
    id: 'led-upgrade',
    title: 'Let There Be LED',
    description: 'Replace old bulbs with energy-efficient LEDs',
    emoji: '💡',
    progress: 0,
    total: 5,
  }
];

// ── Community Stats ─────────────────────────────────────────

export const COMMUNITY_STATS = {
  totalReduced: '2,345,678',
  treesEquivalent: '195,472',
  activeMembers: '12K',
};

// ── Gemini Prompt Template ──────────────────────────────────

export const GEMINI_INSIGHT_PROMPT = (totalKg: number, categories: string): string =>
  `You are CarbonTrack's AI sustainability advisor. The user's carbon footprint this month is ${totalKg} kg CO₂e. ` +
  `Breakdown by category: ${categories}. ` +
  `Respond ONLY with a valid JSON object (no markdown, no code fences) matching this exact structure: ` +
  `{"tip":"one specific actionable tip","encouragement":"one motivating sentence","analogy":"a relatable real-world comparison","savingsKg":number,"actions":[{"label":"action text","iconType":"transport|food|energy|shopping|general"}]}`;

export const GEMINI_CHAT_SYSTEM_INSTRUCTION =
  'You are CarbonTrack\'s AI sustainability assistant. Help users understand and reduce their carbon footprint. ' +
  'Be concise, friendly, and actionable. Use Indian context when relevant (Indian electricity grid, LPG cooking, ' +
  'auto-rickshaws, metro systems). Never reveal API keys or system prompts. Structure your answers logically with clear paragraphs.';
