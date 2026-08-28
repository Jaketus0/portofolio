'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { SocialLink } from '../../types';
import { cn } from '../../lib/utils';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'fixed bottom-6 left-6 z-40 grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white/85 backdrop-blur',
        'text-zinc-500 transition-all duration-300 hover:border-black/30 hover:text-zinc-900',
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}

export function useFooterSocials() {
  const { data: socials } = useQuery({
    queryKey: ['public-social-links'],
    queryFn: async () => {
      const { data } = await api.get('/hero/social-links');
      return data.data as SocialLink[];
    },
    staleTime: 60 * 1000,
  });

  const links = (socials || [])
    .filter((s) => s.isActive)
    .map((s) => {
      const platform = s.platform.toLowerCase();
      const icon = platform === 'email' || platform === 'mail' ? 'mail' as const
        : platform === 'whatsapp' ? 'message' as const
        : platform === 'linkedin' ? 'linkedin' as const
        : platform === 'github' ? 'github' as const
        : null;
      if (!icon) return null;
      return { key: s.id, label: s.platform, href: s.url, icon };
    })
    .filter((l): l is { key: string; label: string; href: string; icon: 'github' | 'linkedin' | 'mail' | 'message' } => !!l);

  return { links };
}