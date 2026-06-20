// ============================================================
// useGeminiChat — AI Chat Hook for CarbonTrack
// Maintains conversation history, sends chat-format requests
// to the Gemini proxy, and handles loading / error states.
// ============================================================

import { useState, useCallback, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { getGeminiEndpoint, GEMINI_CHAT_SYSTEM_INSTRUCTION } from '../constants';

const MAX_MESSAGE_LENGTH = 500;

export function useGeminiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('ct_chat_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load chat history', e);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('ct_chat_history', JSON.stringify(messages));
  }, [messages]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (text: string): Promise<void> => {
      // ── Input validation ────────────────────────────────────
      const trimmed = text.trim();
      if (trimmed.length === 0) {
        setError('Message cannot be empty');
        return;
      }
      if (trimmed.length > MAX_MESSAGE_LENGTH) {
        setError(`Message must be ${MAX_MESSAGE_LENGTH} characters or fewer`);
        return;
      }

      // ── Clear previous error and add user message ───────────
      setError(null);
      const userMessage: ChatMessage = {
        role: 'user',
        text: trimmed,
        timestamp: Date.now(),
      };

      // We need the full history including the new user message
      // to build the contents array for the API call.
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setIsLoading(true);

      try {
        // Build the contents array from conversation history
        const contents = updatedMessages.map((m) => ({
          role: m.role,
          parts: [{ text: m.text }],
        }));

        // POST to the backend proxy in chat format
        const response = await fetch(getGeminiEndpoint(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: GEMINI_CHAT_SYSTEM_INSTRUCTION }],
            },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            },
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

        // Concatenate all parts (Gemini may split across multiple parts)
        const responseText = parts
          .map((p: { text?: string }) => p.text ?? '')
          .join('')
          .trim();

        if (responseText.length === 0) {
          throw new Error('Empty response from AI model');
        }

        // ── Append model message ────────────────────────────────
        const modelMessage: ChatMessage = {
          role: 'model',
          text: responseText,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, modelMessage]);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while sending message';
        setError(message);
        // Keep the conversation history intact so the user can retry
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  const clearHistory = useCallback((): void => {
    setMessages([]);
    localStorage.removeItem('ct_chat_history');
    setError(null);
    setIsLoading(false);
  }, []);

  return { messages, sendMessage, isLoading, error, clearHistory } as const;
}
