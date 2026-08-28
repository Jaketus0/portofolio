'use client';

import React, { useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api';
import { AdminCard } from '../../../components/ui/AdminCard';
import { AdminButton } from '../../../components/ui/AdminButton';
import { AboutSection } from '../../../types';
import { Upload, FileText, Trash } from 'lucide-react';

export default function CvAdminPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: about, isLoading } = useQuery({
    queryKey: ['admin-about'],
    queryFn: async () => {
      const { data } = await api.get('/about');
      return data.data as AboutSection;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const fileUrl = data.data?.url || data.data?.path;
      if (!fileUrl) throw new Error('Upload failed — no URL returned');
      await api.put('/about', { resumeUrl: fileUrl });
      return fileUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-about'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Upload failed');
    },
  });

  const removeMutation = useMutation({
    mutationFn: async () => {
      await api.put('/about', { resumeUrl: null });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-about'] });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed');
      return;
    }
    uploadMutation.mutate(file);
  };

  if (isLoading) return <div className="text-sm text-muted">Loading...</div>;

  const cvUrl = about?.resumeUrl || about?.cvUrl || null;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">CV / Resume</h1>

      <AdminCard>
        <div className="space-y-6">
          {cvUrl ? (
            <div className="flex items-center justify-between rounded-xl border border-black/5 bg-black/2 p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-muted" />
                <div>
                  <p className="text-sm font-medium text-foreground">Current CV</p>
                  <a href={cvUrl} target="_blank" rel="noreferrer" className="text-xs text-primary underline">
                    {cvUrl.split('/').pop()}
                  </a>
                </div>
              </div>
              <div className="flex gap-2">
                <AdminButton variant="ghost" onClick={() => window.open(cvUrl, '_blank')}>
                  View
                </AdminButton>
                <AdminButton
                  variant="ghost"
                  className="text-danger"
                  onClick={() => { if (confirm('Remove CV?')) removeMutation.mutate(); }}
                  isLoading={removeMutation.isPending}
                >
                  <Trash className="h-4 w-4" />
                </AdminButton>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-black/20 bg-black/2 p-8 text-center">
              <FileText className="mx-auto h-10 w-10 text-muted" />
              <p className="mt-2 text-sm text-muted">No CV uploaded yet</p>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf"
            onChange={handleFileChange}
          />
          <AdminButton
            onClick={() => fileInputRef.current?.click()}
            isLoading={uploadMutation.isPending}
          >
            <Upload className="h-4 w-4 mr-2" />
            {cvUrl ? 'Replace CV' : 'Upload CV'}
          </AdminButton>
          <p className="text-xs text-muted">PDF only, max 10 MB</p>
        </div>
      </AdminCard>
    </div>
  );
}
