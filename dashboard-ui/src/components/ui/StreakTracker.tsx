import React from 'react';
import { Flame, CheckCircle2, Circle } from 'lucide-react';
import { CircularProgress } from './CircularProgress';
import { WEEK_DAYS, WEEK_DAY_NAMES } from '../../constants';

interface StreakTrackerProps {
  currentStreak: number;
  targetStreak: number;
  completedDays: boolean[];
}

export const StreakTracker: React.FC<StreakTrackerProps> = ({
  currentStreak,
  targetStreak,
  completedDays,
}) => {
  return (
    <div className="glass-card-dark p-7 flex flex-col items-center h-full">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-6">
        <h3 className="font-semibold text-[15px] text-white tracking-wide">
          Daily Streak
        </h3>
        <Flame
          className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B] drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]"
          aria-hidden="true"
        />
      </div>

      {/* Circular progress */}
      <div className="flex-1 flex items-center justify-center my-2">
        <CircularProgress
          value={currentStreak}
          max={targetStreak}
          label="Days"
        />
      </div>

      {/* Motivational text */}
      <p className="text-[13px] font-semibold mt-6 text-[#EAF6F0]">
        Keep your streak alive!
      </p>

      {/* Day indicators */}
      <div className="flex justify-between w-full mt-5" role="group" aria-label="Weekly streak progress">
        {WEEK_DAYS.map((day, i) => {
          const completed = completedDays[i] ?? false;
          const dayName = WEEK_DAY_NAMES[i];
          const ariaLabel = `${dayName} - ${completed ? 'completed' : 'not completed'}`;

          return (
            <div
              key={`${dayName}-${i}`}
              className="flex flex-col items-center gap-1.5"
              aria-label={ariaLabel}
              role="img"
            >
              <span
                className="text-[9px] text-[#8FA99D] font-bold"
                aria-hidden="true"
              >
                {day}
              </span>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  completed
                    ? 'bg-[#2EEA8B] text-[#071612] shadow-[0_0_8px_rgba(46,234,139,0.4)]'
                    : 'bg-[#162923] text-[#8FA99D] border border-white/5'
                }`}
              >
                {completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <Circle className="w-3 h-3" aria-hidden="true" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
