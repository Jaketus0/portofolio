'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api';
import { AdminCard } from '../../../components/ui/AdminCard';
import { AdminButton } from '../../../components/ui/AdminButton';
import { AdminInput } from '../../../components/ui/AdminInput';
import { AdminSelect } from '../../../components/ui/AdminSelect';
import { AdminModal } from '../../../components/ui/AdminModal';
import { SocialLink } from '../../../types';
import { Trash, Edit, GripVertical } from 'lucide-react';

const PLATFORMS = ['GitHub', 'LinkedIn', 'Twitter', 'Instagram', 'WhatsApp', 'Email', 'Discord', 'Telegram', 'YouTube', 'TikTok'];

interface FormData {
  platform: string;
  url: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

const defaultForm: FormData = { platform: 'GitHub', url: '', icon: '', sortOrder: 0, isActive: true };

export default function SocialLinksAdminPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultForm);

  const { data: links, isLoading } = useQuery({
    queryKey: ['admin-social-links'],
    queryFn: async () => {
      const { data } = await api.get('/hero/social-links');
      return data.data as SocialLink[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: Partial<SocialLink>) => {
      if (editingId) {
        return api.put(`/hero/social-links/${editingId}`, payload);
      }
      return api.post('/hero/social-links', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-social-links'] });
      setIsModalOpen(false);
      setEditingId(null);
      setFormData(defaultForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/hero/social-links/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-social-links'] }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.platform || !formData.url) return;
    saveMutation.mutate(formData);
  };

  const handleEdit = (link: SocialLink) => {
    setFormData({ platform: link.platform, url: link.url, icon: link.icon || '', sortOrder: link.sortOrder, isActive: link.isActive });
    setEditingId(link.id);
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="text-sm text-muted">Loading...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Social Links</h1>
        <AdminButton onClick={() => { setFormData(defaultForm); setEditingId(null); setIsModalOpen(true); }}>
          + Add Link
        </AdminButton>
      </div>

      <AdminCard>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/5">
                <th className="pb-2 w-8"></th>
                <th className="pb-2">Platform</th>
                <th className="pb-2">URL</th>
                <th className="pb-2">Order</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {links?.map((link) => (
                <tr key={link.id} className="border-b border-black/5 hover:bg-black/2">
                  <td className="py-2 text-muted"><GripVertical className="h-4 w-4" /></td>
                  <td className="py-2 font-medium">{link.platform}</td>
                  <td className="py-2 text-muted truncate max-w-xs">{link.url}</td>
                  <td className="py-2">{link.sortOrder}</td>
                  <td className="py-2">
                    <span className={`text-xs ${link.isActive ? 'text-primary' : 'text-muted'}`}>
                      {link.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="py-2 text-right flex justify-end gap-2">
                    <AdminButton variant="ghost" className="h-7 w-7 p-1" onClick={() => handleEdit(link)}>
                      <Edit className="h-4 w-4" />
                    </AdminButton>
                    <AdminButton variant="ghost" className="h-7 w-7 p-1" onClick={() => { if (confirm('Delete this link?')) deleteMutation.mutate(link.id) }}>
                      <Trash className="h-4 w-4" />
                    </AdminButton>
                  </td>
                </tr>
              ))}
              {(!links || links.length === 0) && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-muted">
                    No social links yet. Add your first link.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Social Link' : 'New Social Link'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AdminSelect
            label="Platform"
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
          >
            {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
          </AdminSelect>

          <AdminInput
            label="URL"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://github.com/username"
            required
          />

          <AdminInput
            label="Icon (optional, lucide name)"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="Auto-detected from platform"
          />

          <AdminInput
            label="Sort Order"
            type="number"
            value={formData.sortOrder}
            onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
          />

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
            <label htmlFor="isActive" className="text-xs text-foreground">Active</label>
          </div>

          <div className="flex justify-end pt-4">
            <AdminButton type="submit" isLoading={saveMutation.isPending}>
              {editingId ? 'Save' : 'Create'}
            </AdminButton>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
