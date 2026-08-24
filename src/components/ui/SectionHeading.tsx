import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
  id?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

function AnimatedTitle({ title }: { title: React.ReactNode }) {
  const words = typeof title === 'string' ? title.split(' ') : null;

  if (!words) return <>{title}</>;

  return (
    <span className="inline-block">
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="mr-[0.28em] inline-block"
          initial={{ opacity: 0, y: '0.6em', rotate: 2 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  id,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-10 flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left'
      )}
    >
      {eyebrow && (
        <div className="flex items-center gap-3">
          <motion.span
            aria-hidden
            className="h-px w-8 origin-right bg-zinc-300"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: EASE }}
          />
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {eyebrow}
          </motion.span>
          <motion.span
            aria-hidden
            className="h-px w-8 origin-left bg-zinc-300"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: EASE }}
          />
        </div>
      )}

      <motion.h2
        id={id}
        className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl md:text-5xl"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <AnimatedTitle title={title} />
      </motion.h2>

      {subtitle && (
        <motion.p
          className={cn(
            'max-w-xl text-base leading-relaxed text-muted sm:text-lg',
            align === 'center' ? 'mx-auto' : ''
          )}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
