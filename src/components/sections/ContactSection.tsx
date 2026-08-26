'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  CheckCircle2,
  Github,
  Linkedin,
  Loader2,
  Mail,
  MessageCircle,
  RefreshCw,
} from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import api from '../../lib/api';
import { ContactInfo } from '../../types';
import { cn } from '../../lib/utils';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

const contactSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be at most 100 characters'),
  phone: z
    .string()
    .regex(/^[+0-9\s\-()]{6,30}$/, 'Enter a valid phone number'),
  email: z.string().email('Enter a valid email address').max(150),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(3000, 'Message must be at most 3000 characters'),
  captchaAnswer: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface CaptchaChallenge {
  token: string;
  question: string;
}

const CHANNELS = [
  { key: 'email', label: 'Email', hint: 'For formal enquiries', icon: Mail, build: (c: ContactInfo) => (c.email ? `mailto:${c.email}` : null) },
  { key: 'whatsapp', label: 'WhatsApp', hint: 'Fastest response', icon: MessageCircle, build: (c: ContactInfo) => (c.whatsapp ? `https://wa.me/${c.whatsapp.replace(/\D/g, '')}` : null) },
  { key: 'linkedin', label: 'LinkedIn', hint: 'Connect professionally', icon: Linkedin, build: (c: ContactInfo) => c.linkedin || null },
  { key: 'github', label: 'GitHub', hint: 'Browse my code', icon: Github, build: (c: ContactInfo) => c.github || null },
] as const;

const inputClass =
  'w-full rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-black/40 focus:outline-none';

