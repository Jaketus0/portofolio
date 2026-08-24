'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import React, { useEffect, useState } from 'react';

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 400, damping: 35, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 400, damping: 35, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setEnabled(true);
    document.body.classList.add('custom-cursor');

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement;
      setHovering(
        !!target.closest('a, button, [role="button"], input, textarea, select')
      );
    };
    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
      document.body.classList.remove('custom-cursor');
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* trailing ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/50 md:block"
        style={{ x: springX, y: springY }}
        animate={{
          scale: hovering ? 1.8 : 1,
          opacity: hovering ? 0.9 : 0.6,
        }}
        transition={{ duration: 0.2 }}
      />
      {/* dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[101] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary md:block"
        style={{ x, y }}
      />
    </>
  );
}