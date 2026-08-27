'use client';

import React, { useEffect, useState } from 'react';

export function PageTransition() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 1200);
    return () => clearTimeout(t);
  }, []);

  if (hidden) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[200]"
      style={{
        background: '#f7f7f5',
        animation: 'splashFade 0.8s ease-in-out 0.4s forwards',
      }}
      aria-hidden
    >
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <span className="font-display text-4xl font-bold tracking-[0.35em] text-zinc-900">
          VIA
        </span>
        <span className="text-xs uppercase tracking-[0.28em] text-zinc-500">
          Portfolio
        </span>
      </div>
      <style>{`
        @keyframes splashFade {
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