export function ContactSection() {
  const { data: contact } = useQuery({
    queryKey: ['public-contact'],
    queryFn: async () => {
      const { data } = await api.get('/contact');
      return data.data as ContactInfo;
    },
  });

  const [captcha, setCaptcha] = useState<CaptchaChallenge | null>(null);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { fullName: '', phone: '', email: '', message: '', captchaAnswer: '' },
  });

  const loadCaptcha = async () => {
    setCaptchaLoading(true);
    try {
      const { data } = await api.get('/contact-submissions/captcha');
      setCaptcha(data.data);
      setSubmitError('');
    } catch {
      setSubmitError('Could not load the captcha. Please refresh.');
    } finally {
      setCaptchaLoading(false);
    }
  };

  const onSubmit = async (values: ContactFormValues) => {
    if (!showCaptcha) {
      const valid = await trigger(['fullName', 'phone', 'email', 'message']);
      if (!valid) return;
      setShowCaptcha(true);
      loadCaptcha();
      return;
    }

    if (!captcha) return;
    setSubmitError('');
    try {
      await api.post('/contact-submissions', {
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        message: values.message,
        captchaToken: captcha.token,
        captchaAnswer: values.captchaAnswer,
      });
      setSent(true);
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Something went wrong. Please try again.';
      setSubmitError(message);
      if (message.toLowerCase().includes('captcha')) {
        reset({ ...values, captchaAnswer: '' });
        loadCaptcha();
      }
    }
  };

  const links = contact
    ? (CHANNELS as typeof CHANNELS)
        .map((c) => ({ ...c, url: c.build(contact) }))
        .filter((c): c is (typeof CHANNELS)[number] & { url: string } => !!c.url)
    : [];

  return (
    <section id="contact" className="px-4 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Contact"
          title="Let's talk"
          subtitle="Have a project, a role, or just want to say hi? Fill in the form and I'll get back to you."
          align="center"
        />

        <div className="grid gap-10 lg:grid-cols-5 lg:items-start">
          {/* Info */}
          <Reveal className="lg:col-span-2">
            <div className="space-y-8">


              <div className="space-y-3">
                {links.map((link) => (
                  <a
                    key={link.key}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between rounded-2xl border border-black/10 bg-white p-4 transition-colors hover:border-black/25"
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className="h-5 w-5 text-zinc-900" />
                      <div>
                        <p className="text-sm font-medium text-zinc-900">{link.label}</p>
                        <p className="text-xs text-zinc-500">{link.hint}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-zinc-900" />
                  </a>
                ))}
              </div>

              {/* <p className="max-w-sm text-sm leading-relaxed text-zinc-500">
                Prefer email? Reach me directly at{' '}
                <a
                  className="font-medium text-zinc-900 underline underline-offset-4"
                  href={`mailto:${contact?.email || ''}`}
                >
                  {contact?.email || 'hello@via.dev'}
                </a>
                .
              </p> */}
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1} className="lg:col-span-3">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex min-h-[28rem] flex-col items-center justify-center rounded-3xl border border-black/10 bg-white p-10 text-center"
              >
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-zinc-900">
                  Message sent
                </h3>
                <p className="mt-2 max-w-sm text-sm text-zinc-500">
                  Thanks for reaching out — I'll get back to you as soon as I
                  can.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setShowCaptcha(false);
                    setCaptcha(null);
                    reset();
                  }}
                  className="btn-minimal-outline mt-8"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8"
                noValidate
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="cf-name" className="mb-2 block text-sm font-medium text-zinc-900">
                      Full name
                    </label>
                    <input
                      id="cf-name"
                      type="text"
                      placeholder="Alicia Keys"
                      aria-invalid={!!errors.fullName}
                      className={cn(inputClass, errors.fullName && 'border-red-400')}
                      {...register('fullName')}
                    />
                    {errors.fullName && (
                      <p role="alert" className="mt-1.5 text-xs text-red-600">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="cf-phone" className="mb-2 block text-sm font-medium text-zinc-900">
                      Phone number
                    </label>
                    <input
                      id="cf-phone"
                      type="tel"
                      placeholder="+628123456789"
                      aria-invalid={!!errors.phone}
                      className={cn(inputClass, errors.phone && 'border-red-400')}
                      {...register('phone')}
                    />
                    {errors.phone && (
                      <p role="alert" className="mt-1.5 text-xs text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="cf-email" className="mb-2 block text-sm font-medium text-zinc-900">
                    Email
                  </label>
                  <input
                    id="cf-email"
                    type="email"
                    placeholder="jane@example.com"
                    aria-invalid={!!errors.email}
                    className={cn(inputClass, errors.email && 'border-red-400')}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p role="alert" className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="mt-5">
                  <label htmlFor="cf-message" className="mb-2 block text-sm font-medium text-zinc-900">
                    Message
                  </label>
                  <textarea
                    id="cf-message"
                    rows={5}
                    placeholder="Tell me about your project or idea…"
                    aria-invalid={!!errors.message}
                    className={cn(
                      'w-full resize-none rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-black/40 focus:outline-none',
                      errors.message && 'border-red-400'
                    )}
                    {...register('message')}
                  />
                  {errors.message && (
                    <p role="alert" className="mt-1.5 text-xs text-red-600">{errors.message.message}</p>
                  )}
                </div>

                {/* Captcha */}
                {showCaptcha && (
                  <>
                    <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-black/10 bg-black/[0.02] p-4 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-3">
                        <span className="rounded-xl border border-black/10 bg-white px-4 py-2.5 font-mono text-lg font-semibold text-zinc-900">
                          {captchaLoading ? '…' : captcha?.question || '…'}
                        </span>
                        <button
                          type="button"
                          onClick={loadCaptcha}
                          aria-label="New captcha"
                          disabled={captchaLoading}
                          className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 bg-white text-zinc-500 transition-colors hover:border-black/30 hover:text-zinc-900 disabled:opacity-50"
                        >
                          <RefreshCw className={cn('h-4 w-4', captchaLoading && 'animate-spin')} />
                        </button>
                      </div>
                      <input
                        id="cf-captcha"
                        type="text"
                        inputMode="numeric"
                        placeholder="Answer"
                        aria-invalid={!!errors.captchaAnswer}
                        className={cn(inputClass, 'flex-1', errors.captchaAnswer && 'border-red-400')}
                        {...register('captchaAnswer')}
                      />
                    </div>
                    {errors.captchaAnswer ? (
                      <p role="alert" className="mt-1.5 text-xs text-red-600">
                        {errors.captchaAnswer.message}
                      </p>
                    ) : (
                      <p className="mt-1.5 text-xs text-zinc-400">
                        Solve the challenge so we can keep spam out of the inbox.
                      </p>
                    )}
                  </>
                )}

                {submitError && (
                  <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {submitError}
                  </p>
                )}

                <div className="mt-7 flex items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || (showCaptcha && !captcha)}
                    className="btn-minimal disabled:opacity-60"
                  >
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {showCaptcha ? 'Submit' : 'Send message'}
                  </button>
                  {showCaptcha && (
                    <span className="text-xs text-zinc-400">
                      Protected by a simple math captcha
                    </span>
                  )}
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}