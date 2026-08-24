'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api';
import { AdminCard } from '../../../components/ui/AdminCard';
import { AdminInput } from '../../../components/ui/AdminInput';
import { AdminTextarea } from '../../../components/ui/AdminTextarea';
import { AdminButton } from '../../../components/ui/AdminButton';
import { ContactInfo } from '../../../types';

export default function ContactAdminPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<ContactInfo>>({});

  const { data: contact, isLoading } = useQuery({
    queryKey: ['admin-contact'],
    queryFn: async () => {
      const { data } = await api.get('/contact');
      return data.data as ContactInfo;
    },
  });

  useEffect(() => {
    if (contact) {
      setFormData(contact);
    }
  }, [contact]);

  const updateMutation = useMutation({
    mutationFn: async (payload: Partial<ContactInfo>) => {
      const { data } = await api.put('/contact', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contact'] });
      alert('Contact info updated!');
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
      <h1 className="text-2xl font-semibold text-foreground">Contact Info</h1>

      <AdminCard title="Edit Contact Details">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-3 pt-2 pb-4 border-b border-black/5">
            <input
              type="checkbox"
              id="isAvailable"
              checked={formData.isAvailable || false}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
            />
            <label htmlFor="isAvailable" className="text-xs text-foreground">Available for hire</label>
          </div>

          <AdminInput
            label="Availability Status Message"
            name="availabilityStatus"
            value={formData.availabilityStatus || ''}
            onChange={handleChange}
            placeholder="e.g. Currently exploring new opportunities!"
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 pt-4">
            <AdminInput
              label="Email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
            />
            <AdminInput
              label="WhatsApp (Include country code)"
              name="whatsapp"
              value={formData.whatsapp || ''}
              onChange={handleChange}
            />
            <AdminInput
              label="LinkedIn URL"
              name="linkedin"
              value={formData.linkedin || ''}
              onChange={handleChange}
            />
            <AdminInput
              label="GitHub URL"
              name="github"
              value={formData.github || ''}
              onChange={handleChange}
            />
            <AdminInput
              label="Instagram URL"
              name="instagram"
              value={formData.instagram || ''}
              onChange={handleChange}
            />
            <AdminInput
              label="Discord Username"
              name="discord"
              value={formData.discord || ''}
              onChange={handleChange}
            />
          </div>

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
