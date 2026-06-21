// ============================================================
// TrackPage — Log and track carbon-producing activities
// Refactored to Industrial Utilitarian aesthetic
// ============================================================

import { useState, useCallback } from 'react';
import { Car, Zap, UtensilsCrossed, ShoppingBag, Plus, Check, AlertCircle, Loader2, type LucideIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { getGeminiEndpoint } from '../constants';
import type { Activity } from '../types';
import { useChallenges } from '../contexts/ChallengesContext';
import { logger } from '../lib/logger';
import { calculateCO2 } from '../lib/carbonMath';
import { getHistory, saveHistory } from '../lib/storage';

// ── Activity type options per category ──────────────────────

const ACTIVITY_OPTIONS: Record<string, { label: string; activities: { name: string, unit: string }[] }> = {
  transport: {
    label: 'Transport',
    activities: [
      { name: 'Car (petrol)', unit: 'km' },
      { name: 'Car (diesel)', unit: 'km' },
      { name: 'Motorcycle', unit: 'km' },
      { name: 'Bus/Metro', unit: 'km' },
      { name: 'Flight (domestic)', unit: 'hours' },
      { name: 'CUSTOM', unit: 'custom' },
    ],
  },
  food: {
    label: 'Food',
    activities: [
      { name: 'Red meat meal', unit: 'meals' },
      { name: 'Poultry meal', unit: 'meals' },
      { name: 'Vegetarian meal', unit: 'meals' },
      { name: 'Vegan meal', unit: 'meals' },
      { name: 'Dairy products', unit: 'kg' },
      { name: 'CUSTOM', unit: 'custom' },
    ],
  },
  energy: {
    label: 'Energy',
    activities: [
      { name: 'Electricity', unit: 'kWh' },
      { name: 'LPG cooking', unit: 'cylinders' },
      { name: 'Air conditioning', unit: 'hours' },
      { name: 'Water heating', unit: 'hours' },
      { name: 'Generator', unit: 'liters' },
      { name: 'CUSTOM', unit: 'custom' },
    ],
  },
  shopping: {
    label: 'Shopping',
    activities: [
      { name: 'Clothing', unit: 'items' },
      { name: 'Electronics', unit: 'items' },
      { name: 'Furniture', unit: 'items' },
      { name: 'Groceries (packaged)', unit: 'bags' },
      { name: 'Online delivery', unit: 'packages' },
      { name: 'CUSTOM', unit: 'custom' },
    ],
  },
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  transport: Car,
  food: UtensilsCrossed,
  energy: Zap,
  shopping: ShoppingBag,
};




// ── Page Component ──────────────────────────────────────────

export default function TrackPage() {
  const [category, setCategory] = useState<string>('transport');
  const [activityType, setActivityType] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [customDescription, setCustomDescription] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState<{ activity?: string; amount?: string; date?: string; custom?: string; api?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const currentOptions = ACTIVITY_OPTIONS[category];

  const handleCategoryChange = useCallback((cat: string) => {
    setCategory(cat);
    setActivityType('');
    setAmount('');
    setCustomDescription('');
    setErrors({});
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: { activity?: string; amount?: string; date?: string; custom?: string } = {};
    if (!activityType) {
      newErrors.activity = 'Please select an activity type.';
    }
    if (activityType === 'CUSTOM' && !customDescription.trim()) {
      newErrors.custom = 'Please describe your custom activity.';
    }
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0.';
    }
    if (!date) {
      newErrors.date = 'Please select a date.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [activityType, amount, date, customDescription]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      const num = parseFloat(amount);
      let co2Estimate: number;

      if (activityType === 'CUSTOM') {
        setIsCalculating(true);
        try {
          const selectedUnit = currentOptions.activities.find(a => a.name === activityType)?.unit || 'units';
          const prompt = `Calculate the estimated carbon emissions (in kg CO2e) for the following custom activity: "${customDescription}" with an amount of ${num} ${selectedUnit}. Return ONLY a JSON object with the exact format {"co2": 12.5}.`;
          
          const response = await fetch(getGeminiEndpoint(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: { 
                temperature: 0.1, 
                responseMimeType: "application/json" 
              },
            }),
          });

          if (!response.ok) throw new Error('API request failed: ' + response.statusText);
          const json = await response.json();
          const responseText = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          
          // Robustly extract JSON object in case of markdown wrapping or extra text
          const match = responseText.match(/\{[\s\S]*\}/);
          if (!match) throw new Error('No JSON object found in response: ' + responseText);
          
          const parsed = JSON.parse(match[0]);
          if (typeof parsed.co2 !== 'number') {
            // Attempt to parse if it returned string "12.5"
            const parsedNum = parseFloat(parsed.co2);
            if (isNaN(parsedNum)) throw new Error('Invalid JSON format returned: ' + responseText);
            co2Estimate = parsedNum;
          } else {
            co2Estimate = parsed.co2;
          }
        } catch (error) {
          logger.error('Failed to calculate custom CO2:', error);
          setErrors((prev) => ({ ...prev, api: 'Failed to estimate CO2 for custom activity. Please try again.' }));
          setIsCalculating(false);
          return;
        }
        setIsCalculating(false);
      } else {
        co2Estimate = calculateCO2(category, activityType, num);
      }


      const selectedOption = currentOptions.activities.find(a => a.name === activityType);
      const newActivity: Activity = {
        id: crypto.randomUUID(),
        category,
        activity: activityType === 'CUSTOM' ? customDescription : activityType,
        amount: num,
        unit: selectedOption?.unit || 'custom',
        co2: co2Estimate,
        timestamp: new Date(date).toISOString(),
        date,
        notes,
      };

      const existing = getHistory();
      saveHistory([...existing, newActivity]);
      
      setActivityType('');
      setAmount('');
      setCustomDescription('');
      setNotes('');
      setErrors({});
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    },
    [validate, amount, category, activityType, currentOptions, date, notes, customDescription]
  );

  return (
    <div className="space-y-8 w-full max-w-none mx-auto px-4 md:px-8">
      <div className="border-b-4 border-[var(--ct-border-hard)] pb-4 mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-[var(--ct-ink)] tracking-tighter font-display uppercase">Log Activities</h1>
        <p className="text-sm font-bold uppercase tracking-widest text-[var(--ct-ink-muted)] mt-2">Log your daily activities to track carbon emissions.</p>
      </div>

      <div className="card-brutal p-6 md:p-12 bg-white">
        <form onSubmit={handleSubmit} noValidate className="space-y-10">
          
          {/* 1. Category Selector */}
          <fieldset>
            <legend className="text-sm font-bold font-display text-[var(--ct-ink)] uppercase tracking-widest mb-4">1. Select Category</legend>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {Object.entries(ACTIVITY_OPTIONS).map(([key, opt]) => {
                const Icon = CATEGORY_ICONS[key];
                const isActive = category === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleCategoryChange(key)}
                    className={`flex flex-col items-center justify-center gap-3 p-6 border-4 transition-all font-bold uppercase tracking-widest ${
                      isActive
                        ? 'border-[var(--ct-border-hard)] bg-[var(--ct-ink)] text-white shadow-[6px_6px_0px_var(--ct-border-hard)] translate-x-[-2px] translate-y-[-2px]'
                        : 'border-[var(--ct-border-hard)] bg-white text-[var(--ct-ink)] hover:bg-[var(--ct-bg-surface)] hover:shadow-[6px_6px_0px_var(--ct-border-hard)] hover:-translate-y-1'
                    }`}
                    aria-pressed={isActive}
                  >
                    <Icon className={`w-8 h-8 md:w-10 md:h-10 stroke-[2.5px] ${isActive ? 'text-[var(--ct-accent)]' : ''}`} />
                    <span className="text-xs md:text-sm">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* 2. Activity Type */}
          <fieldset className="border-t-4 border-[var(--ct-border-hard)] pt-10">
            <legend className="text-sm font-bold font-display text-[var(--ct-ink)] uppercase tracking-widest mb-4">2. Select Activity Type</legend>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentOptions.activities.map((a) => {
                const isActive = activityType === a.name;
                return (
                  <button
                    key={a.name}
                    type="button"
                    onClick={() => { setActivityType(a.name); setErrors((prev) => ({ ...prev, activity: undefined })); }}
                    className={`p-4 text-xs font-bold uppercase tracking-widest border-2 transition-all text-left break-words ${
                      isActive
                        ? 'border-[var(--ct-border-hard)] bg-[var(--ct-accent)] text-[var(--ct-ink)] shadow-[4px_4px_0px_var(--ct-border-hard)] translate-x-[-2px] translate-y-[-2px]'
                        : 'border-[var(--ct-border-hard)] bg-[var(--ct-bg-light)] text-[var(--ct-ink)] hover:bg-[var(--ct-bg-surface)] hover:shadow-[4px_4px_0px_var(--ct-border-hard)] hover:-translate-y-1'
                    }`}
                    aria-pressed={isActive}
                  >
                    {a.name}
                  </button>
                );
              })}
            </div>
            {errors.activity && (
              <p role="alert" className="text-xs font-bold uppercase tracking-widest text-[var(--ct-warning)] mt-4 flex items-center gap-2 bg-white border-2 border-[var(--ct-warning)] p-3">
                <AlertCircle className="w-5 h-5 stroke-[3px]" /> {errors.activity}
              </p>
            )}

            {/* Custom Description Input */}
            <AnimatePresence>
              {activityType === 'CUSTOM' && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <label htmlFor="customDescription" className="block text-sm font-bold font-display text-[var(--ct-ink)] uppercase tracking-widest mb-3">
                    Describe Custom Activity
                  </label>
                  <input
                    id="customDescription"
                    type="text"
                    aria-invalid={!!errors.custom}
                    aria-describedby={errors.custom ? "custom-error" : undefined}
                    value={customDescription}
                    onChange={(e) => { setCustomDescription(e.target.value); setErrors((prev) => ({ ...prev, custom: undefined, api: undefined })); }}
                    placeholder="E.G. BOUGHT A NEW COUCH"
                    className={`w-full bg-white border-4 px-6 py-4 text-base text-[var(--ct-ink)] font-bold uppercase focus:outline-none focus:ring-0 focus:-translate-y-1 focus:shadow-[6px_6px_0px_var(--ct-border-hard)] transition-all ${
                      errors.custom ? 'border-[var(--ct-warning)] shadow-[6px_6px_0px_var(--ct-warning)]' : 'border-[var(--ct-border-hard)] shadow-[4px_4px_0px_var(--ct-border-hard)]'
                    }`}
                  />
                  {errors.custom && (
                    <p id="custom-error" role="alert" className="text-xs font-bold uppercase tracking-widest text-[var(--ct-warning)] mt-3 flex items-center gap-2 bg-white border-2 border-[var(--ct-warning)] p-3">
                      <AlertCircle className="w-5 h-5 stroke-[3px]" /> {errors.custom}
                    </p>
                  )}
                  {errors.api && (
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--ct-warning)] mt-3 flex items-center gap-2 bg-white border-2 border-[var(--ct-warning)] p-3">
                      <AlertCircle className="w-5 h-5 stroke-[3px]" /> {errors.api}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </fieldset>

          {/* 3. Details (Amount & Date) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 border-t-4 border-[var(--ct-border-hard)] pt-10">
            <div>
              <label htmlFor="amount" className="block text-sm font-bold font-display text-[var(--ct-ink)] uppercase tracking-widest mb-3">
                3. Amount
              </label>
              <div className="relative">
                <input
                  id="amount"
                  type="number"
                  min="0"
                  step="any"
                  aria-invalid={!!errors.amount}
                  aria-describedby={errors.amount ? "amount-error" : undefined}
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setErrors((prev) => ({ ...prev, amount: undefined })); }}
                  placeholder="ENTER AMOUNT..."
                  className={`w-full bg-white border-4 px-6 py-4 pr-20 text-base text-[var(--ct-ink)] font-bold uppercase focus:outline-none focus:ring-0 focus:-translate-y-1 focus:shadow-[6px_6px_0px_var(--ct-border-hard)] transition-all ${
                    errors.amount ? 'border-[var(--ct-warning)] shadow-[6px_6px_0px_var(--ct-warning)]' : 'border-[var(--ct-border-hard)] shadow-[4px_4px_0px_var(--ct-border-hard)]'
                  }`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--ct-ink-muted)] text-sm font-bold uppercase tracking-widest border-l-2 border-[var(--ct-border-hard)] pl-4">
                  {currentOptions.activities.find(a => a.name === activityType)?.unit || 'units'}
                </span>
              </div>
              {errors.amount && (
                <p id="amount-error" role="alert" className="text-xs font-bold uppercase tracking-widest text-[var(--ct-warning)] mt-3 flex items-center gap-2 bg-white border-2 border-[var(--ct-warning)] p-3">
                  <AlertCircle className="w-5 h-5 stroke-[3px]" /> {errors.amount}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-bold font-display text-[var(--ct-ink)] uppercase tracking-widest mb-3">
                Date
              </label>
              <div className="relative">
                <input
                  id="date"
                  type="date"
                  aria-invalid={!!errors.date}
                  aria-describedby={errors.date ? "date-error" : undefined}
                  value={date}
                  onChange={(e) => { setDate(e.target.value); setErrors((prev) => ({ ...prev, date: undefined })); }}
                  className={`w-full bg-white border-4 px-6 py-4 text-base text-[var(--ct-ink)] font-bold uppercase focus:outline-none focus:ring-0 focus:-translate-y-1 focus:shadow-[6px_6px_0px_var(--ct-border-hard)] transition-all ${
                    errors.date ? 'border-[var(--ct-warning)] shadow-[6px_6px_0px_var(--ct-warning)]' : 'border-[var(--ct-border-hard)] shadow-[4px_4px_0px_var(--ct-border-hard)]'
                  }`}
                />
              </div>
              {errors.date && (
                <p id="date-error" role="alert" className="text-xs font-bold uppercase tracking-widest text-[var(--ct-warning)] mt-3 flex items-center gap-2 bg-white border-2 border-[var(--ct-warning)] p-3">
                  <AlertCircle className="w-5 h-5 stroke-[3px]" /> {errors.date}
                </p>
              )}
            </div>
          </div>

          {/* 4. Notes */}
          <div className="border-t-4 border-[var(--ct-border-hard)] pt-10">
            <label htmlFor="notes" className="block text-sm font-bold font-display text-[var(--ct-ink)] uppercase tracking-widest mb-3">
              4. Additional Notes (Optional)
            </label>
            <div className="relative">
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="ADD CONTEXT..."
                rows={4}
                className="w-full bg-white border-4 px-6 py-5 text-base text-[var(--ct-ink)] font-bold uppercase resize-none focus:outline-none focus:ring-0 focus:-translate-y-1 focus:shadow-[6px_6px_0px_var(--ct-border-hard)] transition-all border-[var(--ct-border-hard)] shadow-[4px_4px_0px_var(--ct-border-hard)] placeholder:text-[var(--ct-ink-muted)]"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isCalculating}
              className={`btn-brutal w-full bg-[var(--ct-accent)] text-[var(--ct-ink)] py-6 flex items-center justify-center gap-3 text-xl shadow-[8px_8px_0px_var(--ct-border-hard)] hover:shadow-[12px_12px_0px_var(--ct-border-hard)] border-4 border-[var(--ct-border-hard)] ${isCalculating ? 'opacity-80 cursor-wait' : ''}`}
            >
              {isCalculating ? (
                <>
                  <Loader2 className="w-8 h-8 stroke-[3px] animate-spin" /> CALCULATING WITH AI...
                </>
              ) : (
                <>
                  <Plus className="w-8 h-8 stroke-[3px]" /> SAVE ACTIVITY
                </>
              )}
            </button>
          </div>

          {/* Success toast */}
          <AnimatePresence>
            {submitted && (
              <div
                className="mt-8 bg-[var(--ct-ink)] border-4 border-[var(--ct-border-hard)] text-[var(--ct-accent)] text-sm font-bold uppercase tracking-widest px-8 py-5 flex items-center justify-center gap-3 shadow-[8px_8px_0px_var(--ct-border-hard)]"
              >
                <Check className="w-6 h-6 stroke-[3px]" /> ENTRY LOGGED SUCCESSFULLY
              </div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
