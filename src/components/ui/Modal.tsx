'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import React, { useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  labelledBy?: string;
}

export function Modal({ open, onClose, children, labelledBy }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    (window as any).__lenis?.stop();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      (window as any).__lenis?.start();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="relative z-10 max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-2xl border border-black/10 bg-base sm:rounded-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close details"
              className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white text-zinc-500 transition-colors hover:border-black/30 hover:text-zinc-900"
            >
              <X className="h-4.5 w-4.5" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}