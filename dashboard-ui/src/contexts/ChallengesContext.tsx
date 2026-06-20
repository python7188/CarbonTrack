import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Challenge } from '../types';
import { POPULAR_CHALLENGES } from '../constants';

interface ChallengesContextType {
  activeChallenges: Challenge[];
  availableChallenges: Challenge[];
  joinChallenge: (challenge: Challenge) => void;
  incrementProgress: (id: string) => void;
  leaveChallenge: (id: string) => void;
}

/* eslint-disable react-refresh/only-export-components */
const ChallengesContext = createContext<ChallengesContextType | undefined>(undefined);

export const ChallengesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  // Initialize available challenges with the 10 from constants, minus any already active (which is 0 initially)
  const [availableChallenges, setAvailableChallenges] = useState<Challenge[]>(POPULAR_CHALLENGES);

  const joinChallenge = (challenge: Challenge) => {
    setActiveChallenges((prev) => {
      // Don't add if already active
      if (prev.some(c => c.id === challenge.id)) return prev;
      return [...prev, { ...challenge, progress: 0 }]; // start progress at 0
    });
    setAvailableChallenges((prev) => prev.filter((c) => c.id !== challenge.id));
  };

  const incrementProgress = (id: string) => {
    setActiveChallenges((prev) =>
      prev.map((c) => {
        if (c.id === id && c.progress < c.total) {
          return { ...c, progress: c.progress + 1 };
        }
        return c;
      })
    );
  };

  const leaveChallenge = (id: string) => {
    setActiveChallenges((prev) => {
      const challengeToLeave = prev.find(c => c.id === id);
      if (challengeToLeave) {
        setAvailableChallenges(avail => [...avail, { ...challengeToLeave, progress: 0 }]);
      }
      return prev.filter(c => c.id !== id);
    });
  };

  return (
    <ChallengesContext.Provider value={{ activeChallenges, availableChallenges, joinChallenge, incrementProgress, leaveChallenge }}>
      {children}
    </ChallengesContext.Provider>
  );
};

export const useChallenges = () => {
  const context = useContext(ChallengesContext);
  if (!context) {
    throw new Error('useChallenges must be used within a ChallengesProvider');
  }
  return context;
};
