// ============================================================
// DashboardPage — THE main dashboard view
// Refactored to "Wow Factor" (Brutalist + 3D WebGL + Motion)
// ============================================================

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Leaf, Trophy, TrendingDown, Target, Activity as ActivityIcon, ArrowRight, Check, Flame } from 'lucide-react';
import {
  LineChart, Line, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell,
} from 'recharts';

import type { StatCardData, KpiItem, TrendPoint, Activity } from '../types';
import { AiInsightWidget } from '../components/features/ai/AiInsightWidget';
import { getHistory } from '../lib/storage';
import {
  SPARKLINE_DATA,
  IMPACT_KPIS,
  COMMUNITY_STATS
} from '../constants';
import { useChallenges } from '../contexts/ChallengesContext';
import { WebGLGlobe } from '../components/ui/WebGLGlobe';

// ── Framer Motion Variants ──────────────────────────────────
import type { Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 400, damping: 30 } 
  }
};

// ── WebGL Visualizer Wrapper ────────────────────────────────
function VisualizerContainer() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-full h-full min-h-[400px] bg-[var(--ct-ink)] relative overflow-hidden flex flex-col font-mono text-[10px] sm:text-xs text-[var(--ct-accent)]/80 transition-colors group cursor-grab active:cursor-grabbing">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_var(--ct-ink)_100%)] z-10 pointer-events-none" />
      <div className="absolute inset-0 z-0">
        {mounted && (
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <WebGLGlobe />
          </Canvas>
        )}
      </div>
      
      {/* HUD Overlay */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="flex items-center gap-2 mb-2 bg-[var(--ct-ink)]/80 px-2 py-1 border border-[var(--ct-accent)]/30 backdrop-blur-sm">
          <ActivityIcon className="w-4 h-4 text-[var(--ct-accent)]" />
          <span className="uppercase font-bold tracking-widest text-white">Global Telemetry</span>
          <span className="animate-pulse text-[var(--ct-accent)] ml-2">●</span>
        </div>
        <div className="text-[10px] text-white/70 uppercase tracking-widest bg-[var(--ct-ink)]/80 px-2 py-1 border border-[var(--ct-accent)]/30 backdrop-blur-sm mt-1 inline-block">
          SYS.STATUS: <span className="text-[var(--ct-accent)]">OPTIMAL</span><br/>
          RENDER: WebGL Active
        </div>
      </div>
    </div>
  );
}

