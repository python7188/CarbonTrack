import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getHistory, saveHistory } from '../lib/storage';
import type { Activity } from '../types';

const sample: Activity = {
  id: '1', category: 'transport', activity: 'Car (petrol)',
  amount: 10, unit: 'km', co2: 1.9, timestamp: new Date().toISOString(),
};

describe('storage', () => {
  beforeEach(() => localStorage.clear());

  it('returns [] when nothing is stored', () => {
    expect(getHistory()).toEqual([]);
  });
  it('persists and retrieves activities', () => {
    saveHistory([sample]);
    expect(getHistory()).toEqual([sample]);
  });
  it('returns [] and does not throw on corrupted data', () => {
    localStorage.setItem('ct_history', '{not valid json');
    expect(getHistory()).toEqual([]);
  });
  it('dispatches history_updated on save', () => {
    const handler = vi.fn();
    window.addEventListener('history_updated', handler);
    saveHistory([sample]);
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
