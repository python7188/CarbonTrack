// ============================================================
// FootprintPage — Detailed carbon footprint breakdown
// Refactored to Industrial Utilitarian aesthetic
// ============================================================

import { useState } from 'react';
import { TrendingDown, TrendingUp, Lightbulb, Wallet, Flame, Award, Car, UtensilsCrossed, Zap, ShoppingBag } from 'lucide-react';
import {
  PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid,
} from 'recharts';

import type { DonutSegment, Activity } from '../types';
import { getHistory } from '../lib/storage';

// ── Demo data ───────────────────────────────────────────────

// Dynamic data logic used in component

// We will compute CATEGORY_DETAILS dynamically below

// ── Custom Tooltip for Chart ────────────────────────────────
interface BrutalistTooltipProps {
  active?: boolean;
  label?: string;
  payload?: { name: string; value: number; fill: string }[];
}
const BrutalistTooltip = ({ active, payload, label }: BrutalistTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border-4 border-[var(--ct-border-hard)] p-3 shadow-[4px_4px_0px_var(--ct-border-hard)]">
        <p className="font-display font-bold uppercase tracking-widest text-[var(--ct-ink)] mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest" style={{ color: entry.fill }}>
            <span className="w-3 h-3 border-2 border-current" />
            <span>{entry.name}: {entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ── Page Component ──────────────────────────────────────────

export default function FootprintPage() {
  const [activities] = useState<Activity[]>(getHistory);

  const validActivities = activities.filter(a => !a.id?.startsWith('tour-completed'));

  const totalKgRaw = validActivities.reduce((sum, act) => sum + Number(act?.co2 || 0), 0);
  const totalKg = parseFloat(totalKgRaw.toFixed(1));

  const categoryTotals = validActivities.reduce((acc, act) => {
    const key = act?.category || 'waste';
    acc[key] = (acc[key] || 0) + Number(act?.co2 || 0);
    return acc;
  }, {} as Record<string, number>);

  const CATEGORY_DETAILS = [
    { name: 'Transport', amount: categoryTotals.transport || 0, icon: Car, key: 'transport', color: '#1D9E75', unit: 'kg', tip: 'Consider carpooling or public transit.' },
    { name: 'Food', amount: categoryTotals.food || 0, icon: UtensilsCrossed, key: 'food', color: '#BA7517', unit: 'kg', tip: 'Eat more plant-based meals.' },
    { name: 'Energy', amount: categoryTotals.energy || 0, icon: Zap, key: 'energy', color: '#378ADD', unit: 'kg', tip: 'Switch to LED bulbs.' },
    { name: 'Shopping', amount: categoryTotals.shopping || 0, icon: ShoppingBag, key: 'shopping', color: '#7F77DD', unit: 'kg', tip: 'Buy second-hand or durable items.' }
  ].filter(cat => cat.amount > 0);

  let COMPUTED_DONUT_DATA = CATEGORY_DETAILS.map(cat => ({
    name: cat.name,
    value: Math.round((cat.amount / totalKg) * 100) || 0,
    color: cat.color
  }));

  if (COMPUTED_DONUT_DATA.length === 0) {
    COMPUTED_DONUT_DATA = [{ name: 'No Data', value: 100, color: 'var(--ct-border-hard)' }];
  }

  // Calculate dynamic Monthly Comparison
  const currentMonthDate = new Date();
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(currentMonthDate.getMonth() - 1);
  
  const currentMonthStr = currentMonthDate.toISOString().slice(0, 7);
  const lastMonthStr = lastMonthDate.toISOString().slice(0, 7);
  const lastYearCurrentMonthStr = new Date(currentMonthDate.setFullYear(currentMonthDate.getFullYear() - 1)).toISOString().slice(0, 7);
  const lastYearLastMonthStr = new Date(lastMonthDate.setFullYear(lastMonthDate.getFullYear() - 1)).toISOString().slice(0, 7);

  const thisMonthTotal = validActivities.filter(a => (a.timestamp || a.date)?.startsWith(currentMonthStr)).reduce((sum, act) => sum + Number(act.co2 || 0), 0);
  const lastMonthTotal = validActivities.filter(a => (a.timestamp || a.date)?.startsWith(lastMonthStr)).reduce((sum, act) => sum + Number(act.co2 || 0), 0);
  
  const lastYearThisMonthTotal = validActivities.filter(a => (a.timestamp || a.date)?.startsWith(lastYearCurrentMonthStr)).reduce((sum, act) => sum + Number(act.co2 || 0), 0);
  const lastYearLastMonthTotal = validActivities.filter(a => (a.timestamp || a.date)?.startsWith(lastYearLastMonthStr)).reduce((sum, act) => sum + Number(act.co2 || 0), 0);

  const MONTHLY_COMPARISON = [
    { month: 'Last Month', previous: parseFloat(lastYearLastMonthTotal.toFixed(1)), current: parseFloat(lastMonthTotal.toFixed(1)) },
    { month: 'This Month', previous: parseFloat(lastYearThisMonthTotal.toFixed(1)), current: parseFloat(thisMonthTotal.toFixed(1)) },
  ];

  const reductionPct = lastMonthTotal > 0 ? Math.round(((lastMonthTotal - thisMonthTotal) / lastMonthTotal) * 100) : 0;
  const isIncrease = reductionPct < 0;
  
  const savedKg = Math.max(0, lastMonthTotal - thisMonthTotal).toFixed(1);

  const globalAvg = 910;
  const diffAvgPct = Math.round(((globalAvg - thisMonthTotal) / globalAvg) * 100);
  const isBelowAvg = diffAvgPct >= 0;

  return (
    <div className="space-y-8 w-full max-w-none mx-auto">
      <div className="border-b-4 border-[var(--ct-border-hard)] pb-4 mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-[var(--ct-ink)] tracking-tighter font-display uppercase">My Footprint</h1>
        <p className="text-sm font-bold uppercase tracking-widest text-[var(--ct-ink-muted)] mt-2">A detailed look at your carbon emissions this month.</p>
      </div>

      {/* ─── Large Donut + Summary ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-brutal p-8 bg-[var(--ct-ink)] text-white flex flex-col items-center border-[var(--ct-ink)] shadow-[8px_8px_0px_var(--ct-border-hard)]">
          <h2 className="text-lg font-bold font-display uppercase tracking-widest mb-6 self-start border-b-2 border-white/20 pb-2 w-full">Emissions Breakdown</h2>
          
          {validActivities.length === 0 ? (
            <div className="flex-1 w-full flex items-center justify-center border-4 border-dashed border-white/20 min-h-[260px]">
              <p className="text-sm font-bold uppercase tracking-widest text-white/60 text-center px-4">Log an activity to see this chart</p>
            </div>
          ) : (
            <>
              <div className="w-[260px] h-[260px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie data={COMPUTED_DONUT_DATA} innerRadius={80} outerRadius={110} paddingAngle={4} dataKey="value" stroke="#16211F" strokeWidth={4}>
                      {COMPUTED_DONUT_DATA.map((entry: DonutSegment, index: number) => (
                        <Cell key={`cell-fp-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-5xl font-display font-bold tracking-tighter">{totalKg}</span>
                  <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest mt-1 bg-white/10 px-2 py-1">kg CO₂e</span>
                </div>
              </div>

              <div className="w-full mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {COMPUTED_DONUT_DATA.map((d: DonutSegment) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs text-white/80 font-bold uppercase tracking-widest">
                    <span className="w-3 h-3 border-2 border-white" style={{ backgroundColor: d.color }} />
                    <span>{d.name}</span>
                    <span className="ml-auto font-display text-white">{d.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="card-brutal p-6 flex flex-col items-center text-center justify-center">
            {isIncrease ? (
              <TrendingUp className="w-10 h-10 text-[var(--ct-warning)] stroke-[3px] mb-3" />
            ) : (
              <TrendingDown className="w-10 h-10 text-[var(--ct-accent)] stroke-[3px] mb-3" />
            )}
            <span className="text-4xl font-display font-bold text-[var(--ct-ink)] tracking-tighter">{Math.abs(reductionPct)}%</span>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--ct-ink-muted)] mt-2">
              {isIncrease ? 'Increase vs Last Month' : 'Reduction vs Last Month'}
            </span>
          </div>
          <div className="card-brutal p-6 flex flex-col items-center text-center justify-center">
            <Lightbulb className="w-10 h-10 text-[var(--ct-warning)] stroke-[3px] mb-3" />
            <span className="text-4xl font-display font-bold text-[var(--ct-ink)] tracking-tighter">{savedKg}</span>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--ct-ink-muted)] mt-2">kg CO₂e Saved</span>
          </div>
          <div className="card-brutal p-6 flex flex-col items-center text-center justify-center sm:col-span-2 bg-[var(--ct-bg-surface)]">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--ct-ink-muted)] mb-2">Global Average</span>
            <span className="text-5xl font-display font-bold text-[var(--ct-ink)] tracking-tighter">{globalAvg} <span className="text-base tracking-widest uppercase">kg CO₂e</span></span>
            <span className={`text-xs font-bold uppercase tracking-widest px-4 py-2 mt-4 border-2 border-[var(--ct-border-hard)] shadow-[2px_2px_0px_var(--ct-border-hard)] ${isBelowAvg ? 'bg-[var(--ct-accent)] text-[var(--ct-ink)]' : 'bg-[var(--ct-warning)] text-white'}`}>
              You're {Math.abs(diffAvgPct)}% {isBelowAvg ? 'below' : 'above'} average!
            </span>
          </div>
        </div>
      </div>

      {/* ─── Carbon Budget Wallet ───────────────────────────── */}
      <div className="pt-4 border-t-4 border-[var(--ct-border-hard)]">
        <h2 className="text-xl font-display font-bold uppercase tracking-widest text-[var(--ct-ink)] mb-6 flex items-center gap-2">
          <Wallet className="w-6 h-6 stroke-[3px]" />
          Carbon Budget Wallet
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-brutal p-6 bg-white col-span-2">
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Monthly Allowance</h3>
            <div className="w-full bg-[var(--ct-bg-surface)] h-8 mb-2 border-2 border-[var(--ct-border-hard)] relative overflow-hidden">
              <div className="h-full bg-[var(--ct-ink)] border-r-2 border-[var(--ct-border-hard)]" style={{ width: `${(totalKg / 600) * 100}%` }} />
              <div className="absolute inset-0 flex items-center justify-between px-4 text-[10px] font-bold uppercase tracking-widest mix-blend-difference text-white">
                <span>Consumed: {totalKg} kg</span>
                <span>Budget: 600 kg</span>
              </div>
            </div>
            <p className="text-xs font-bold text-[var(--ct-ink-muted)]">
              Burn Rate: <span className="text-[var(--ct-ink)]">~{Math.round(totalKg / 30)} kg/day</span>. You have {600 - totalKg} kg remaining this month.
            </p>
          </div>
          
          <div className="card-brutal p-6 bg-[var(--ct-accent)] text-[var(--ct-ink)] flex flex-col justify-center items-center text-center">
            {totalKg < 600 ? (
              <>
                <Award className="w-12 h-12 stroke-[3px] mb-2" />
                <h3 className="font-bold font-display uppercase tracking-widest text-lg">On Track!</h3>
                <p className="text-xs font-bold mt-1">Keep it up to earn the "Budget Master" badge.</p>
              </>
            ) : (
              <>
                <Flame className="w-12 h-12 stroke-[3px] text-[var(--ct-warning)] mb-2" />
                <h3 className="font-bold font-display uppercase tracking-widest text-lg text-[var(--ct-warning)]">Budget Exceeded</h3>
                <p className="text-xs font-bold mt-1">Penalty applied to eco-score.</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ─── Category Cards ─────────────────────────────────── */}
      <div className="pt-8 border-t-4 border-[var(--ct-border-hard)]">
        <h2 className="text-xl font-display font-bold uppercase tracking-widest text-[var(--ct-ink)] mb-6">Category Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORY_DETAILS.length === 0 ? (
            <div className="card-brutal p-5 bg-white flex flex-col col-span-full">
              <p className="text-sm font-bold uppercase text-[var(--ct-ink-muted)]">No details available yet. Start logging!</p>
            </div>
          ) : CATEGORY_DETAILS.map((cat) => {
            const CatIcon = cat.icon;
            const pct = Math.round((cat.amount / totalKg) * 100) || 0;
            return (
              <div
                key={cat.key}
                className="card-brutal p-5 bg-white flex flex-col hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--ct-border-hard)] transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-12 h-12 flex items-center justify-center border-2 border-[var(--ct-border-hard)] bg-[var(--ct-bg-surface)] shadow-[2px_2px_0px_var(--ct-border-hard)]"
                  >
                    <CatIcon className="w-6 h-6 stroke-[2px]" style={{ color: cat.color }} aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-display font-bold uppercase tracking-wider text-[var(--ct-ink)]">{cat.name}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--ct-ink-muted)]">{pct}% OF TOTAL</p>
                  </div>
                  <span className="text-xl font-display font-bold tracking-tighter text-[var(--ct-ink)]">
                    {cat.amount} <span className="text-[10px] tracking-widest uppercase font-bold text-[var(--ct-ink-muted)]">{cat.unit}</span>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[var(--ct-bg-surface)] h-3 mb-4 border-2 border-[var(--ct-border-hard)]">
                  <div className="h-full border-r-2 border-[var(--ct-border-hard)]" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
                </div>

                {/* Tip */}
                <div className="flex items-start gap-3 bg-[var(--ct-bg-surface)] border-2 border-[var(--ct-border-hard)] p-3 mt-auto">
                  <Lightbulb className="w-5 h-5 text-[var(--ct-warning)] stroke-[2.5px] mt-0.5 shrink-0" />
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--ct-ink)] leading-relaxed">{cat.tip}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Monthly Comparison Bar Chart ───────────────────── */}
      <div className="card-brutal p-6 bg-white">
        <h2 className="text-xl font-display font-bold uppercase tracking-widest text-[var(--ct-ink)] mb-8 border-b-2 border-[var(--ct-border-hard)] pb-2">Monthly Comparison</h2>
        {validActivities.length === 0 ? (
          <div className="h-[350px] w-full flex items-center justify-center border-4 border-dashed border-[var(--ct-border-light)]">
            <p className="text-sm font-bold uppercase tracking-widest text-[var(--ct-ink-muted)] px-4 text-center">Log an activity to see this chart</p>
          </div>
        ) : (
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_COMPARISON} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="var(--ct-border-hard)" strokeWidth={2} />
                <XAxis dataKey="month" axisLine={{ stroke: 'var(--ct-border-hard)', strokeWidth: 4 }} tickLine={{ stroke: 'var(--ct-border-hard)', strokeWidth: 2 }} tick={{ fontSize: 12, fill: 'var(--ct-ink)', fontWeight: 'bold' }} />
                <YAxis axisLine={{ stroke: 'var(--ct-border-hard)', strokeWidth: 4 }} tickLine={{ stroke: 'var(--ct-border-hard)', strokeWidth: 2 }} tick={{ fontSize: 12, fill: 'var(--ct-ink)', fontWeight: 'bold' }} />
                <RechartsTooltip content={<BrutalistTooltip />} cursor={{ fill: 'var(--ct-bg-surface)' }} />
                <Bar dataKey="previous" fill="var(--ct-ink-muted)" stroke="var(--ct-border-hard)" strokeWidth={2} name="LAST YEAR" />
                <Bar dataKey="current" fill="var(--ct-accent)" stroke="var(--ct-border-hard)" strokeWidth={2} name="THIS YEAR" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-6 mt-6 pt-4 border-t-2 border-[var(--ct-border-hard)] text-[10px] font-bold uppercase tracking-widest text-[var(--ct-ink)]">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-[var(--ct-border-hard)] bg-[var(--ct-ink-muted)] shadow-[2px_2px_0px_var(--ct-border-hard)]" /> LAST YEAR
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-[var(--ct-border-hard)] bg-[var(--ct-accent)] shadow-[2px_2px_0px_var(--ct-border-hard)]" /> THIS YEAR
          </div>
        </div>
      </div>
    </div>
  );
}
