'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pin, Send } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../lib/api';
import { GuestMessage } from '../../types';
import { formatDate } from '../../lib/utils';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

interface FormValues {
  name: string;
  message: string;
}

const COOLDOWN_SECONDS = 10;

export function GuestbookSection() {
  const queryClient = useQueryClient();
  const [submitted, setSubmitted] = useState(false);
  const [page, setPage] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const PER_PAGE = 4;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { name: '', message: '' },
  });

  const { data: messages, isLoading } = useQuery({
    queryKey: ['public-messages'],
    queryFn: async () => {
      const { data } = await api.get('/messages/public');
      return data.data as GuestMessage[];
    },
  });

  const submit = useMutation({
    mutationFn: (payload: FormValues) => api.post('/messages', payload),
    onSuccess: () => {
      reset();
      setSubmitted(true);
      setCooldown(COOLDOWN_SECONDS);
      queryClient.invalidateQueries({ queryKey: ['public-messages'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to submit message');
    },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    timerRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cooldown > 0]);

  const onSubmit = (values: FormValues) => {
    if (cooldown > 0) return;
    submit.mutate(values);
  };

  const notes = useMemo(() => messages || [], [messages]);
  const totalPages = Math.max(1, Math.ceil(notes.length / PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);

  return (
    <section id="guestbook" className="px-4 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Guestbook"
          title="Leave your mark"
          subtitle="A digital wall of kind words from people I've worked with."
          align="center"
        />

        <div className="grid gap-10 lg:grid-cols-5">
          {/* Form */}
          <Reveal className="lg:col-span-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8"
              noValidate
            >
              <div>
                <label
                  htmlFor="mark-name"
                  className="mb-2 block text-sm font-medium text-zinc-900"
                >
                  Your name / handle
                </label>
                <input
                  id="mark-name"
                  type="text"
                  maxLength={50}
                  placeholder="Ada Lovelace"
                  aria-invalid={!!errors.name}
                  className="w-full rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-black/40 focus:outline-none"
                  {...register('name', {
                    required: 'Name is required',
                    maxLength: {
                      value: 50,
                      message: 'Keep it under 50 characters',
                    },
                  })}
                />
                {errors.name && (
                  <p role="alert" className="mt-1.5 text-xs text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="mt-5">
                <label
                  htmlFor="mark-message"
                  className="mb-2 block text-sm font-medium text-zinc-900"
                >
                  Message
                </label>
                <textarea
                  id="mark-message"
                  rows={4}
                  maxLength={84}
                  placeholder="Drop a note, a memory, or some appreciation…"
                  aria-invalid={!!errors.message}
                  className="w-full resize-none rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-black/40 focus:outline-none"
                  {...register('message', {
                    required: 'Message is required',
                    maxLength: {
                      value: 84,
                      message: 'Keep it under 84 characters',
                    },
                  })}
                />
                {errors.message && (
                  <p role="alert" className="mt-1.5 text-xs text-red-600">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <div
                role="status"
                className={`mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 transition-all ${
                  submitted ? 'opacity-100' : 'pointer-events-none h-0 overflow-hidden border-0 py-0 opacity-0'
                }`}
              >
                Thanks! Your message has been added to the wall.
              </div>

              <button
                type="submit"
                disabled={isSubmitting || cooldown > 0}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-900 py-3 text-sm font-medium text-white transition-colors hover:bg-black disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : cooldown > 0 ? (
                  <span>Try again in {cooldown}s</span>
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {cooldown === 0 && 'Leave your mark'}
              </button>
            </form>
          </Reveal>

          {/* Wall */}
          <Reveal delay={0.1} className="lg:col-span-3">
            {isLoading ? (
              <div className="grid h-full min-h-[34rem] place-items-center rounded-3xl border border-black/10 bg-white">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/10 border-t-zinc-900" />
              </div>
            ) : notes.length === 0 ? (
              <div className="grid h-full min-h-[34rem] place-items-center rounded-3xl border border-black/10 bg-white p-12 text-center">
                <p className="text-sm text-zinc-500">
                  No messages yet — be the first to leave your mark.
                </p>
              </div>
            ) : (
              <div className="flex h-full min-h-[34rem] flex-col rounded-3xl border border-black/10 bg-white p-5 sm:p-6">
                <div className="grid flex-1 auto-rows-fr gap-4 sm:grid-cols-2">
                  {notes.slice(safePage * PER_PAGE, (safePage + 1) * PER_PAGE).map((note, i) => (
                    <motion.figure
                      key={note.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{
                        duration: 0.55,
                        delay: i * 0.06,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="relative flex h-full flex-col rounded-2xl border border-black/10 bg-white p-5 transition-colors duration-300 hover:border-black/25"
                    >
                      {note.pinned && (
                        <span
                          aria-label="Pinned message"
                          className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-zinc-900 text-white"
                        >
                          <Pin className="h-4 w-4" />
                        </span>
                      )}
                      <blockquote className="line-clamp-4 flex-1 break-words text-sm leading-relaxed text-zinc-700">
                        {note.message}
                      </blockquote>
                      <figcaption className="mt-4 flex items-center justify-between border-t border-black/10 pt-3">
                        <span className="text-sm font-medium text-zinc-900">
                          {note.name}
                        </span>
                        <time className="text-xs text-zinc-500">
                          {formatDate(note.createdAt, 'MMM yyyy')}
                        </time>
                      </figcaption>
                    </motion.figure>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-auto flex items-center justify-between border-t border-black/10 pt-4">
                    <span className="text-xs text-zinc-400">
                      Page {safePage + 1} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        aria-label="Previous messages"
                        disabled={safePage === 0}
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        className="grid h-8 w-8 place-items-center rounded-full border border-black/10 text-zinc-600 transition-colors hover:border-black/30 hover:text-zinc-900 disabled:opacity-30 disabled:hover:border-black/10"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Next messages"
                        disabled={safePage >= totalPages - 1}
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        className="grid h-8 w-8 place-items-center rounded-full border border-black/10 text-zinc-600 transition-colors hover:border-black/30 hover:text-zinc-900 disabled:opacity-30 disabled:hover:border-black/10"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}