import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useGeminiInsights } from '../../src/hooks/useGeminiInsights';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useGeminiInsights hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('manages idle to loading to success states', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: JSON.stringify({
          tip: "Use public transport.",
          encouragement: "Great job!",
          analogy: "Like planting a tree.",
          savingsKg: 5,
          actions: []
        }) }] } }]
      })
    });

    const { result } = renderHook(() => useGeminiInsights());
    
    // Initial state
    expect(result.current.state.status).toBe('idle');
    expect(result.current.state.errorMessage).toBe(null);
    expect(result.current.state.data).toBe(null);

    // Act
    act(() => {
      result.current.triggerAnalysis(100, "Transport: 100kg");
    });

    // Loading state
    expect(result.current.state.status).toBe('loading');

    // Success state
    await waitFor(() => {
      expect(result.current.state.status).toBe('success');
    });

    expect(result.current.state.errorMessage).toBe(null);
    expect(result.current.state.data?.tip).toBe('Use public transport.');
  });

  it('manages error states', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useGeminiInsights());
    
    act(() => {
      result.current.triggerAnalysis(100, "Transport: 100kg");
    });

    await waitFor(() => {
      expect(result.current.state.status).toBe('error');
    });

    expect(result.current.state.errorMessage).toBe('Network error');
    expect(result.current.state.data).toBe(null);
  });
});
