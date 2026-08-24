'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/api';
import { AdminCard } from '../../../components/ui/AdminCard';
import { AdminButton } from '../../../components/ui/AdminButton';
import { Project } from '../../../types';
import { Edit, Trash, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsAdminPage() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const { data } = await api.get('/projects');
      return data.data as Project[];
    },
  });

  if (isLoading) return <div className="text-sm text-muted">Loading...</div>;

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Projects</h1>
        <Link href="/admin/projects/new">
          <AdminButton>+ New Project</AdminButton>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <AdminCard key={project.id} title={project.title} className="flex flex-col">
            <div className="relative aspect-video mb-4 overflow-hidden rounded-lg bg-black/5 group">
              {project.coverImage ? (
                <img src={project.coverImage} alt={project.title} className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all" />
              ) : (
                <div className="flex items-center justify-center h-full text-muted">No Image</div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`text-xs px-2 py-1 rounded ${project.status === 'PUBLISHED' ? 'bg-primary text-white' : 'bg-danger text-white'}`}>
                  {project.status}
                </span>
              </div>
            </div>

            <p className="text-sm text-muted flex-grow">{project.shortDescription}</p>

            <div className="mt-4 pt-4 border-t border-black/5 flex justify-between items-center">
              <div className="flex gap-2">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-muted hover:text-foreground">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/projects/${project.id}`}>
                  <AdminButton variant="ghost" className="h-7 w-7 p-1">
                    <Edit className="h-4 w-4" />
                  </AdminButton>
                </Link>
                <AdminButton variant="ghost" className="h-7 w-7 p-1">
                  <Trash className="h-4 w-4" />
                </AdminButton>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
