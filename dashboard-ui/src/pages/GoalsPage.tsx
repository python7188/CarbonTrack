// ============================================================
// GoalsPage — Goals & Challenges
// Refactored to Industrial Utilitarian aesthetic
// ============================================================

import { useCallback, useState } from 'react';
import { Trophy, Plus, Target, CheckCircle2, Clock, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import type { Challenge } from '../types';

import { useChallenges } from '../contexts/ChallengesContext';

// ── Additional demo data ────────────────────────────────────

interface PersonalGoal {
  id: string;
  title: string;
  target: string;
  current: number;
  max: number;
  unit: string;
}

const PERSONAL_GOALS: PersonalGoal[] = [];

// ── Page Component ──────────────────────────────────────────

export default function GoalsPage() {
  const { activeChallenges, availableChallenges, joinChallenge, incrementProgress, leaveChallenge } = useChallenges();
  const [completedPopup, setCompletedPopup] = useState<Challenge | null>(null);

  const handleJoin = useCallback((challenge: Challenge) => {
    joinChallenge(challenge);
  }, [joinChallenge]);

  const handleIncrement = (challenge: Challenge) => {
    incrementProgress(challenge.id);
    if (challenge.progress + 1 === challenge.total) {
      setCompletedPopup(challenge);
      setTimeout(() => setCompletedPopup(null), 4000);
    }
  };

  return (
    <div className="space-y-12 w-full max-w-none mx-auto">
      <div className="border-b-4 border-[var(--ct-border-hard)] pb-4">
        <h1 className="text-3xl md:text-5xl font-bold text-[var(--ct-ink)] tracking-tighter font-display uppercase flex items-center gap-3">
          Goals & Challenges
          <Trophy className="w-8 h-8 text-[var(--ct-warning)] stroke-[3px]" />
        </h1>
        <p className="text-sm font-bold uppercase tracking-widest text-[var(--ct-ink-muted)] mt-2">Set goals, join challenges, and track your sustainability progress.</p>
      </div>

      {/* ─── Active Challenges ─────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-6 border-b-2 border-[var(--ct-border-hard)] pb-2">
          <h2 className="text-xl font-display font-bold uppercase tracking-widest text-[var(--ct-ink)]">Active Challenges</h2>
          <span className="text-[10px] font-bold uppercase tracking-widest bg-[var(--ct-accent)] text-[var(--ct-ink)] px-2 py-1 border-2 border-[var(--ct-border-hard)] shadow-[2px_2px_0px_var(--ct-border-hard)]">
            {activeChallenges.length} ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeChallenges.map((challenge) => {
            const pct = Math.round((challenge.progress / challenge.total) * 100);
            const isComplete = pct >= 100;

            return (
              <div
                key={challenge.id}
                className={`card-brutal p-5 border-2 transition-all group ${
                  isComplete
                    ? 'border-[var(--ct-border-hard)] bg-[var(--ct-accent)]/20 shadow-[6px_6px_0px_var(--ct-border-hard)]'
                    : 'bg-white hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--ct-border-hard)]'
                }`}
              >
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 bg-white border-2 border-[var(--ct-border-hard)] shadow-[2px_2px_0px_var(--ct-border-hard)] flex items-center justify-center text-2xl shrink-0">
                    {challenge.emoji}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="text-sm font-display font-bold uppercase tracking-wider text-[var(--ct-ink)] flex items-center gap-2">
                      {challenge.title}
                      {isComplete && <CheckCircle2 className="w-5 h-5 text-[var(--ct-ink)] stroke-[3px] fill-[var(--ct-accent)]" />}
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--ct-ink-muted)] mt-1 line-clamp-2">{challenge.description}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4 bg-[var(--ct-bg-surface)] p-3 border-2 border-[var(--ct-border-hard)]">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2 text-[var(--ct-ink)]">
                    <span>PROGRESS</span>
                    <span>{challenge.progress}/{challenge.total}</span>
                  </div>
                  <div className="w-full bg-white border-2 border-[var(--ct-border-hard)] h-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(pct, 100)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full border-r-2 border-[var(--ct-border-hard)] ${isComplete ? 'bg-[var(--ct-ink)]' : 'bg-[var(--ct-accent)]'}`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--ct-ink)] bg-white border-2 border-[var(--ct-border-hard)] px-3 py-1.5 shadow-[2px_2px_0px_var(--ct-border-hard)]">
                    <Clock className="w-3.5 h-3.5 stroke-[2.5px]" />
                    {isComplete ? 'COMPLETED! 🎉' : `${challenge.total - challenge.progress} REMAINING`}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => leaveChallenge(challenge.id)}
                      className="btn-brutal bg-white text-[var(--ct-ink)] px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase hover:bg-red-50 hover:text-red-600 border-2 border-[var(--ct-border-hard)] shadow-[2px_2px_0px_var(--ct-border-hard)]"
                    >
                      Leave
                    </button>
                    {!isComplete && (
                      <button 
                        onClick={() => handleIncrement(challenge)}
                        className="btn-brutal bg-[var(--ct-ink)] text-white px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase hover:bg-[var(--ct-accent)] hover:text-[var(--ct-ink)]"
                      >
                        +1 Log Progress
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Available Challenges ──────────────────────────── */}
      {availableChallenges.length > 0 && (
        <section>
          <h2 className="text-xl font-display font-bold uppercase tracking-widest text-[var(--ct-ink)] mb-6 border-b-2 border-[var(--ct-border-hard)] pb-2">Available Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {availableChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="card-brutal p-5 bg-[var(--ct-bg-surface)] flex flex-col hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--ct-border-hard)] transition-all border-dashed hover:border-solid hover:bg-white"
              >
                <div className="text-4xl mb-4 w-16 h-16 bg-white border-2 border-[var(--ct-border-hard)] shadow-[2px_2px_0px_var(--ct-border-hard)] flex items-center justify-center">{challenge.emoji}</div>
                <h3 className="text-sm font-display font-bold uppercase tracking-wider text-[var(--ct-ink)] mb-2">{challenge.title}</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--ct-ink-muted)] mb-6 flex-1">{challenge.description}</p>
                <button
                  onClick={() => handleJoin(challenge)}
                  className="btn-brutal w-full bg-[var(--ct-ink)] text-white py-3 text-xs flex items-center justify-center gap-2 hover:bg-[var(--ct-accent)] hover:text-[var(--ct-ink)]"
                >
                  <Plus className="w-4 h-4 stroke-[3px]" /> JOIN
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Completion Popup ──────────────────────────────── */}
      <AnimatePresence>
        {completedPopup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--ct-ink)]/70 backdrop-blur-sm"
          >
            <motion.div 
              role="dialog"
              aria-modal="true"
              aria-labelledby="popup-title"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  e.preventDefault();
                  const btn = e.currentTarget.querySelector('button');
                  if (btn) btn.focus();
                }
              }}
              className="card-brutal bg-[var(--ct-accent)] border-4 border-[var(--ct-ink)] p-12 flex flex-col items-center text-center max-w-md w-full shadow-[16px_16px_0px_rgba(0,0,0,1)]"
            >
              <span className="text-8xl mb-6 block animate-bounce" style={{ animationDuration: '0.8s' }}>{completedPopup.emoji}</span>
              <h2 id="popup-title" className="text-4xl font-display font-bold uppercase tracking-tighter text-[var(--ct-ink)] mb-4">Completed!</h2>
              <p className="text-sm font-bold uppercase tracking-widest text-[var(--ct-ink)] mb-8">You finished: {completedPopup.title}</p>
              <button 
                autoFocus
                onClick={() => setCompletedPopup(null)}
                className="btn-brutal bg-[var(--ct-ink)] text-white px-8 py-3 w-full"
              >
                AWESOME
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Personal Goals ────────────────────────────────── */}
      <section>
        <h2 className="text-xl font-display font-bold uppercase tracking-widest text-[var(--ct-ink)] mb-6 border-b-2 border-[var(--ct-border-hard)] pb-2">Personal Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PERSONAL_GOALS.map((goal) => {
            const pct = Math.min(Math.round((goal.current / goal.max) * 100), 100);
            const isOnTrack = pct >= 50;

            return (
              <div
                key={goal.id}
                className="card-brutal p-5 bg-white border-t-4 hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--ct-border-hard)] transition-all flex flex-col"
                style={{ borderTopColor: isOnTrack ? 'var(--ct-accent)' : 'var(--ct-warning)' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 border-2 border-[var(--ct-border-hard)] flex items-center justify-center shadow-[2px_2px_0px_var(--ct-border-hard)] ${isOnTrack ? 'bg-[var(--ct-accent)]' : 'bg-[var(--ct-warning)]'}`}>
                    <Target className="w-5 h-5 stroke-[2.5px] text-[var(--ct-ink)]" />
                  </div>
                  <h3 className="text-sm font-display font-bold uppercase tracking-wider text-[var(--ct-ink)] leading-tight">{goal.title}</h3>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--ct-ink)] bg-[var(--ct-bg-surface)] border-2 border-[var(--ct-border-hard)] p-2 mb-4">{goal.target}</p>

                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2 text-[var(--ct-ink)]">
                  <span>{goal.current} / {goal.max} {goal.unit}</span>
                  <span className={isOnTrack ? 'text-[var(--ct-ink)]' : 'text-[var(--ct-warning)]'}>{pct}%</span>
                </div>
                <div className="w-full bg-[var(--ct-bg-surface)] border-2 border-[var(--ct-border-hard)] h-4 mb-4">
                  <div
                    className={`h-full border-r-2 border-[var(--ct-border-hard)] transition-all ${isOnTrack ? 'bg-[var(--ct-accent)]' : 'bg-[var(--ct-warning)]'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex items-center gap-2 mt-auto text-[10px] font-bold uppercase tracking-widest bg-[var(--ct-bg-light)] border-2 border-[var(--ct-border-hard)] px-3 py-2 w-fit shadow-[2px_2px_0px_var(--ct-border-hard)]">
                  <Star className={`w-3.5 h-3.5 stroke-[2.5px] ${isOnTrack ? 'fill-[var(--ct-ink)] text-[var(--ct-ink)]' : 'fill-[var(--ct-warning)] text-[var(--ct-warning)]'}`} />
                  <span className={isOnTrack ? 'text-[var(--ct-ink)]' : 'text-[var(--ct-warning)]'}>
                    {isOnTrack ? 'ON TRACK!' : 'NEEDS ATTENTION'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
