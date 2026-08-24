'use client';

import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  Braces,
  Bug,
  CloudCog,
  Code2,
  Cpu,
  Database,
  Figma,
  Globe,
  Layers,
  MousePointer2,
  Palette,
  PencilRuler,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  Smartphone,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../lib/api';
import { Service } from '../../types';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

const ICON_MAP: Record<string, LucideIcon> = {
  Code2,
  Globe,
  Smartphone,
  Palette,
  Brain: Cpu,
  Server,
  Database,
  Cloud: CloudCog,
  Shield: ShieldCheck,
  Wrench,
  Rocket,
  Zap,
  Layers,
  Cpu,
  Search,
  ChartBar: BarChart3,
  Workflow: Braces,
  Bug,
  Figma,
  MousePointer: MousePointer2,
  PencilRuler,
};

function resolveIcon(key: string): LucideIcon {
  return ICON_MAP[key] || (ICON_MAP[key.split('_').join('')] ?? Code2);
}

export function ServicesSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { data: services, isLoading } = useQuery({
    queryKey: ['public-services'],
    queryFn: async () => {
      const { data } = await api.get('/services');
      return data.data as Service[];
    },
  });

  const scroll = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  if (isLoading) return null;

  if (!services || services.length === 0) return null;

  const isCarousel = services.length > 6;

  return (
    <section id="services" className="px-4 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="relative">
          <SectionHeading
            eyebrow="Services"
            title="What I do"
            subtitle="Focused, reliable services built around your goals — from early ideas to shipped products."
            align="center"
          />

          {isCarousel && (
            <div className="absolute -top-2 right-0 hidden gap-2 sm:flex">
              <button
                type="button"
                aria-label="Scroll services left"
                onClick={() => scroll(-1)}
                className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white text-zinc-600 transition-all hover:border-black/30 hover:text-zinc-900"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Scroll services right"
                onClick={() => scroll(1)}
                className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white text-zinc-600 transition-all hover:border-black/30 hover:text-zinc-900"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div
          ref={isCarousel ? scrollerRef : undefined}
          className={
            isCarousel
              ? '-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
              : 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3'
          }
        >
          {services.map((service, i) => {
            const Icon = resolveIcon(service.icon);
            return (
              <Reveal
                key={service.id}
                delay={(i % 3) * 0.1}
                variant={i % 3 === 0 ? 'left' : i % 3 === 2 ? 'right' : 'zoom'}
                className={isCarousel ? 'w-[85vw] max-w-[340px] shrink-0 snap-start' : undefined}
              >
                <div className="group h-full rounded-3xl border border-black/10 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-black/25 hover:shadow-[0_16px_40px_-20px_rgba(0,0,0,0.18)]">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-black/10 bg-black/[0.02] text-zinc-900 transition-colors duration-300 group-hover:bg-zinc-900 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 font-display text-lg font-semibold tracking-tight text-zinc-900">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                    {service.shortDesc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}