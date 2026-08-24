'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../../lib/api';
import { AdminCard } from '../../../../components/ui/AdminCard';
import { AdminInput } from '../../../../components/ui/AdminInput';
import { AdminTextarea } from '../../../../components/ui/AdminTextarea';
import { AdminButton } from '../../../../components/ui/AdminButton';
import { AdminSelect } from '../../../../components/ui/AdminSelect';
import { RichTextEditor } from '../../../../components/ui/RichTextEditor';
import { Project } from '../../../../types';
import { PROJECT_STATUSES } from '../../../../lib/constants';
import { useRouter, useParams } from 'next/navigation';

export default function ProjectFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === 'new';
  const projectId = params.id as string;
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Partial<Project>>({
    status: 'DRAFT',
    techStack: '[]'
  });

  const { data: project, isLoading } = useQuery({
    queryKey: ['admin-project', projectId],
    queryFn: async () => {
      const { data } = await api.get(`/projects/${projectId}`);
      return data.data as Project;
    },
    enabled: !isNew,
  });

  useEffect(() => {
    if (project && !isNew) {
      setFormData({
         ...project,
         techStack: typeof project.techStack === 'string' ? project.techStack : JSON.stringify(project.techStack)
      });
    }
  }, [project, isNew]);

  const saveMutation = useMutation({
    mutationFn: async (payload: Partial<Project>) => {
      const allowed = [
        'title', 'category', 'shortDescription', 'fullDescription', 'techStack',
        'githubUrl', 'liveUrl', 'featured', 'status', 'coverImage',
      ] as const;
      const clean: Record<string, unknown> = {};
      allowed.forEach((k) => {
        const v = (payload as Record<string, unknown>)[k];
        if (v !== undefined) clean[k] = v;
      });
      try {
        if (typeof clean.techStack === 'string') {
          clean.techStack = JSON.parse(clean.techStack as string);
        }
      } catch { /* keep raw string */ }

      // kosongkan URL opsional -> null
      ['githubUrl', 'liveUrl'].forEach((k) => {
        if (clean[k] === '') clean[k] = null;
      });

      if (isNew) {
        return api.post('/projects', clean);
      }
      return api.put(`/projects/${projectId}`, clean);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      router.push('/admin/projects');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Save failed');
    },
  });

  const uploadCover = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await api.post('/media/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data.url as string;
    },
    onSuccess: (url) => {
      setFormData((prev) => ({ ...prev, coverImage: url }));
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Upload failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  if (isLoading && !isNew) return <div className="text-sm text-muted">Loading...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">
          {isNew ? 'New Project' : 'Edit Project'}
        </h1>
        <AdminButton variant="secondary" onClick={() => router.push('/admin/projects')}>
          &lt; Back
        </AdminButton>
      </div>

      <AdminCard title="Project Details">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <AdminInput
              label="Title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <AdminInput
              label="Category (e.g. Web, Mobile, Game)"
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />

            <AdminSelect
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            >
              {PROJECT_STATUSES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </AdminSelect>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    uploadCover.mutate(e.target.files[0]);
                  }
                }}
                className="block w-full rounded-lg border border-input bg-white px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-primary file:text-primary-foreground file:rounded-md file:px-3 file:py-1 file:text-sm file:font-medium hover:file:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              {uploadCover.isPending && <p className="text-xs text-muted">Uploading…</p>}
              {formData.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={formData.coverImage} alt="Cover preview" className="mt-1 h-32 w-full rounded-lg object-cover" />
              )}
            </div>

            <AdminInput
              label="Live URL (opsional)"
              value={formData.liveUrl || ''}
              onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
            />
            <AdminInput
              label="GitHub URL (opsional)"
              value={formData.githubUrl || ''}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            />
          </div>

          <AdminInput
            label='Tech Stack (JSON array string e.g. ["React", "Node"])'
            value={formData.techStack as string || ''}
            onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
          />

          <AdminTextarea
            label="Short Description"
            value={formData.shortDescription || ''}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            className="min-h-[80px]"
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Full Description</label>
            <RichTextEditor
              value={formData.fullDescription || ''}
              onChange={(html) => setFormData({ ...formData, fullDescription: html })}
              placeholder="Tulis cerita project — bold, italic, list, link, dan gambar didukung."
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured || false}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            />
            <label htmlFor="featured" className="text-xs text-foreground">Featured Project</label>
          </div>

          <div className="flex justify-end pt-4">
            <AdminButton type="submit" isLoading={saveMutation.isPending}>
              {isNew ? 'Create Project' : 'Save Changes'}
            </AdminButton>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
