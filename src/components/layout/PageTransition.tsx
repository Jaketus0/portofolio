'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

export function PageTransition() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[200] grid place-items-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      style={{ display: done ? 'none' : 'grid' }}
      aria-hidden
    >
      <div className="absolute inset-0 bg-base" />
      <div className="relative flex flex-col items-center gap-4">
        <span className="font-display text-2xl font-semibold tracking-[0.35em] text-zinc-900">
          VIA
        </span>
        <span className="text-xs uppercase tracking-[0.28em] text-zinc-500">
          Portfolio
        </span>
      </div>
    </motion.div>
  );
}