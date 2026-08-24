'use client';

import { useEffect } from 'react';

export function SmoothScroller() {
  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduced) return;

    let cleanup: (() => void) | undefined;

    import('lenis').then((mod) => {
      const Lenis = mod.default;
      const lenis = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      let rafId = 0;
      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);

      // Expose untuk modal (stop/start saat popup terbuka)
      (window as any).__lenis = lenis;

      cleanup = () => {
        cancelAnimationFrame(rafId);
        delete (window as any).__lenis;
        lenis.destroy();
      };
    });

    return () => cleanup?.();
  }, []);

  return null;
}