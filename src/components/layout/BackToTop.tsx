'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { ContactInfo } from '../../types';
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
  const { data: contact } = useQuery({
    queryKey: ['public-contact'],
    queryFn: async () => {
      const { data } = await api.get('/contact');
      return data.data as ContactInfo;
    },
    staleTime: 60 * 1000,
  });

  const links = [
    { key: 'github', label: 'GitHub', href: contact?.github, icon: 'github' as const },
    { key: 'linkedin', label: 'LinkedIn', href: contact?.linkedin, icon: 'linkedin' as const },
    { key: 'email', label: 'Email', href: contact?.email ? `mailto:${contact.email}` : null, icon: 'mail' as const },
    { key: 'whatsapp', label: 'WhatsApp', href: contact?.whatsapp ? `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}` : null, icon: 'message' as const },
  ].filter((l) => !!l.href);

  return { links, contact };
}