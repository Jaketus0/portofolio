'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api';
import { AdminCard } from '../../../components/ui/AdminCard';
import { AdminInput } from '../../../components/ui/AdminInput';
import { AdminButton } from '../../../components/ui/AdminButton';
import { SiteSettings } from '../../../types';

export default function SettingsAdminPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<SiteSettings>>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data } = await api.get('/settings');
      return data.data as SiteSettings;
    },
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (payload: Partial<SiteSettings>) => {
      const { data } = await api.put('/settings', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      alert('Settings updated!');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Update failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isLoading) return <div className="text-sm text-muted">Loading...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Site Settings</h1>

      <AdminCard title="General Configuration">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <AdminInput
              label="Site Name"
              name="siteName"
              value={formData.siteName || ''}
              onChange={handleChange}
            />
            <AdminInput
              label="Favicon URL"
              name="favicon"
              value={formData.favicon || ''}
              onChange={handleChange}
            />
            <AdminInput
              label="Theme Override (e.g. 'light', 'dark', 'minimal')"
              name="theme"
              value={formData.theme || 'minimal'}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
              <input
                  type="checkbox"
                  id="maintenanceMode"
                  checked={formData.maintenanceMode || false}
                  onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
              />
              <label htmlFor="maintenanceMode" className="text-xs text-foreground">
                  Maintenance Mode (Restrict public access)
              </label>
          </div>

          <div className="flex justify-end pt-4">
            <AdminButton type="submit" isLoading={updateMutation.isPending}>
              Save Configuration
            </AdminButton>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
