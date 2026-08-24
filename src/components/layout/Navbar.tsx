'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { SiteSettings } from '../../types';
import { cn } from '../../lib/utils';

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Tech Stack', href: '#skills' },
  { label: 'Leave a mark', href: '#guestbook' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['public-settings'],
    queryFn: async () => {
      const { data } = await api.get('/settings');
      return data.data as SiteSettings;
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const siteName = settings?.siteName || 'VIA';

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
          scrolled
            ? 'border-b border-black/10 bg-white/85 backdrop-blur-md'
            : 'border-b border-transparent'
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <a
            href="#top"
            className="flex items-center gap-2.5 text-sm font-semibold tracking-[0.2em] text-zinc-900"
          >
            <span className="h-2 w-2 rounded-full bg-zinc-900" />
            {siteName}
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-full px-3.5 py-2 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-black"
            >
              Let's talk
            </a>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 md:hidden"
          >
            <div className="flex w-4 flex-col gap-1.5">
              <span
                className={cn(
                  'h-0.5 w-full rounded-full bg-zinc-900 transition-transform duration-300',
                  open && 'translate-y-1 rotate-45'
                )}
              />
              <span
                className={cn(
                  'h-0.5 w-full rounded-full bg-zinc-900 transition-transform duration-300',
                  open && '-translate-y-1 -rotate-45'
                )}
              />
            </div>
          </button>
        </div>
      </motion.header>

      <motion.div
        initial={false}
        animate={{ opacity: open ? 1 : 0, y: open ? 0 : -12 }}
        className={cn(
          'fixed inset-x-4 top-16 z-40 md:hidden',
          open ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        <div className="rounded-2xl border border-black/10 bg-white p-3 shadow-lg">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </>
  );
}