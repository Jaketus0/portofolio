'use client';

import React, { useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api';
import { AdminCard } from '../../../components/ui/AdminCard';
import { AdminButton } from '../../../components/ui/AdminButton';
import { Upload, Trash, Copy } from 'lucide-react';

export default function MediaAdminPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: mediaFiles, isLoading } = useQuery({
    queryKey: ['admin-media'],
    queryFn: async () => {
      const { data } = await api.get('/media');
      return data.data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/media/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
    },
    onError: (err: any) => {
        alert(err.response?.data?.message || 'Upload failed');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          uploadMutation.mutate(e.target.files[0]);
      }
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      alert('URL copied to clipboard!');
  };

  if (isLoading) return <div className="text-sm text-muted">Loading...</div>;

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Media Library</h1>

        <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
        />
        <AdminButton
            onClick={() => fileInputRef.current?.click()}
            isLoading={uploadMutation.isPending}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </AdminButton>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {mediaFiles?.map((file: any) => (
              <div key={file.id} className="group relative aspect-square overflow-hidden rounded-lg border bg-white flex flex-col justify-between">
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center gap-2">
                      <button onClick={() => copyToClipboard(file.url)} className="p-2 rounded-lg bg-primary text-white hover:bg-black">
                          <Copy className="h-4 w-4" />
                      </button>
                      <button onClick={() => { if(confirm('Delete?')) deleteMutation.mutate(file.id) }} className="p-2 rounded-lg bg-danger text-white hover:bg-danger/80">
                          <Trash className="h-4 w-4" />
                      </button>
                  </div>

                  {file.mimeType.startsWith('image/') ? (
                      <img src={file.url} alt={file.filename} className="w-full h-full object-cover" />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-primary">
                          {file.mimeType.split('/')[1]?.toUpperCase() || 'FILE'}
                      </div>
                  )}

                  <div className="absolute bottom-0 inset-x-0 bg-white/90 border-t border-black/5 p-2">
                      <p className="truncate text-xs text-muted">{file.originalName}</p>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
}
