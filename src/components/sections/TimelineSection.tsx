'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap } from 'lucide-react';
import React from 'react';
import api from '../../lib/api';
import { AboutSection as AboutType, Timeline } from '../../types';
import { formatDate } from '../../lib/utils';
import { cn } from '../../lib/utils';
import { SectionHeading } from '../ui/SectionHeading';

function TimelineItem({ item }: { item: Timeline }) {
  const isExperience = item.type === 'EXPERIENCE';
  const start = formatDate(item.startDate);
  const end = item.isCurrent ? 'Present' : formatDate(item.endDate as string);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'relative flex gap-5 pl-0 sm:pl-8',
        'before:absolute before:left-3 sm:before:left-4 before:top-2 before:h-full before:w-px before:bg-white/10'
      )}
    >
      {/* Node */}
      <div className="relative z-10 mt-1.5 shrink-0">
        <span
          className={cn(
            'grid h-8 w-8 place-items-center rounded-full border',
            isExperience
              ? 'border-white/25 bg-white text-black'
              : 'border-white/12 text-muted'
          )}
        >
          {isExperience ? (
            <Briefcase className="h-3.5 w-3.5" />
          ) : (
            <GraduationCap className="h-3.5 w-3.5" />
          )}
        </span>
      </div>

      {/* Card */}
      <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-white">
            {item.title}
          </h3>
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-muted">
            {start} — {end}
          </span>
        </div>
        {item.organization && (
          <p className="mt-0.5 text-sm text-muted">{item.organization}</p>
        )}
        {item.description && (
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {item.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function TimelineSection() {
  const { data: about } = useQuery({
    queryKey: ['public-about'],
    queryFn: async () => {
      const { data } = await api.get('/about');
      return data.data as AboutType;
    },
  });

  const timelines = about?.timelines || [];
  if (timelines.length === 0) return null;

  return (
    <section id="timeline" className="px-4 py-28">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Journey"
          title="Experience & education"
          subtitle="A look at the path that shaped how I build software."
          align="center"
        />
        <div className="relative space-y-8">
          {timelines.map((t) => (
            <TimelineItem key={t.id} item={t} />
          ))}
        </div>
      </div>
    </section>
  );
}