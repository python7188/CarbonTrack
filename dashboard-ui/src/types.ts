// ============================================================
// CarbonTrack Dashboard — Central Type Definitions
// Every component imports from here. No inline `any` types.
// ============================================================

import type { LucideIcon } from 'lucide-react';

// ── Navigation ──────────────────────────────────────────────

export interface NavItem {
  /** Unique route path, e.g. '/dashboard' */
  id: string;
  /** Display label */
  label: string;
  /** Lucide icon component */
  icon: LucideIcon;
}

// ── Data Shapes ─────────────────────────────────────────────

export type FootprintCategory = 'transport' | 'energy' | 'food' | 'shopping' | 'waste';

export interface Activity {
  id: string;
  category: string;
  activity: string;
  amount: number;
  unit: string;
  co2: number;
  timestamp?: string;
  date?: string;
  notes?: string;
}

export interface DonutSegment {
  name: string;
  value: number;
  color: string;
}

export interface TrendPoint {
  name: string;
  value: number;
}

export interface SparklinePoint {
  value: number;
}

// ── Stat Cards ──────────────────────────────────────────────

export interface StatCardData {
  title: string;
  subtitle?: string;
  value: string;
  unit: string;
  delta?: string;
  deltaColor?: string;
  deltaBg?: string;
  icon?: LucideIcon;
  iconColor?: string;
  showSparkline?: boolean;
}

// ── Streak ──────────────────────────────────────────────────

export interface StreakData {
  currentStreak: number;
  targetStreak: number;
  completedDays: boolean[];
}

// ── Quick Actions ───────────────────────────────────────────

export interface QuickAction {
  icon: LucideIcon;
  label: string;
  color: string;
  bg: string;
}

// ── KPI ─────────────────────────────────────────────────────

export interface KpiItem {
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  val: string;
}

// ── Gemini AI ───────────────────────────────────────────────

export interface InsightAction {
  label: string;
  iconType: 'transport' | 'food' | 'energy' | 'shopping' | 'general';
}

export interface InsightPayload {
  tip: string;
  encouragement: string;
  analogy: string;
  savingsKg: number;
  actions: InsightAction[];
}

export type InsightStatus = 'idle' | 'loading' | 'success' | 'error';

export interface InsightState {
  status: InsightStatus;
  data: InsightPayload | null;
  errorMessage: string | null;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

// ── Challenge / Goal ────────────────────────────────────────

export interface Challenge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  progress: number;
  total: number;
}

// ── Leaderboard ─────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatarUrl: string;
  score: number;
  trend: 'up' | 'down' | 'same';
}

// ── User Profile ────────────────────────────────────────────

export interface UserProfile {
  name: string;
  avatarUrl?: string;
  ecoPoints: number;
  rank: string;
  joinedDate: string;
}
