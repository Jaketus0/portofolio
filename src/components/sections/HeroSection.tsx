'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import React, { useMemo } from 'react';
import api from '../../lib/api';
import {
  AboutSection,
  HeroSection as HeroType,
  Skill,
} from '../../types';
import { Skeleton } from '../ui/Skeleton';
import { FlowButton } from '../ui/flow-button';

const SOCIAL_ICONS: Record<string, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
  mail: Mail,
  whatsapp: MessageCircle,
  twitter: Sparkles,
  instagram: Sparkles,
};

const EASE = [0.16, 1, 0.3, 1] as const;

function StatCard({ value, label, delay }: { value: number; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: EASE }}
      className="border-l border-black/10 pl-5"
    >
      <p className="font-display text-2xl font-semibold tracking-tight text-zinc-900">
        {value}
        <span>+</span>
      </p>
      <p className="mt-1 text-xs text-zinc-500">{label}</p>
    </motion.div>
  );
}

export function HeroSection() {
  const { data: hero, isLoading } = useQuery({
    queryKey: ['public-hero'],
    queryFn: async () => {
      const { data } = await api.get('/hero');
      return data.data as HeroType;
    },
  });

  const { data: about } = useQuery({
    queryKey: ['public-about'],
    queryFn: async () => {
      const { data } = await api.get('/about');
      return data.data as AboutSection;
    },
  });

  const { data: groupedSkills } = useQuery({
    queryKey: ['public-skills'],
    queryFn: async () => {
      const { data } = await api.get('/skills');
      return data.data as Record<string, Skill[]>;
    },
  });

  const stats = useMemo(() => {
    const skills = groupedSkills
      ? Object.values(groupedSkills).reduce((n, list) => n + list.length, 0)
      : 0;
    return [
      { value: 3, label: 'Years experience' },
      { value: skills, label: 'Technologies' },
    ];
  }, [groupedSkills]);

  if (isLoading) {
    return (
      <section className="relative flex min-h-screen items-center px-4 pt-24">
        <div className="mx-auto grid w-full max-w-6xl gap-14 md:grid-cols-2 md:items-center">
          <div className="space-y-5">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-12 w-44" />
          </div>
          <Skeleton className="mx-auto aspect-[4/5] w-full max-w-sm" />
        </div>
      </section>
    );
  }

  if (!hero) return null;

  const image = hero.heroImage || about?.photo || null;
  const socials = hero.socialLinks?.filter((s) => s.isActive) || [];
  const wordmark = hero.name.replace(/\s+/g, '').slice(0, 4) || 'VIA';

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden px-4 pb-24 pt-32"
    >
      {/* giant outlined wordmark watermark */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="pointer-events-none absolute -right-10 top-1/2 hidden -translate-y-1/2 select-none lg:block"
      >
        <span
          className="text-[24rem] font-bold leading-none tracking-tight text-transparent"
          style={{ WebkitTextStroke: '1.5px rgba(0,0,0,0.08)' }}
        >
          {wordmark[0]}
        </span>
      </motion.div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-16 lg:grid-cols-2 lg:items-center">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            className="eyebrow"
          >
            {hero.greeting || 'Hello, I am'}
          </motion.span>

          <BlockName name={hero.name || 'VIA'} />

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
            className="mt-6 text-lg font-medium tracking-tight text-zinc-500 sm:text-xl"
          >
            {hero.jobTitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease: EASE }}
            className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-zinc-600 lg:mx-0 sm:text-lg"
          >
            {hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75, ease: EASE }}
            className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <a href={hero.ctaLink || '#projects'} className="inline-flex">
              <FlowButton text={hero.ctaText || 'View my work'} />
            </a>
          </motion.div>

          {socials.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
              className="mt-8 flex items-center justify-center gap-3 lg:justify-start"
            >
              {socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.platform.toLowerCase()] || Sparkles;
                return (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.platform}
                    className="grid h-10 w-10 place-items-center rounded-full border border-black/10 text-zinc-500 transition-all hover:-translate-y-0.5 hover:border-black/30 hover:text-zinc-900"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.95, ease: EASE }}
            className="mt-12 grid grid-cols-2 gap-6 text-center lg:text-left"
          >
            {stats.map((s, i) => (
              <StatCard key={s.label} {...s} delay={0.95 + i * 0.1} />
            ))}
          </motion.div>
        </div>

        {/* Block-letter visual */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
          className="relative mx-auto hidden w-full max-w-md lg:block"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_2px_20px_-8px_rgba(0,0,0,0.12)]">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={hero.name}
className="h-full w-full object-cover"
                 loading="eager"
              />
            ) : (
              <div className="grid h-full w-full place-items-center">
                <span
                  className="select-none font-display text-9xl font-bold tracking-[0.18em] text-zinc-900"
                  style={{ textIndent: '0.18em' }}
                >
                  {wordmark}
                </span>
              </div>
            )}


          </div>
        </motion.div>
      </div>

      {/* scroll hint */}
      <motion.a
        href="#services"
        aria-label="Scroll to services"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-zinc-400 transition-colors hover:text-zinc-900 md:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.25em]">Scroll</span>
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </motion.a>
    </section>
  );
}

export function BlockName({ name }: { name: string }) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return (
    <h1 className="mt-6 overflow-hidden font-display text-6xl font-bold leading-[0.95] tracking-tight text-zinc-900 sm:text-7xl lg:text-8xl">
      {words.map((word, wi) => (
        <span key={`${word}-${wi}`} className="mr-[0.3em] inline-block">
          {word.split('').map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: '0.4em' }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 + (wi + i) * 0.06, ease: EASE }}
              className="inline-block"
            >
              {ch}
            </motion.span>
          ))}
        </span>
      ))}
    </h1>
  );
}