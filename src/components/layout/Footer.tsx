'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, Github, Linkedin, Mail, MessageCircle } from 'lucide-react';
import React from 'react';
import api from '../../lib/api';
import { SiteSettings } from '../../types';
import { useFooterSocials } from './BackToTop';

const ICONS = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  message: MessageCircle,
};

export function Footer() {
  const { links } = useFooterSocials();
  const { data: settings } = useQuery({
    queryKey: ['public-settings'],
    queryFn: async () => {
      const { data } = await api.get('/settings');
      return data.data as SiteSettings;
    },
    staleTime: Infinity,
  });

  const name = settings?.siteName || 'VIA';

  return (
    <footer className="border-t border-black/10">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-[0.2em] text-zinc-900">
              <span className="h-2 w-2 rounded-full bg-zinc-900" />
              {name}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              Software engineer focused on clean, considered, and enduring work.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              ['Services', '#services'],
              ['Projects', '#projects'],
              ['Tech Stack', '#skills'],
              ['Leave a mark', '#guestbook'],
              ['Contact', '#contact'],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            {links.map((l) => {
              const Icon = ICONS[l.icon] ?? ArrowUpRight;
              return (
                <a
                  key={l.key}
                  href={l.href!}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={l.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-black/10 text-zinc-500 transition-colors hover:border-black/30 hover:text-zinc-900"
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-black/10 pt-6 text-xs text-zinc-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {name}. All rights reserved.</p>
          <p>Open to new opportunities</p>
        </div>
      </div>
    </footer>
  );
}