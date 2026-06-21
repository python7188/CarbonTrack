// ============================================================
// useGeminiInsights — AI Insight Hook for CarbonTrack
// State machine: idle → loading → success | error
// Rate-limited to GEMINI_DEBOUNCE_MS between calls
// ============================================================

import { useState, useRef, useCallback } from 'react';
import type { InsightState, InsightPayload } from '../types';
import { getGeminiEndpoint, GEMINI_DEBOUNCE_MS, GEMINI_INSIGHT_PROMPT } from '../constants';

const INITIAL_STATE: InsightState = {
  status: 'idle',
  data: null,
  errorMessage: null,
};

/**
 * Type-guard that validates a parsed object conforms to InsightPayload.
 * Checks that tip, encouragement, and analogy are strings,
 * savingsKg is a finite number, and actions is an array.
 */
function isValidInsightPayload(obj: unknown): obj is InsightPayload {
  if (typeof obj !== 'object' || obj === null) return false;
  const o = obj as Record<string, unknown>;
  if (typeof o.tip !== 'string' || o.tip.length === 0) return false;
  if (typeof o.encouragement !== 'string' || o.encouragement.length === 0) return false;
  if (typeof o.analogy !== 'string' || o.analogy.length === 0) return false;
  if (typeof o.savingsKg !== 'number' || !Number.isFinite(o.savingsKg)) return false;
  if (!Array.isArray(o.actions)) return false;
  return true;
}

export function useGeminiInsights(): { state: InsightState; triggerAnalysis: (totalKg: number, categoryBreakdown: string) => Promise<void>; resetState: () => void } {
  const [state, setState] = useState<InsightState>(INITIAL_STATE);
  const lastCallTimeRef = useRef<number>(0);

  const triggerAnalysis = useCallback(
    async (totalKg: number, categoryBreakdown: string): Promise<void> => {
      // ── Rate limiting ───────────────────────────────────────
      const now = Date.now();
      const elapsed = now - lastCallTimeRef.current;
      if (lastCallTimeRef.current > 0 && elapsed < GEMINI_DEBOUNCE_MS) {
        setState({
          status: 'error',
          data: null,
          errorMessage: 'Please wait before requesting another insight',
        });
        return;
      }

      // ── Transition to loading ───────────────────────────────
      setState({ status: 'loading', data: null, errorMessage: null });
      lastCallTimeRef.current = Date.now();

      try {
        // Build the prompt using the template from constants
        const constructedPrompt = GEMINI_INSIGHT_PROMPT(totalKg, categoryBreakdown);

        // POST to the Gemini API directly
        const response = await fetch(getGeminiEndpoint(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: constructedPrompt }] }],
            generationConfig: {
               responseMimeType: "application/json"
            }
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Server responded with ${response.status}: ${response.statusText}`
          );
        }

        const json = await response.json();

        // Extract text from Gemini response structure
        const candidates = json?.candidates;
        if (!Array.isArray(candidates) || candidates.length === 0) {
          throw new Error('No candidates returned from AI model');
        }

        const parts = candidates[0]?.content?.parts;
        if (!Array.isArray(parts) || parts.length === 0) {
          throw new Error('No content parts in AI response');
        }

        const rawText: string = parts[0]?.text;
        if (typeof rawText !== 'string' || rawText.trim().length === 0) {
          throw new Error('Empty text returned from AI model');
        }

        // Parse the JSON text into InsightPayload
        let parsed: unknown;
        try {
          parsed = JSON.parse(rawText);
        } catch {
          throw new Error(
            'AI response was not valid JSON. Please try again.'
          );
        }

        // Validate structure
        if (!isValidInsightPayload(parsed)) {
          throw new Error(
            'AI response did not match expected format (missing tip, encouragement, analogy, or savingsKg)'
          );
        }

        // ── Success ─────────────────────────────────────────────
        setState({ status: 'success', data: parsed, errorMessage: null });
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while fetching insights';
        setState({ status: 'error', data: null, errorMessage: message });
      }
    },
    []
  );

  const resetState = useCallback((): void => {
    setState(INITIAL_STATE);
  }, []);

  return { state, triggerAnalysis, resetState } as const;
}
