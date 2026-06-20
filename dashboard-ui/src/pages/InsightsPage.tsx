// ============================================================
// InsightsPage — AI-powered sustainability insights
// Refactored to Industrial Utilitarian aesthetic
// ============================================================

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Zap, Send, Bot, User, Lightbulb, Car, UtensilsCrossed, ShoppingBag, AlertTriangle } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import { useGeminiChat } from '../hooks/useGeminiChat';

// ── Suggested prompts ───────────────────────────────────────

const SUGGESTED_PROMPTS = [
  { text: 'How can I reduce my transport emissions?', icon: Car },
  { text: 'What are easy plant-based swaps?', icon: UtensilsCrossed },
  { text: 'Tips for reducing energy at home', icon: Lightbulb },
  { text: 'How does online shopping impact CO₂?', icon: ShoppingBag },
];

// ── Render Helpers ──────────────────────────────────────────

function renderBoldText(line: string, keyPrefix: string) {
  return line.split(/(\*\*.*?\*\*)/g).filter(Boolean).map((part, idx) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={`${keyPrefix}-${idx}`} className="font-bold uppercase tracking-wide">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <React.Fragment key={`${keyPrefix}-${idx}`}>{part}</React.Fragment>
    )
  );
}

// ── Page Component ──────────────────────────────────────────

export default function InsightsPage() {
  const { messages, sendMessage, isLoading, error } = useGeminiChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = useCallback(
    (text?: string) => {
      const msg = (text ?? input).trim();
      if (!msg || isLoading) return;
      sendMessage(msg);
      setInput('');
    },
    [input, isLoading, sendMessage]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-h-[calc(100vh-6rem)] max-w-[2560px] mx-auto">
      <div className="border-b-4 border-[var(--ct-border-hard)] pb-4 mb-6">
        <h1 className="text-3xl md:text-5xl font-bold text-[var(--ct-ink)] tracking-tighter font-display uppercase flex items-center gap-3">
          AI Insights
          <Zap className="w-8 h-8 text-[var(--ct-accent)] stroke-[3px]" />
        </h1>
        <p className="text-sm font-bold uppercase tracking-widest text-[var(--ct-ink-muted)] mt-2">Chat with your AI sustainability advisor for personalized tips.</p>
      </div>

      {/* ─── Chat Container ────────────────────────────────── */}
      <div className="flex-1 card-brutal bg-white flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.length === 0 && (
            <div className="flex gap-4 justify-start">
              <div className="w-12 h-12 border-2 border-[var(--ct-border-hard)] bg-[var(--ct-bg-surface)] shadow-[2px_2px_0px_var(--ct-border-hard)] flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6 text-[var(--ct-ink)] stroke-[2px]" />
              </div>
              <div className="max-w-[85%] sm:max-w-[75%] px-5 py-4 text-sm leading-relaxed border-2 border-[var(--ct-border-hard)] shadow-[4px_4px_0px_var(--ct-border-hard)] bg-white text-[var(--ct-ink)]">
                Hello! 🌿 I'm your CarbonTrack AI assistant. I can help you understand your carbon footprint and suggest personalized ways to reduce it. What would you like to know?
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <div
                key={msg.timestamp + i}
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-12 h-12 border-2 border-[var(--ct-border-hard)] bg-[var(--ct-bg-surface)] shadow-[2px_2px_0px_var(--ct-border-hard)] flex items-center justify-center shrink-0">
                    <Bot className="w-6 h-6 text-[var(--ct-ink)] stroke-[2px]" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] break-words px-5 py-4 text-sm leading-relaxed border-2 border-[var(--ct-border-hard)] shadow-[4px_4px_0px_var(--ct-border-hard)] ${
                    msg.role === 'user'
                      ? 'bg-[var(--ct-accent)] text-[var(--ct-ink)] font-bold'
                      : 'bg-white text-[var(--ct-ink)]'
                  }`}
                >
                  {msg.text.split('\n').map((line, li, arr) => (
                    <React.Fragment key={li}>
                      {renderBoldText(line, `${msg.timestamp}-${li}`)}
                      {li < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
                {msg.role === 'user' && (
                  <div className="w-12 h-12 border-2 border-[var(--ct-border-hard)] bg-[var(--ct-ink-muted)] text-white shadow-[2px_2px_0px_var(--ct-border-hard)] flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 stroke-[2px]" />
                  </div>
                )}
              </div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 border-2 border-[var(--ct-border-hard)] bg-[var(--ct-bg-surface)] shadow-[2px_2px_0px_var(--ct-border-hard)] flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6 text-[var(--ct-ink)] stroke-[2px]" />
              </div>
              <div className="bg-white border-2 border-[var(--ct-border-hard)] shadow-[4px_4px_0px_var(--ct-border-hard)] px-5 py-4">
                <div className="flex gap-2">
                  <span className="w-3 h-3 bg-[var(--ct-ink)] border border-[var(--ct-border-hard)] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-3 h-3 bg-[var(--ct-ink)] border border-[var(--ct-border-hard)] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-3 h-3 bg-[var(--ct-ink)] border border-[var(--ct-border-hard)] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts (show when few messages) */}
        {messages.length <= 2 && (
          <div className="px-6 pb-4 border-t-2 border-[var(--ct-border-hard)] bg-[var(--ct-bg-light)] pt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--ct-ink-muted)] mb-3">Suggested questions:</p>
            <div className="flex flex-wrap gap-3">
              {SUGGESTED_PROMPTS.map((prompt) => {
                const PromptIcon = prompt.icon;
                return (
                  <button
                    key={prompt.text}
                    onClick={() => handleSend(prompt.text)}
                    className="bg-white hover:bg-[var(--ct-accent)] border-2 border-[var(--ct-border-hard)] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--ct-ink)] transition-colors flex items-center gap-2 shadow-[2px_2px_0px_var(--ct-border-hard)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_var(--ct-border-hard)]"
                  >
                    <PromptIcon className="w-4 h-4 stroke-[2.5px]" />
                    {prompt.text}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="px-6 pb-4">
            <div className="flex items-center gap-2 bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 shadow-[2px_2px_0px_#ef4444]">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="border-t-4 border-[var(--ct-border-hard)] p-6 bg-[var(--ct-bg-surface)]">
          <div className="flex gap-4 items-end">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="ASK ABOUT YOUR CARBON FOOTPRINT..."
                rows={1}
                className="w-full bg-white border-2 border-[var(--ct-border-hard)] shadow-[4px_4px_0px_var(--ct-border-hard)] px-5 py-4 pr-12 text-sm font-bold uppercase tracking-wider text-[var(--ct-ink)] resize-none focus:outline-none focus:ring-0 focus:-translate-y-1 focus:shadow-[6px_6px_0px_var(--ct-border-hard)] transition-all placeholder:text-[var(--ct-ink-faint)]"
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="w-14 h-14 bg-[var(--ct-ink)] text-white border-2 border-[var(--ct-border-hard)] flex items-center justify-center shadow-[4px_4px_0px_var(--ct-border-hard)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--ct-border-hard)] transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              aria-label="Send message"
            >
              <Send className="w-6 h-6 stroke-[2px] -ml-1" />
            </button>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--ct-ink-muted)] mt-4 text-center">
            AI RESPONSES ARE FOR GUIDANCE ONLY. EMISSION ESTIMATES ARE APPROXIMATE.
          </p>
        </div>
      </div>
    </div>
  );
}
