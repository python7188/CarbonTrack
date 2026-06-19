// ============================================================
// AiChatPanel — AI Chat Interface for CarbonTrack
// Full-page / slide-in chat panel with:
//   - Message history (role="log", aria-live="polite")
//   - Input validation (≤500 chars, character count)
//   - Basic XSS prevention
//   - Welcome state with suggested questions
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Loader2,
  MessageSquare,
  X,
  AlertTriangle,
  Bot,
  User,
  Sparkles,
} from 'lucide-react';
import { useGeminiChat } from '../../../hooks/useGeminiChat';
import type { ChatMessage } from '../../../types';

// ── Props ──────────────────────────────────────────────────

interface AiChatPanelProps {
  onClose?: () => void;
}

// ── Helpers ────────────────────────────────────────────────

const MAX_CHARS = 500;

/**
 * Basic XSS prevention: encode dangerous HTML characters.
 */
function encodeForDisplay(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Suggested questions for the empty-state welcome screen.
 */
const SUGGESTED_QUESTIONS: string[] = [
  'How can I reduce my transport emissions?',
  'What is the carbon impact of eating meat?',
  'Tips for saving energy at home in India',
  'How does my footprint compare to the average?',
];

// ── Component ──────────────────────────────────────────────

export function AiChatPanel({ onClose }: AiChatPanelProps) {
  const { messages, sendMessage, isLoading, error, clearHistory } =
    useGeminiChat();
  const [inputValue, setInputValue] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (trimmed.length === 0 || isLoading) return;
    sendMessage(trimmed);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  const charsRemaining = MAX_CHARS - inputValue.length;
  const isOverLimit = charsRemaining < 0;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#0A0F1A]/95 backdrop-blur-xl">
      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-[#2EEA8B]" />
          <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              aria-label="Clear chat history"
              className="rounded-lg px-3 py-1.5 text-xs text-gray-400 transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              Clear
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close chat panel"
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Message List ─────────────────────────────────── */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
        className="flex-1 overflow-y-auto px-4 py-4"
      >
        {/* Empty / Welcome State */}
        {messages.length === 0 && !isLoading && (
          <div className="flex h-full flex-col items-center justify-center gap-6 py-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2EEA8B]/10">
              <Sparkles className="h-7 w-7 text-[#2EEA8B]" />
            </div>
            <div className="text-center">
              <p className="text-base font-medium text-white">
                Hi! I&apos;m your sustainability assistant.
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Ask me anything about reducing your carbon footprint.
              </p>
            </div>
            <div className="grid w-full max-w-sm gap-2">
              {SUGGESTED_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => handleSuggestedQuestion(question)}
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:border-[#2EEA8B]/30 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#2EEA8B]/30"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {messages.map((msg: ChatMessage, idx: number) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={`msg-${msg.timestamp}-${idx}`}
              className={`mb-3 flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-[80%] items-start gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    isUser
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-[#2EEA8B]/20 text-[#2EEA8B]'
                  }`}
                >
                  {isUser ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                    isUser
                      ? 'rounded-br-md bg-blue-600/30 text-blue-100'
                      : 'rounded-bl-md bg-white/5 text-gray-200'
                  }`}
                >
                  {encodeForDisplay(msg.text)}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading indicator in chat */}
        {isLoading && (
          <div className="mb-3 flex justify-start">
            <div className="flex items-start gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2EEA8B]/20 text-[#2EEA8B]">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-white/5 px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-[#2EEA8B]" />
                <span className="text-sm text-gray-400">Thinking…</span>
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Error Banner ─────────────────────────────────── */}
      {error && (
        <div
          role="alert"
          className="mx-4 mb-2 flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2"
        >
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
          <p className="text-xs text-red-300">{error}</p>
        </div>
      )}

      {/* ── Input Area ───────────────────────────────────── */}
      <div className="border-t border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your carbon footprint…"
            maxLength={MAX_CHARS}
            aria-label="Type your message"
            disabled={isLoading}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#2EEA8B]/50 focus:ring-1 focus:ring-[#2EEA8B]/30 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={isLoading || isOverLimit || inputValue.trim().length === 0}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2EEA8B]/20 text-[#2EEA8B] transition-colors hover:bg-[#2EEA8B]/30 focus:outline-none focus:ring-2 focus:ring-[#2EEA8B]/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        {/* Character count */}
        <div className="mt-1.5 flex justify-end">
          <span
            className={`text-xs ${
              isOverLimit
                ? 'text-red-400'
                : charsRemaining <= 50
                  ? 'text-yellow-400'
                  : 'text-gray-500'
            }`}
          >
            {inputValue.length}/{MAX_CHARS}
          </span>
        </div>
      </div>
    </div>
  );
}
