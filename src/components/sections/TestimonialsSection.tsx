'use client';

import { useQuery } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import api from '../../lib/api';
import { GuestMessage } from '../../types';
import { SectionHeading } from '../ui/SectionHeading';

export function TestimonialsSection() {
  const { data: messages } = useQuery({
    queryKey: ['public-messages'],
    queryFn: async () => {
      const { data } = await api.get('/messages/public');
      return data.data as GuestMessage[];
    },
  });

  const testimonials = useMemo(() => (messages || []).slice(0, 8), [messages]);
  const [selected, setSelected] = useState(0);
  const [viewportRef, embla] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    embla.on('select', onSelect);
    onSelect();
    return () => {
      embla.off('select', onSelect);
    };
  }, [embla]);

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="relative overflow-hidden px-4 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Kind words"
          title="What people say"
          subtitle="Notes left on the wall by collaborators, clients, and peers."
          align="center"
        />

        <div className="relative">
          <div className="embla overflow-hidden" ref={viewportRef}>
            <div className="embla__container">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="embla__slide flex-none px-3"
                  style={{ flexBasis: '100%', maxWidth: '100%' }}
                >
                  <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center sm:p-10">
                    <Quote className="mx-auto mb-5 h-8 w-8 text-white/25" />
                    <blockquote className="text-lg leading-relaxed text-white/90 sm:text-xl">
                      “{t.message}”
                    </blockquote>
                    <figcaption className="mt-6 flex items-center justify-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/[0.03] font-display text-sm font-semibold text-white">
                        {t.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="text-left">
                        <span className="block text-sm font-medium text-white">
                          {t.name}
                        </span>
                        <span className="block text-xs text-muted">
                          Guest of the wall
                        </span>
                      </span>
                    </figcaption>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => embla?.scrollPrev()}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/12 text-white transition-colors hover:border-white/30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => embla?.scrollTo(i)}
                  className={`h-2 rounded-full transition-all ${
                    selected === i
                      ? 'w-6 bg-white'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => embla?.scrollNext()}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/12 text-white transition-colors hover:border-white/30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}