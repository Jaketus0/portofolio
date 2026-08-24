'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface AnimatedProgressProps {
  value: number;
}

export function AnimatedProgress({ value }: AnimatedProgressProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
        initial={{ width: 0 }}
        whileInView={{ width: `${clamped}%` }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}