'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Send, Sparkles, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import {
  askAssistant,
  type ChatMessage,
  PENDING_ID,
} from '../../lib/ai-service';
import { cn } from '../../lib/utils';
import { Markdown } from './Markdown';

const SUGGESTIONS = [
  'Tell me about this developer',
  'Show latest projects',
  'Explain tech stack',
  'Download CV',
  'Contact information',
];

const typingDots = ['0s', '0.15s', '0.3s'];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hi! I'm the portfolio assistant. Ask me about this developer, the projects, the tech stack, or how to get in touch.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: 'user', content: text },
      { id: PENDING_ID, role: 'assistant', content: '', pending: true },
    ]);
    setInput('');

    const reply = await askAssistant(text);

    setMessages((prev) => {
      const base = prev.filter((m) => m.id !== PENDING_ID);
      return [...base, { id: `a-${Date.now()}`, role: 'assistant', content: reply }];
    });
  };

  return (
    <>
      {/* Floating launcher */}
      <motion.button
        type="button"
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-zinc-900 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-4 z-50 flex h-[min(560px,calc(100dvh-7rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-black/10 bg-white sm:right-6"
            role="dialog"
            aria-label="AI assistant"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-black/10 bg-black/[0.02] px-4 py-3.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-zinc-900 text-white">
                <Sparkles className="h-4.5 w-4.5" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-zinc-900">Portfolio AI</p>
                <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-zinc-900" />
                  Online — knows this portfolio
                </p>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    'flex',
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {m.pending ? (
                    <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-black/10 bg-black/[0.03] px-4 py-3">
                      {typingDots.map((d, i) => (
                        <span
                          key={i}
                          className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-zinc-400"
                          style={{ animationDelay: d }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div
                      className={cn(
                        'max-w-[85%] rounded-2xl px-4 py-3',
                        m.role === 'user'
                          ? 'rounded-br-md bg-zinc-900 text-white'
                          : 'rounded-bl-md border border-black/10 bg-black/[0.03]'
                      )}
                    >
                      {m.role === 'assistant' ? (
                        <Markdown content={m.content} />
                      ) : (
                        <p className="text-sm text-white">{m.content}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-2 border-t border-black/10 bg-black/[0.02] px-4 py-3">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-zinc-500 transition-colors hover:border-black/30 hover:text-zinc-900"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2 border-t border-black/10 bg-black/[0.02] px-3 py-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything…"
                aria-label="Message the AI assistant"
                className="flex-1 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-black/30 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={!input.trim()}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-zinc-900 text-white transition-opacity disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}