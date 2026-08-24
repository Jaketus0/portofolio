'use client';

import { useQuery } from '@tanstack/react-query';
import { Download, Sparkles } from 'lucide-react';
import React from 'react';
import api from '../../lib/api';
import { AboutSection as AboutType } from '../../types';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

export function AboutSection() {
  const { data: about } = useQuery({
    queryKey: ['public-about'],
    queryFn: async () => {
      const { data } = await api.get('/about');
      return data.data as AboutType;
    },
  });

  if (!about) return null;

  const paragraphs = (about.longDescription || '')
    .split(/\n+/)
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <section id="about" className="px-4 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="About"
          title="Turning ideas into enduring work"
          align="center"
        />

        <div className="grid gap-14 lg:grid-cols-5 lg:items-start">
          {/* Photo */}
          <Reveal className="lg:col-span-2">
            <div className="mx-auto max-w-sm">
              <div className="relative overflow-hidden rounded-2xl border border-white/10">
                {about.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={about.photo}
                    alt={about.name}
                    className="aspect-[4/5] w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="grid aspect-[4/5] w-full place-items-center bg-white/[0.03]">
                    <Sparkles className="h-12 w-12 text-white/25" />
                  </div>
                )}
              </div>

              {about.shortIntro && (
                <p className="mt-5 border-l border-white/20 pl-4 text-base leading-relaxed text-muted">
                  {about.shortIntro}
                </p>
              )}
            </div>
          </Reveal>

          {/* Copy */}
          <Reveal delay={0.1} className="lg:col-span-3">
            <div className="max-w-2xl">
              <div className="space-y-5 text-base leading-relaxed text-muted sm:text-lg">
                {paragraphs.length === 0 ? (
                  <p>{about.longDescription}</p>
                ) : (
                  paragraphs.map((p, i) => <p key={i}>{p}</p>)
                )}
              </div>

              {(about.resumeUrl || about.cvUrl) && (
                <div className="pt-8">
                  <a
                    href={about.resumeUrl || about.cvUrl || '#about'}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-minimal-outline"
                  >
                    <Download className="h-4 w-4" />
                    Download CV / Resume
                  </a>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}