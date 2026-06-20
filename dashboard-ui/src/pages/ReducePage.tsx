// ============================================================
// ReducePage — Actionable tips to reduce carbon footprint
// Refactored to Industrial Utilitarian aesthetic
// ============================================================

import { useState } from 'react';
import { Car, UtensilsCrossed, Zap, ShoppingBag, Leaf, TrendingDown, Filter, type LucideIcon } from 'lucide-react';

// ── Data ────────────────────────────────────────────────────

type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface ReductionTip {
  id: string;
  category: string;
  action: string;
  description: string;
  savingsKg: number;
  difficulty: Difficulty;
}

const DIFFICULTY_COLORS: Record<Difficulty, { text: string; bg: string }> = {
  Easy:   { text: 'text-[var(--ct-ink)]', bg: 'bg-[var(--ct-accent)]' },
  Medium: { text: 'text-[var(--ct-ink)]', bg: 'bg-[var(--ct-warning)]' },
  Hard:   { text: 'text-white',           bg: 'bg-[var(--ct-ink)]' },
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  transport: Car,
  food: UtensilsCrossed,
  energy: Zap,
  shopping: ShoppingBag,
};

const REDUCTION_TIPS: ReductionTip[] = [
  // Transport
  { id: 't1', category: 'transport', action: 'Use public transit for commute', description: 'Replace car commute with metro/bus 3 days a week. Most Indian metros emit 80% less CO₂ per km vs cars.', savingsKg: 45, difficulty: 'Easy' },
  { id: 't2', category: 'transport', action: 'Carpool to work', description: 'Share rides with colleagues. Apps like Quick Ride make it simple to find ride-shares.', savingsKg: 30, difficulty: 'Easy' },
  { id: 't3', category: 'transport', action: 'Cycle for short trips', description: 'Bike for trips under 5 km instead of driving. Zero emissions plus great exercise.', savingsKg: 15, difficulty: 'Medium' },
  { id: 't4', category: 'transport', action: 'Switch to EV', description: 'Electric vehicles produce 50-70% fewer emissions over their lifetime, especially with renewable charging.', savingsKg: 80, difficulty: 'Hard' },
  // Food
  { id: 'f1', category: 'food', action: 'One plant-based day per week', description: 'Replace meat with dal, paneer, or tofu for just one day. Small change, big impact.', savingsKg: 12, difficulty: 'Easy' },
  { id: 'f2', category: 'food', action: 'Reduce food waste', description: 'Plan meals and store leftovers properly. Average Indian household wastes 50 kg of food per year.', savingsKg: 8, difficulty: 'Easy' },
  { id: 'f3', category: 'food', action: 'Eat seasonal & local produce', description: 'Imported and off-season produce has a much higher carbon footprint from transport and cold storage.', savingsKg: 10, difficulty: 'Medium' },
  { id: 'f4', category: 'food', action: 'Go fully plant-based', description: 'A fully plant-based diet can reduce food emissions by up to 75%. Start gradually if needed.', savingsKg: 40, difficulty: 'Hard' },
  // Energy
  { id: 'e1', category: 'energy', action: 'Switch to LED bulbs', description: 'LEDs use 75% less energy than incandescent bulbs and last 25x longer.', savingsKg: 6, difficulty: 'Easy' },
  { id: 'e2', category: 'energy', action: 'Set AC to 24°C', description: 'Each degree below 24°C increases energy use by 6%. Use fans alongside for better comfort.', savingsKg: 15, difficulty: 'Easy' },
  { id: 'e3', category: 'energy', action: 'Install solar panels', description: 'Rooftop solar can offset 70-100% of household electricity. Government subsidies available.', savingsKg: 50, difficulty: 'Hard' },
  { id: 'e4', category: 'energy', action: 'Unplug standby devices', description: 'Phantom loads from standby devices can account for 5-10% of household electricity consumption.', savingsKg: 5, difficulty: 'Easy' },
  // Shopping
  { id: 's1', category: 'shopping', action: 'Buy second-hand', description: 'Thrift stores and online resale platforms give items a second life, reducing manufacturing emissions.', savingsKg: 20, difficulty: 'Easy' },
  { id: 's2', category: 'shopping', action: 'Repair before replacing', description: 'Fix electronics and clothing instead of buying new. Many items can be repaired at local shops.', savingsKg: 15, difficulty: 'Medium' },
  { id: 's3', category: 'shopping', action: 'Batch online orders', description: 'Consolidate purchases into fewer deliveries to reduce packaging waste and transport emissions.', savingsKg: 8, difficulty: 'Easy' },
  { id: 's4', category: 'shopping', action: 'Choose sustainable brands', description: 'Support brands with transparent supply chains and verified carbon-neutral manufacturing.', savingsKg: 12, difficulty: 'Medium' },
];

const ALL_CATEGORIES = ['all', 'transport', 'food', 'energy', 'shopping'] as const;
const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  transport: 'Transport',
  food: 'Food',
  energy: 'Energy',
  shopping: 'Shopping',
};

