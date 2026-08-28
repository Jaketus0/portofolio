'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api';
import { AdminCard } from '../../../components/ui/AdminCard';
import { AdminInput } from '../../../components/ui/AdminInput';
import { AdminTextarea } from '../../../components/ui/AdminTextarea';
import { AdminButton } from '../../../components/ui/AdminButton';
import { HeroSection } from '../../../types';

export default function HeroAdminPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<HeroSection>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: hero, isLoading } = useQuery({
    queryKey: ['hero'],
    queryFn: async () => {
      const { data } = await api.get('/hero');
      return data.data as HeroSection;
    },
  });

  useEffect(() => {
    if (hero) {
      setFormData(hero);
    }
  }, [hero]);

  const updateMutation = useMutation({
    mutationFn: async (payload: { fields: Partial<HeroSection>; file?: File }) => {
      let heroImageUrl = payload.fields.heroImage;
      if (payload.file) {
        const fd = new FormData();
        fd.append('file', payload.file);
        const { data: uploadData } = await api.post('/media/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        heroImageUrl = uploadData.data.url;
      }
      const { data } = await api.put('/hero', {
        ...payload.fields,
        heroImage: heroImageUrl,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero'] });
      queryClient.invalidateQueries({ queryKey: ['public-hero'] });
      alert('Hero updated successfully!');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Update failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fields: Partial<HeroSection> = {};
    ['greeting', 'name', 'jobTitle', 'description', 'ctaText', 'ctaLink', 'techStack'].forEach((key) => {
      const value = (formData as Record<string, unknown>)[key];
      if (value != null) (fields as Record<string, unknown>)[key] = value;
    });
    updateMutation.mutate({ fields, file: imageFile || undefined });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  if (isLoading) return <div className="text-sm text-muted">Loading...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Hero Section</h1>

      <AdminCard title="Edit Hero Content">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <AdminInput
              label="Greeting"
              name="greeting"
              value={formData.greeting || ''}
              onChange={handleChange}
            />
            <AdminInput
              label="Name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
            />
            <AdminInput
              label="Job Title"
              name="jobTitle"
              value={formData.jobTitle || ''}
              onChange={handleChange}
            />
            <AdminInput
              label="CTA Text"
              name="ctaText"
              value={formData.ctaText || ''}
              onChange={handleChange}
            />
            <AdminInput
              label="CTA Link"
              name="ctaLink"
              value={formData.ctaLink || ''}
              onChange={handleChange}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Hero Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full rounded-lg border border-input bg-white px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-primary file:text-primary-foreground file:rounded-md file:px-3 file:py-1 file:text-sm file:font-medium hover:file:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              {formData.heroImage && !imageFile && (
                <img src={formData.heroImage} alt="Current hero image" className="mt-2 h-32 w-full rounded-lg object-cover" />
              )}
              {imageFile && (
                <img src={URL.createObjectURL(imageFile)} alt="New hero image preview" className="mt-2 h-32 w-full rounded-lg object-cover" />
              )}
            </div>
          </div>

          <AdminTextarea
            label="Description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
          />

          <AdminTextarea
            label="Tech Stack (pisah dengan koma, misal: Next.js, TailwindCSS, Motion, AWS)"
            name="techStack"
            value={formData.techStack || ''}
            onChange={handleChange}
          />

          <div className="flex justify-end pt-4">
            <AdminButton type="submit" isLoading={updateMutation.isPending}>
              Save Changes
            </AdminButton>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
