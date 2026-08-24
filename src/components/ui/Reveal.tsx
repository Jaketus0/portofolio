import { motion, type HTMLMotionProps, type TargetAndTransition } from 'framer-motion';
import React from 'react';

interface RevealProps extends HTMLMotionProps<'div'> {
  delay?: number;
  y?: number;
  once?: boolean;
  variant?: 'up' | 'down' | 'left' | 'right' | 'zoom' | 'blur';
}

const HIDDEN: Record<string, TargetAndTransition> = {
  up: { opacity: 0 },
  down: { opacity: 0, y: -24 },
  left: { opacity: 0, x: -32 },
  right: { opacity: 0, x: 32 },
  zoom: { opacity: 0, scale: 0.94 },
  blur: { opacity: 0, filter: 'blur(8px)' },
};

export function Reveal({
  delay = 0,
  y = 24,
  once = true,
  variant = 'up',
  className,
  children,
  ...props
}: RevealProps) {
  const hidden = { ...HIDDEN[variant] };
  if (!('y' in hidden)) hidden.y = y;

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-80px' }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