// ── Page Component ──────────────────────────────────────────

export default function ReducePage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered = activeCategory === 'all'
    ? REDUCTION_TIPS
    : REDUCTION_TIPS.filter((t) => t.category === activeCategory);

  const totalPotentialSavings = filtered.reduce((sum, t) => sum + t.savingsKg, 0);

  return (
    <div className="space-y-8 max-w-[2560px] mx-auto">
      <div className="border-b-4 border-[var(--ct-border-hard)] pb-4 mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-[var(--ct-ink)] tracking-tighter font-display uppercase flex items-center gap-3">
          Reduce Impact
          <Leaf className="w-8 h-8 text-[var(--ct-accent)] stroke-[3px]" />
        </h1>
        <p className="text-sm font-bold uppercase tracking-widest text-[var(--ct-ink-muted)] mt-2">Actionable steps to lower your carbon footprint, personalized for your lifestyle.</p>
      </div>

      {/* Summary Banner */}
      <div className="card-brutal p-6 bg-[var(--ct-ink)] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[8px_8px_0px_var(--ct-border-hard)]">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 border-2 border-[var(--ct-border-hard)] bg-[var(--ct-accent)] text-[var(--ct-ink)] flex items-center justify-center shadow-[4px_4px_0px_var(--ct-border-hard)]">
            <TrendingDown className="w-8 h-8 stroke-[3px]" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/70">Total Potential Savings</p>
            <p className="text-4xl font-display font-bold tracking-tighter">
              {totalPotentialSavings} <span className="text-sm tracking-widest uppercase font-bold text-white/70">kg CO₂e/month</span>
            </p>
          </div>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 max-w-xs text-center sm:text-right border-l-2 border-white/20 pl-4">
          IMPLEMENT ALL {filtered.length} ACTIONS TO MAXIMIZE YOUR IMPACT. START WITH THE EASY ONES!
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <Filter className="w-5 h-5 text-[var(--ct-ink)] stroke-[2.5px]" />
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            aria-pressed={activeCategory === cat}
            className={`px-4 py-2 border-2 text-xs font-bold uppercase tracking-widest transition-all ${
              activeCategory === cat
                ? 'border-[var(--ct-border-hard)] bg-[var(--ct-ink)] text-white shadow-[2px_2px_0px_var(--ct-accent)] translate-x-[-2px] translate-y-[-2px]'
                : 'border-[var(--ct-border-hard)] bg-white text-[var(--ct-ink)] hover:bg-[var(--ct-bg-surface)] hover:shadow-[2px_2px_0px_var(--ct-border-hard)] hover:-translate-y-0.5'
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Tip Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((tip) => {
          const Icon = CATEGORY_ICONS[tip.category];
          const diffStyle = DIFFICULTY_COLORS[tip.difficulty];

          return (
            <div
              key={tip.id}
              className="card-brutal p-5 bg-white flex flex-col hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--ct-border-hard)] transition-all group"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 flex items-center justify-center shrink-0 border-2 border-[var(--ct-border-hard)] bg-[var(--ct-bg-surface)] shadow-[2px_2px_0px_var(--ct-border-hard)]"
                  >
                    <Icon className="w-6 h-6 stroke-[2px] text-[var(--ct-ink)]" aria-hidden="true" />
                  </div>
                  <h3 className="text-sm font-display font-bold uppercase tracking-wider text-[var(--ct-ink)]">{tip.action}</h3>
                </div>
              </div>

              <p className="text-[11px] font-bold tracking-wide text-[var(--ct-ink-muted)] leading-relaxed mb-6 flex-1 bg-[var(--ct-bg-surface)] border-2 border-[var(--ct-border-hard)] p-3">
                {tip.description}
              </p>

              <div className="flex items-center justify-between border-t-2 border-[var(--ct-border-hard)] pt-4">
                <div className="flex items-center gap-3 w-full">
                  <span className="text-sm font-display font-bold text-[var(--ct-ink)] border-2 border-[var(--ct-border-hard)] px-3 py-1 bg-[var(--ct-accent)] shadow-[2px_2px_0px_var(--ct-border-hard)]">
                    -{tip.savingsKg} <span className="text-[10px] tracking-widest uppercase">kg/mo</span>
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest border-2 border-[var(--ct-border-hard)] px-3 py-1 shadow-[2px_2px_0px_var(--ct-border-hard)] ml-auto ${diffStyle.text} ${diffStyle.bg}`}>
                    {tip.difficulty}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 border-4 border-dashed border-[var(--ct-border-hard)] bg-[var(--ct-bg-light)]">
          <Leaf className="w-16 h-16 mx-auto mb-4 stroke-[1.5px] text-[var(--ct-ink-faint)]" />
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--ct-ink-muted)]">NO TIPS FOUND FOR THIS CATEGORY.</p>
        </div>
      )}
    </div>
  );
}