// ── Stat Card ───────────────────────────────────────────────
function StatCard({ stat }: { stat: StatCardData }) {
  const IconComp = stat.icon;
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -4, boxShadow: "6px 6px 0px var(--ct-border-hard)" }}
      className="card-brutal p-5 flex flex-col relative overflow-hidden group bg-white transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ct-ink-muted)]">{stat.title}</h3>
          {stat.subtitle && <p className="text-[10px] text-[var(--ct-ink-faint)] mt-1 font-bold">{stat.subtitle}</p>}
        </div>
        {IconComp && (
          <div className="w-10 h-10 border-2 border-[var(--ct-border-hard)] bg-[var(--ct-bg-light)] flex items-center justify-center shadow-[2px_2px_0px_var(--ct-border-hard)] group-hover:bg-[var(--ct-accent)] transition-colors duration-300">
            <IconComp className={`w-5 h-5 ${stat.iconColor ?? 'text-[var(--ct-ink)]'}`} strokeWidth={2.5} />
          </div>
        )}
      </div>

      <div className="mt-auto relative z-10">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-[var(--ct-ink)] tracking-tight font-display">{stat.value}</span>
          {stat.unit && <span className="text-sm font-bold text-[var(--ct-ink-muted)] uppercase">{stat.unit}</span>}
        </div>

        {stat.delta && (
          <div className="mt-3 inline-flex items-center gap-1.5 border-2 border-[var(--ct-border-hard)] bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest shadow-[2px_2px_0px_var(--ct-border-hard)]">
            <TrendingDown className="w-3 h-3 text-[var(--ct-accent)]" strokeWidth={3} />
            {stat.delta}
          </div>
        )}
      </div>

      {stat.showSparkline && (
        <div className="absolute bottom-4 right-4 w-20 h-10 opacity-30 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SPARKLINE_DATA}>
              <Line type="step" dataKey="value" stroke="var(--ct-border-hard)" strokeWidth={2} dot={false} isAnimationActive={true} animationDuration={1500} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}

// ── Main Dashboard Page ─────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate();
  const { activeChallenges } = useChallenges();
  const [activeTab, setActiveTab] = useState<string>('Month');
  const [showStreakPopup, setShowStreakPopup] = useState(false);

  const [activities] = useState<Activity[]>(getHistory);

  const validActivities = useMemo(() => activities.filter(a => !a.id?.startsWith('tour-completed')), [activities]);

  const totalEmissions = validActivities.reduce((sum, act) => sum + Number(act?.co2 || 0), 0);
  const totalEntries = validActivities.length;

  const streakInfo = useMemo(() => {
    // Default streaks are dynamically calculated now
    if (!activities.length) return { currentStreak: 0, completedDays: Array(7).fill(false), dayLabels: Array(7).fill(''), daysLog: new Set<string>() };
    
    const daysLog = new Set(activities.map(a => {
      try {
        if (!a || (!a.timestamp && !a.date)) return '';
        const d = new Date(a.timestamp || a.date || '');
        return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
      } catch {
        return '';
      }
    }).filter(Boolean));
    let streak = 0;
    const today = new Date();
    
    while (true) {
      const dStr = today.toISOString().split('T')[0];
      if (daysLog.has(dStr)) {
        streak++;
        today.setDate(today.getDate() - 1);
      } else if (streak === 0 && dStr === new Date().toISOString().split('T')[0]) {
        today.setDate(today.getDate() - 1);
      } else {
        break;
      }
    }
    
    const completedDays = Array(7).fill(false);
    const dayLabels = Array(7).fill('');
    const checkDate = new Date();
    
    const labelMap = ['S', 'M', 'T', 'W', 'T', 'F', 'SA'];
    
    for (let i = 6; i >= 0; i--) {
      const dStr = checkDate.toISOString().split('T')[0];
      completedDays[i] = daysLog.has(dStr);
      dayLabels[i] = labelMap[checkDate.getDay()];
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    return { currentStreak: streak, completedDays, dayLabels, daysLog };
  }, [activities]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tourCompleted = params.get('tourCompleted') === 'true';

    const todayStr = new Date().toISOString().split('T')[0];
    const hasToday = streakInfo.daysLog.has(todayStr);
    
    const sessionKey = `ct_streak_shown_${todayStr}`;
    const alreadyShown = sessionStorage.getItem(sessionKey);
    
    if ((hasToday && !alreadyShown && streakInfo.currentStreak > 0) || tourCompleted) {
      setShowStreakPopup(true);
      sessionStorage.setItem(sessionKey, 'true');
      
      if (tourCompleted) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [streakInfo.daysLog, streakInfo.currentStreak]);

  useEffect(() => {
    if (showStreakPopup) {
      const timer = setTimeout(() => setShowStreakPopup(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showStreakPopup]);

  const activeTrendData = useMemo(() => {
    const today = new Date();
    const data: TrendPoint[] = [];
    
    if (activeTab === 'Week') {
      const labelMap = ['S', 'M', 'T', 'W', 'T', 'F', 'SA'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dStr = d.toISOString().split('T')[0];
        const daySum = validActivities.filter(a => a.timestamp?.startsWith(dStr) || a.date?.startsWith(dStr)).reduce((sum, a) => sum + Number(a.co2 || 0), 0);
        data.push({ name: labelMap[d.getDay()], value: parseFloat(daySum.toFixed(1)) });
      }
    } else if (activeTab === 'Month') {
      for (let i = 29; i >= 0; i -= Math.floor(30/6)) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dStr = d.toISOString().split('T')[0];
        const daySum = validActivities.filter(a => a.timestamp?.startsWith(dStr) || a.date?.startsWith(dStr)).reduce((sum, a) => sum + Number(a.co2 || 0), 0);
        data.push({ name: dStr.split('-').slice(1).join('/'), value: parseFloat(daySum.toFixed(1)) });
      }
    } else if (activeTab === 'Year') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(today.getMonth() - i);
        const mStr = d.toISOString().slice(0, 7); 
        const mSum = validActivities.filter(a => a.timestamp?.startsWith(mStr) || a.date?.startsWith(mStr)).reduce((sum, a) => sum + Number(a.co2 || 0), 0);
        data.push({ name: months[d.getMonth()], value: parseFloat(mSum.toFixed(1)) });
      }
    }
    
    return data;
  }, [activeTab, validActivities]);

  const dynamicStatCards = [
    { title: 'Total Footprint', value: totalEmissions.toFixed(1), unit: 'kg', icon: Target, showSparkline: true },
    { title: 'Total Entries', value: totalEntries.toString(), unit: 'items', icon: ActivityIcon },
    { title: 'Current Streak', value: streakInfo.currentStreak.toString(), unit: 'days', icon: Flame },
    { title: 'Eco Score', value: totalEntries > 0 ? 'Good' : 'N/A', unit: '', icon: Leaf },
  ];

  const categoryTotals = validActivities.reduce((acc, act) => {
    acc[act.category] = (acc[act.category] || 0) + Number(act?.co2 || 0);
    return acc;
  }, {} as Record<string, number>);

  let computedDonutData = totalEmissions === 0 ? [
    { name: 'No Data', value: 100, color: 'var(--ct-border-hard)' }
  ] : [
    { name: 'Transport', value: Math.round(((categoryTotals.transport || 0) / totalEmissions) * 100) || 0, color: 'var(--ct-accent)' },
    { name: 'Food', value: Math.round(((categoryTotals.food || 0) / totalEmissions) * 100) || 0, color: '#BA7517' },
    { name: 'Energy', value: Math.round(((categoryTotals.energy || 0) / totalEmissions) * 100) || 0, color: '#378ADD' },
    { name: 'Shopping', value: Math.round(((categoryTotals.shopping || 0) / totalEmissions) * 100) || 0, color: '#7F77DD' }
  ].filter(d => d.value > 0);

  if (computedDonutData.length === 0) {
    computedDonutData = [{ name: 'Other', value: 100, color: 'var(--ct-border-hard)' }];
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 w-full max-w-none mx-auto relative"
    >
      <AnimatePresence>
        {showStreakPopup && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="card-brutal bg-[var(--ct-accent)] text-[var(--ct-ink)] p-16 text-center shadow-[16px_16px_0px_var(--ct-ink)] border-[24px] border-[#1D9E75] rotate-2">
              <Flame className="w-32 h-32 mx-auto mb-6 animate-pulse stroke-[2px] text-[#1D9E75] fill-[#1D9E75]" />
              <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase">
                DAY {streakInfo.currentStreak > 0 ? streakInfo.currentStreak : 1} STREAK!
              </h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <h1 className="sr-only">CarbonTrack Premium Dashboard</h1>

      {/* ─── ROW 1: STAT CARDS ─────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {dynamicStatCards.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </div>

      {/* ─── ROW 2: DONUT | DATA VISUALIZER | AI INSIGHT ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Donut Breakdown */}
        <motion.div variants={itemVariants} className="lg:col-span-4 bg-[var(--ct-ink)] text-white border-4 border-[var(--ct-border-hard)] p-6 shadow-[6px_6px_0px_var(--ct-border-hard)] flex flex-col min-h-[340px] hover:shadow-[8px_8px_0px_var(--ct-border-hard)] transition-shadow">
          <h3 className="font-bold text-sm uppercase tracking-widest mb-6 border-b border-white/20 pb-4">Footprint Breakdown</h3>

          <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="w-[140px] h-[140px] relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie data={computedDonutData} innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none" isAnimationActive={true} animationDuration={1000} animationBegin={400}>
                    {computedDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold font-display">{totalEmissions.toFixed(1)}</span>
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">kg CO₂e</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 flex-1 w-full">
              {computedDonutData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-2 text-white/70">
                    <span className="w-3 h-3 border-2 border-white/20" style={{ backgroundColor: d.color }} />
                    {d.name}
                  </div>
                  <span className="text-white">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-brutal w-full mt-6 text-xs bg-white text-[var(--ct-ink)] hover:bg-[var(--ct-accent)]"
          >
            Detailed Analysis <ArrowRight className="w-4 h-4 ml-2" />
          </motion.button>
        </motion.div>

        {/* Center: Data Visualizer + AI Insight */}
        <motion.div variants={itemVariants} className="lg:col-span-8 flex flex-col gap-5">
          <div className="flex-1 card-brutal p-1 bg-[var(--ct-ink)] relative group overflow-hidden">
            <VisualizerContainer />
            
            {/* AI Insight Bubble - Floating over WebGL */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, type: "spring" }}
              className="absolute bottom-4 right-4 max-w-sm hidden md:block z-20"
            >
              <AiInsightWidget
                totalKg={totalEmissions}
                categoryBreakdown={
                  Object.entries(categoryTotals)
                    .map(([cat, kg]) => `${cat} ${Math.round((kg / (totalEmissions || 1)) * 100)}%`)
                    .join(', ') || 'No activity logged yet'
                }
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ─── ROW 3: TREND | STREAK | IMPACT KPIs ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Trend Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-6 card-brutal p-6 flex flex-col min-h-[260px] bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b-2 border-[var(--ct-border-hard)]">
            <h3 className="font-bold text-sm uppercase tracking-widest">Footprint Trend</h3>
            <div role="tablist" aria-label="Trend time range" className="flex text-[10px] font-bold uppercase tracking-widest border-2 border-[var(--ct-border-hard)]">
              {['Week', 'Month', 'Year'].map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  aria-controls="trend-panel"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 transition-colors border-r-2 border-[var(--ct-border-hard)] last:border-r-0 ${
                    activeTab === tab
                      ? 'bg-[var(--ct-ink)] text-white'
                      : 'bg-white text-[var(--ct-ink)] hover:bg-[var(--ct-bg-surface)]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          {validActivities.length === 0 ? (
            <div id="trend-panel" role="tabpanel" aria-labelledby={`tab-${activeTab}`} className="h-64 w-full flex items-center justify-center border-4 border-dashed border-[var(--ct-border-light)] mt-6">
              <p className="text-xl font-bold uppercase tracking-widest text-[var(--ct-ink-muted)]">Log an activity to see this chart</p>
            </div>
          ) : (
            <div id="trend-panel" role="tabpanel" aria-labelledby={`tab-${activeTab}`} className="h-64 w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={true} tickLine={true} tick={{ fontSize: 10, fill: 'var(--ct-ink)', fontWeight: 700 }} dy={10} stroke="var(--ct-border-hard)" strokeWidth={2} />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '0', border: '2px solid var(--ct-border-hard)', boxShadow: '4px 4px 0px var(--ct-border-hard)', fontFamily: 'IBM Plex Mono', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--ct-ink)"
                    strokeWidth={4}
                    dot={{ r: 4, fill: '#fff', stroke: 'var(--ct-ink)', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: 'var(--ct-accent)', stroke: 'var(--ct-ink)' }}
                    isAnimationActive={true}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Streak Tracker */}
        <motion.div variants={itemVariants} className="lg:col-span-3 card-brutal p-6 flex flex-col justify-between bg-white">
          <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-[var(--ct-border-hard)]">
            <h3 className="font-bold text-sm uppercase tracking-widest">Daily Streak</h3>
            <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <Flame className="w-5 h-5 text-[var(--ct-warning)] fill-[var(--ct-warning)]" strokeWidth={2} />
            </motion.div>
          </div>

          <div className="text-center mb-6">
            <motion.span 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
              className="text-6xl font-bold font-display tracking-tighter"
            >
              {streakInfo.currentStreak}
            </motion.span>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-[var(--ct-ink-muted)] mt-1">Days Active</span>
          </div>

          <div className="flex justify-between w-full">
            {streakInfo.dayLabels.map((day, i) => (
              <div key={`streak-day-${i}`} className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold uppercase">{day}</span>
                <div
                  className={`w-6 h-6 border-2 flex items-center justify-center transition-all ${
                    streakInfo.completedDays[i]
                      ? 'bg-[var(--ct-accent)] border-[var(--ct-border-hard)] text-[var(--ct-ink)] shadow-[2px_2px_0px_var(--ct-border-hard)] scale-110'
                      : 'bg-white border-[var(--ct-border-light)] text-transparent'
                  }`}
                >
                  {streakInfo.completedDays[i] && <Check className="w-4 h-4" strokeWidth={3} />}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Impact KPIs */}
        <motion.div variants={itemVariants} className="lg:col-span-3 card-brutal p-6 flex flex-col justify-between bg-[var(--ct-bg-surface)]">
          <h3 className="font-bold text-sm uppercase tracking-widest mb-6 pb-4 border-b-2 border-[var(--ct-border-hard)]">Impact KPIs</h3>
          <div className="flex flex-col gap-4">
            {IMPACT_KPIS.map((kpi: KpiItem, i: number) => {
              const KpiIcon = kpi.icon;
              return (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 5 }}
                  className="flex flex-col border-l-4 border-[var(--ct-border-hard)] pl-3 bg-white p-2 shadow-[2px_2px_0px_var(--ct-border-light)] hover:shadow-[4px_4px_0px_var(--ct-border-hard)] hover:border-[var(--ct-accent)] transition-all cursor-default"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--ct-ink-muted)]">{kpi.label}</span>
                    <KpiIcon className="w-3 h-3 text-[var(--ct-ink)]" />
                  </div>
                  <span className="text-lg font-bold font-display">{kpi.val}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ─── ROW 4: CHALLENGES | COMMUNITY ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Challenges */}
        <motion.div variants={itemVariants} className="card-brutal p-6 bg-[var(--ct-bg-surface)]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-[var(--ct-border-hard)]">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--ct-ink)] flex items-center gap-2">
              <Trophy className="w-5 h-5" /> Active Challenges
            </h3>
            <button 
              onClick={() => navigate('/dashboard/goals')} 
              className="text-[10px] font-bold uppercase tracking-widest text-[var(--ct-ink-muted)] hover:text-[var(--ct-ink)] flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          
          {activeChallenges.length === 0 ? (
            <div className="border-2 border-dashed border-[var(--ct-border-hard)] p-6 text-center bg-white flex flex-col items-center justify-center">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--ct-ink-muted)] mb-4">No challenges added yet.</p>
              <button 
                onClick={() => navigate('/dashboard/goals')}
                className="btn-brutal bg-[var(--ct-ink)] text-white px-6 py-2 text-xs hover:bg-[var(--ct-accent)] hover:text-[var(--ct-ink)]"
              >
                + Browse Challenges
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeChallenges.slice(0, 2).map((challenge) => (
                <div key={challenge.id} className="bg-white border-2 border-[var(--ct-border-hard)] p-4 shadow-[2px_2px_0px_var(--ct-border-hard)]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl w-10 h-10 border-2 border-[var(--ct-border-hard)] flex items-center justify-center">
                      {challenge.emoji}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wide mb-1">{challenge.title}</h4>
                      <p className="text-[10px] text-[var(--ct-ink-muted)] uppercase tracking-widest font-bold line-clamp-1">{challenge.description}</p>
                    </div>
                  </div>
                  <div className="w-full bg-[var(--ct-bg-surface)] border-2 border-[var(--ct-border-hard)] h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.round((challenge.progress / challenge.total) * 100)}%` }}
                      viewport={{ once: true }}
                      className="bg-[var(--ct-accent)] h-full border-r-2 border-[var(--ct-border-hard)]"
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap mt-1 block text-right">
                    {challenge.progress}/{challenge.total}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Community Impact */}
        <motion.div variants={itemVariants} className="card-brutal p-8 flex flex-col justify-center items-center text-center bg-[var(--ct-accent)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.1)_100%)] pointer-events-none" />
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
            <Target className="w-12 h-12 mb-4 stroke-[2px] opacity-80" />
          </motion.div>
          <h3 className="font-bold text-sm uppercase tracking-widest mb-2 z-10">Global Impact</h3>
          <h2 className="text-4xl md:text-5xl font-bold font-display tracking-tighter mb-4 z-10 flex items-baseline">
            {COMMUNITY_STATS.totalReduced}
            <span className="text-lg uppercase ml-2 tracking-widest font-mono">kg CO₂e</span>
          </h2>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white border-2 border-[var(--ct-border-hard)] px-4 py-2 shadow-[4px_4px_0px_var(--ct-border-hard)] z-10 cursor-pointer"
          >
            <p className="text-xs font-bold uppercase tracking-widest">
              Equivalent to {COMMUNITY_STATS.treesEquivalent} trees planted
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
