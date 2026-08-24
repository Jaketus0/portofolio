'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { Award, ExternalLink, ShieldCheck } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { getCredentials, type Credential } from '../../lib/credentials-service';
import { SectionHeading } from '../ui/SectionHeading';
import { Skeleton } from '../ui/Skeleton';

export function CertificatesSection() {
  const [credentials, setCredentials] = useState<Credential[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(0);
  const [viewportRef, embla] = useEmblaCarousel({ loop: true, align: 'start' });

  useEffect(() => {
    let mounted = true;
    getCredentials()
      .then((list) => {
        if (mounted) setCredentials(list);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    embla.on('select', onSelect);
    onSelect();
    return () => {
      embla.off('select', onSelect);
    };
  }, [embla]);

  const items = useMemo(() => credentials || [], [credentials]);

  if (loading) {
    return (
      <section className="px-4 py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Credentials" title="Certifications & awards" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-44" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // No data yet — purposely render nothing. This section activates
  // automatically once a credentials endpoint provides content.
  if (items.length === 0) return null;

  return (
    <section id="certificates" className="relative px-4 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Credentials"
          title="Certifications & awards"
          subtitle="Continuous learning, certified across the stack."
          align="center"
        />

        <div className="relative">
          <div className="embla overflow-hidden" ref={viewportRef}>
            <div className="embla__container">
              {items.map((c) => (
                <div
                  key={c.id}
                  className="embla__slide flex-none px-3"
                  style={{ flexBasis: '100%', maxWidth: '100%' }}
                >
                  <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
                    <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-xl border border-white/10 text-white/60">
                      <ShieldCheck className="h-7 w-7" />
                    </span>
                    <h3 className="font-display text-lg font-semibold text-white">
                      {c.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{c.issuer}</p>
                    {c.url && (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm text-white transition-colors hover:border-white/30 hover:text-white"
                      >
                        <ExternalLink className="h-4 w-4" /> View credential
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Previous certificate"
              onClick={() => embla?.scrollPrev()}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/12 text-white transition-colors hover:border-white/30"
            >
              <Chevron className="h-5 w-5" flip={true} />
            </button>
            <div className="flex gap-2">
              {items.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  aria-label={`Go to certificate ${i + 1}`}
                  onClick={() => embla?.scrollTo(i)}
                  className={`h-2 rounded-full transition-all ${
                    selected === i ? 'w-6 bg-white' : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next certificate"
              onClick={() => embla?.scrollNext()}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/12 text-white transition-colors hover:border-white/30"
            >
              <Chevron className="h-5 w-5" flip={false} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Chevron({
  className,
  flip,
}: {
  className?: string;
  flip: boolean;
}) {
  return (
    <svg
      className={className}
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}