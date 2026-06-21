import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGeminiChat } from '../../hooks/useGeminiChat';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { ChallengesProvider, useChallenges } from '../../contexts/ChallengesContext';

vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      candidates: [{ content: { parts: [{ text: 'Mock response' }] } }]
    })
  })
));

describe('useGeminiChat hook', () => {
  it('manages chat state and sends messages', async () => {
    const { result } = renderHook(() => useGeminiChat());
    
    expect(result.current.messages).toBeDefined();
    
    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    expect(result.current.messages.length).toBeGreaterThan(0);
    expect(result.current.messages[result.current.messages.length - 1].text).toBe('Mock response');
  });

  it('clears history', () => {
    const { result } = renderHook(() => useGeminiChat());
    act(() => {
      result.current.clearHistory();
    });
    expect(result.current.messages.length).toBe(0);
  });
});

describe('ChallengesProvider', () => {
  it('provides challenges context', () => {
    const { result } = renderHook(() => useChallenges(), { wrapper: ChallengesProvider });
    expect(result.current.activeChallenges).toBeDefined();
    expect(result.current.availableChallenges).toBeDefined();
  });
});

describe('AuthProvider', () => {
  it('provides auth context', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    expect(result.current.loading).toBeDefined();
  });
});
