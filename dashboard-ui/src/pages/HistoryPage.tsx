import { useState } from 'react';
import { Calendar, Trash2, Activity, Filter } from 'lucide-react';
import { getHistory } from '../lib/storage';

import type { Activity as ActivityType } from '../types';

export default function HistoryPage() {
  const [filter, setFilter] = useState<string>('all');
  const [history, setHistory] = useState<ActivityType[]>(() =>
    [...getHistory()].sort(
      (a, b) => new Date(b.timestamp || b.date || '').getTime() - new Date(a.timestamp || a.date || '').getTime()
    )
  );
  const availableYears = Array.from(new Set(history.map(item => new Date(item.timestamp).getFullYear().toString()))).sort((a, b) => b.localeCompare(a));
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  const deleteEntry = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('ct_history', JSON.stringify(updated));
  };

  const filteredHistory = history.filter(item => {
    const matchesCategory = filter === 'all' || item.category === filter;
    
    const d = new Date(item.timestamp);
    const y = d.getFullYear().toString();
    const m = (d.getMonth() + 1).toString();
    
    const matchesYear = selectedYear === 'all' || y === selectedYear;
    const matchesMonth = selectedMonth === 'all' || m === selectedMonth;

    return matchesCategory && matchesYear && matchesMonth;
  });

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  const availableMonths = [
    { value: '1', label: 'January' }, { value: '2', label: 'February' },
    { value: '3', label: 'March' }, { value: '4', label: 'April' },
    { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' },
    { value: '9', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];

  const safeFormatDate = (timestamp: string) => {
    try {
      return dateFormatter.format(new Date(timestamp));
    } catch {
      return 'Unknown Date';
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-none mx-auto gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4 pb-6 border-b-4 border-[var(--ct-border-hard)]">
        <h1 className="text-4xl sm:text-5xl font-black font-display uppercase tracking-tighter text-[var(--ct-ink)]">
          Action History
        </h1>
        <p className="text-[var(--ct-ink-muted)] text-lg font-bold max-w-2xl leading-relaxed">
          The complete ledger of your logged activities. Every action, every emission, recorded precisely.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto hide-scrollbar">
            <Filter className="w-5 h-5 text-[var(--ct-ink-muted)] mr-2 shrink-0" aria-hidden="true" />
            {['all', 'transport', 'food', 'energy', 'shopping'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                aria-pressed={filter === cat}
                className={`px-4 py-2 font-bold text-xs uppercase tracking-widest border-2 whitespace-nowrap transition-all ${
                  filter === cat
                    ? 'bg-[var(--ct-ink)] text-white border-[var(--ct-ink)] shadow-[2px_2px_0px_var(--ct-border-hard)]'
                    : 'bg-white text-[var(--ct-ink-muted)] border-[var(--ct-border-hard)] hover:bg-[var(--ct-bg-surface)] hover:text-[var(--ct-ink)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-white border-2 border-[var(--ct-border-hard)] px-4 py-2 text-sm font-bold uppercase tracking-widest text-[var(--ct-ink)] shadow-[2px_2px_0px_var(--ct-border-hard)] focus:outline-none focus:translate-y-[2px] focus:shadow-none transition-all cursor-pointer appearance-none"
            >
              <option value="all">All Years</option>
              {availableYears.map(yr => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-white border-2 border-[var(--ct-border-hard)] px-4 py-2 text-sm font-bold uppercase tracking-widest text-[var(--ct-ink)] shadow-[2px_2px_0px_var(--ct-border-hard)] focus:outline-none focus:translate-y-[2px] focus:shadow-none transition-all cursor-pointer appearance-none"
            >
              <option value="all">All Months</option>
              {availableMonths.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4 pb-20">
        {filteredHistory.length === 0 ? (
          <div className="card-brutal p-12 bg-white flex flex-col items-center justify-center text-center">
            <Calendar className="w-16 h-16 text-[var(--ct-ink-faint)] mb-4" />
            <p className="text-xl font-bold text-[var(--ct-ink)] uppercase tracking-widest">No Activity Found</p>
            <p className="text-sm font-bold uppercase tracking-widest text-[var(--ct-ink-muted)] mt-2">Adjust your filters or start logging</p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div key={item.id} className="card-brutal bg-white p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--ct-border-hard)] transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 border-2 border-[var(--ct-border-hard)] flex items-center justify-center shadow-[2px_2px_0px_var(--ct-border-hard)] bg-[var(--ct-accent)]`}>
                  <Activity className="w-6 h-6 text-[var(--ct-ink)]" strokeWidth={2} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold uppercase tracking-widest text-[var(--ct-ink)] group-hover:text-[var(--ct-accent-dark)] transition-colors">
                    {item.activity || item.category}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--ct-ink-muted)] mt-1">
                    {safeFormatDate(item.timestamp)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 w-full sm:w-auto border-t-2 border-[var(--ct-border-hard)] sm:border-0 pt-4 sm:pt-0">
                <div className="flex-1 sm:flex-none text-right">
                  <div className="flex items-center justify-end gap-1">
                    <p className="text-xl font-display font-bold text-[var(--ct-ink)]">
                      {Number(item.co2 || 0).toFixed(2)}
                    </p>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--ct-ink-muted)]">kg</span>
                  </div>
                </div>
                <button 
                  onClick={() => deleteEntry(item.id)}
                  className="w-10 h-10 bg-[var(--ct-bg-surface)] hover:bg-red-500 border-2 border-[var(--ct-border-hard)] flex items-center justify-center shadow-[2px_2px_0px_var(--ct-border-hard)] hover:text-white transition-colors group/btn"
                  title="Delete Entry"
                >
                  <Trash2 className="w-5 h-5 stroke-[2.5px] group-hover/btn:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
