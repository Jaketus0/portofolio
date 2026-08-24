'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Code2, ExternalLink, Github, Search, Star } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import api from '../../lib/api';
import { Project } from '../../types';
import { cn } from '../../lib/utils';
import { Chip } from '../ui/Chip';
import { Modal } from '../ui/Modal';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { Skeleton } from '../ui/Skeleton';

function parseStack(stack: any): string[] {
  if (!stack) return [];
  try {
    return typeof stack === 'string' ? JSON.parse(stack) : stack;
  } catch {
    return [];
  }
}

function ProjectCard({
  project,
  onOpen,
  featured = false,
}: {
  project: Project;
  onOpen: (p: Project) => void;
  featured?: boolean;
}) {
  const stack = parseStack(project.techStack);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onOpen(project)}
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${project.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(project);
        }
      }}
      className={cn(
        'group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-black/10 bg-white outline-none transition-shadow duration-300 hover:shadow-[0_18px_50px_-24px_rgba(0,0,0,0.2)] focus-visible:border-black/40'
      )}
    >
      {/* Cover */}
      <div className="relative aspect-video overflow-hidden">
        {project.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.coverImage}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-black/[0.02]">
            <Code2 className="h-10 w-10 text-zinc-300" />
          </div>
        )}

        {project.featured && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/85 px-3 py-1 text-xs font-medium text-zinc-900 backdrop-blur">
            <Star className="h-3.5 w-3.5 fill-current" />
            Featured
          </span>
        )}
      </div>

      {/* Body */}
      <div className={cn('flex flex-1 flex-col p-6', featured && 'lg:p-8')}>
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-xl font-semibold tracking-tight text-zinc-900">
            {project.title}
          </h3>
          <span className="shrink-0 rounded-full border border-black/10 bg-black/[0.02] px-3 py-1 text-xs text-zinc-500">
            {project.category}
          </span>
        </div>

        <p
          className={cn(
            'mt-3 text-sm leading-relaxed text-zinc-500',
            featured && 'text-base'
          )}
        >
          {project.shortDescription}
        </p>

        {stack.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {stack.slice(0, featured ? 8 : 5).map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
            {stack.length > (featured ? 8 : 5) && (
              <Chip>+{stack.length - (featured ? 8 : 5)}</Chip>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3 pt-1" onClick={(e) => e.stopPropagation()}>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black"
            >
              <ExternalLink className="h-4 w-4" /> Live demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-black/5"
            >
              <Github className="h-4 w-4" /> Source
            </a>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-zinc-400 transition-colors group-hover:text-zinc-900">
            View details →
          </span>
        </div>
      </div>
    </motion.article>
  );
}

function CaseStudyModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const stack = project ? parseStack(project.techStack) : [];

  return (
    <Modal open={!!project} onClose={onClose} labelledBy="case-study-title">
      {project && (
        <div>
          {project.coverImage && (
            <div className="relative aspect-video overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.coverImage}
                alt={project.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              {project.featured && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs font-medium text-zinc-900">
                  <Star className="h-3.5 w-3.5" /> Featured
                </span>
              )}
              <span className="rounded-full border border-black/10 bg-black/[0.02] px-3 py-1 text-xs text-zinc-500">
                {project.category}
              </span>
            </div>

            <h3
              id="case-study-title"
              className="mt-4 font-display text-3xl font-semibold tracking-tight text-zinc-900"
            >
              {project.title}
            </h3>

            {/* ponytail: HTML dari admin (trusted), tanpa sanitizer — tambah DOMPurify kalau nanti multi-penulis */}
            <div
              className="rich-content mt-4"
              dangerouslySetInnerHTML={{ __html: project.fullDescription || '' }}
            />

            {stack.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-xs uppercase tracking-wide text-zinc-500">
                  Tech stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {stack.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-black"
                >
                  <ExternalLink className="h-4 w-4" /> Live demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-black/15 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-black/5"
                >
                  <Github className="h-4 w-4" /> View source
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

export function ProjectsSection() {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<Project | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    setVisibleCount(6);
  }, [filter, query]);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['public-projects'],
    queryFn: async () => {
      const { data } = await api.get('/projects');
      return data.data as Project[];
    },
  });

  const categories = useMemo(() => {
    const set = new Set((projects || []).map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, [projects]);

  const filtered = useMemo(() => {
    if (!projects) return [];
    let list = projects;
    if (filter !== 'All') list = list.filter((p) => p.category === filter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          parseStack(p.techStack).some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [projects, filter, query]);

  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => p !== featured);

  return (
    <section id="projects" className="px-4 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Work"
          title="Selected projects"
          subtitle="A curated set of things I've designed, built, and shipped."
          align="center"
        />

        {/* Controls */}
        <div className="mb-10 flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                aria-pressed={filter === cat}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  filter === cat
                    ? 'bg-zinc-900 text-white'
                    : 'border border-black/10 text-zinc-500 hover:border-black/30 hover:text-zinc-900'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects…"
              aria-label="Search projects"
              className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-11 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-black/40 focus:outline-none"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-3xl border border-black/10 bg-white">
                <Skeleton className="aspect-video w-full rounded-none" />
                <div className="space-y-3 p-6">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="grid place-items-center rounded-3xl border border-black/10 bg-white py-24 text-center">
            <p className="text-sm text-zinc-500">
              No projects match your search.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured && (
              <ProjectCard project={featured} onOpen={setActive} featured />
            )}
              {rest.slice(0, visibleCount).map((p) => (
                <ProjectCard key={p.id} project={p} onOpen={setActive} />
              ))}
            </div>

            {rest.length > visibleCount && (
              <div className="mt-12 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="rounded-full border border-black/15 px-6 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:border-black/30 hover:text-zinc-900"
                >
                  Load more ({rest.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <CaseStudyModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}