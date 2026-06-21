import type { Activity } from '../types';
import { logger } from './logger';

export function getHistory(): Activity[] {
  try {
    const data = localStorage.getItem('ct_history');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    logger.error('Failed to parse ct_history:', error);
    return [];
  }
}

export function saveHistory(activities: Activity[]): void {
  try {
    localStorage.setItem('ct_history', JSON.stringify(activities));
    // Dispatch a custom event so other tabs/components can optionally sync
    window.dispatchEvent(new Event('history_updated'));
  } catch (error) {
    logger.error('Failed to save ct_history. Storage might be full:', error);
  }
}
