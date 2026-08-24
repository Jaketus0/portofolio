'use client';

import React from 'react';

export function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 bg-base"
    >
      {/* barely-there gradient for depth; keeps the page quiet */}
      <div className="absolute -top-[24rem] left-1/2 h-[42rem] w-[90rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.035),transparent_65%)]" />
    </div>
  );
}