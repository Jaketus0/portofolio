'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Braces,
  Cloud,
  Code2,
  Database,
  Layers,
  Server,
  Shield,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import React, { useMemo } from 'react';
import api from '../../lib/api';
import { Skill } from '../../types';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

interface CategoryMeta {
  label: string;
  icon: LucideIcon;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  PROGRAMMING_LANGUAGE: { label: 'Languages', icon: Braces },
  FRAMEWORK: { label: 'Frameworks', icon: Layers },
  LIBRARY: { label: 'Libraries', icon: Box },
  DATABASE: { label: 'Databases', icon: Database },
  DEVOPS: { label: 'DevOps', icon: Server },
  CLOUD: { label: 'Cloud', icon: Cloud },
  CYBERSECURITY: { label: 'Cybersecurity', icon: Shield },
  TOOLS: { label: 'Tools', icon: Code2 },
};

interface SkillCat extends CategoryMeta {
  key: string;
  list: Skill[];
}

const ORDER = [
  'PROGRAMMING_LANGUAGE',
  'FRAMEWORK',
  'LIBRARY',
  'DATABASE',
  'DEVOPS',
  'CLOUD',
  'CYBERSECURITY',
  'TOOLS',
  'OTHERS',
];

export function SkillsSection() {
  const { data: grouped } = useQuery({
    queryKey: ['public-skills'],
    queryFn: async () => {
      const { data } = await api.get('/skills');
      return data.data as Record<string, Skill[]>;
    },
  });

  const categories = useMemo<SkillCat[]>(() => {
    if (!grouped) return [];
    return Object.entries(grouped)
      .map(([key, list]) => {
        const meta = CATEGORY_META[key] || { label: key, icon: Sparkles };
        return { key, list, label: meta.label, icon: meta.icon };
      })
      .sort((a, b) => {
        const ia = ORDER.indexOf(a.key);
        const ib = ORDER.indexOf(b.key);
        return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
      });
  }, [grouped]);

  if (!grouped || categories.length === 0) return null;

  return (
    <section id="skills" className="px-4 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Tech stack"
          title="Tools I work with"
          subtitle="The languages, frameworks, platforms, and tools I use to build reliable software."
          align="center"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Reveal key={cat.key} delay={(i % 3) * 0.08} variant={i % 3 === 0 ? 'left' : i % 3 === 2 ? 'right' : 'zoom'}>
                <div className="group flex h-full flex-col rounded-3xl border border-black/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-black/25 hover:shadow-[0_16px_40px_-20px_rgba(0,0,0,0.18)]">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 bg-black/[0.02] text-zinc-900">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <div className="flex-1">
                      <h3 className="font-display text-base font-semibold tracking-tight text-zinc-900">
                        {cat.label}
                      </h3>
                      <p className="text-xs text-zinc-500">
                        {cat.list.length}{' '}
                        {cat.list.length === 1 ? 'skill' : 'skills'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {cat.list.map((s) => (
                      <span
                        key={s.id}
                        title={s.name}
                        className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.02] px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:border-black/30"
                      >
                        {s.icon ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={s.icon}
                            alt=""
                            className="h-4 w-4 object-contain"
                            loading="lazy"
                          />
                        ) : null}
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}