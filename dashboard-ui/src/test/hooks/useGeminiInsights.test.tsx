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
        candidates: [{ content: { parts: [{ text: 'Great progress on reducing emissions!' }] } }]
      })
    });

    const { result } = renderHook(() => useGeminiInsights());
    
    // Initial state
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.insights).toBe(null);

    // Act
    act(() => {
      result.current.generateInsights([]);
    });

    // Loading state
    expect(result.current.loading).toBe(true);

    // Success state
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.insights).toBe('Great progress on reducing emissions!');
  });

  it('manages error states', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useGeminiInsights());
    
    act(() => {
      result.current.generateInsights([]);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.insights).toBe(null);
  });
});
