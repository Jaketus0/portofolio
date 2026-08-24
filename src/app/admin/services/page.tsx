'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api';
import { AdminCard } from '../../../components/ui/AdminCard';
import { AdminButton } from '../../../components/ui/AdminButton';
import { AdminInput } from '../../../components/ui/AdminInput';
import { AdminTextarea } from '../../../components/ui/AdminTextarea';
import { AdminSelect } from '../../../components/ui/AdminSelect';
import { AdminModal } from '../../../components/ui/AdminModal';
import { Service } from '../../../types';
import { SERVICE_ICONS } from '../../../lib/constants';
import { Trash, Edit } from 'lucide-react';

export default function ServicesAdminPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    shortDesc: '',
    icon: 'Code2',
    sortOrder: 0,
    isActive: true,
  });

  const { data: services, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const { data } = await api.get('/services/admin');
      return data.data as Service[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: Partial<Service>) => {
      if (editingId) {
        return api.put(`/services/${editingId}`, payload);
      }
      return api.post('/services', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ title: '', shortDesc: '', icon: 'Code2', sortOrder: 0, isActive: true });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/services/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-services'] }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.shortDesc) return;
    saveMutation.mutate(formData);
  };

  const handleEdit = (service: Service) => {
    setFormData(service);
    setEditingId(service.id);
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="text-sm text-muted">Loading...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Services</h1>
        <AdminButton
          onClick={() => {
            setFormData({ title: '', shortDesc: '', icon: 'Code2', sortOrder: 0, isActive: true });
            setEditingId(null);
            setIsModalOpen(true);
          }}
        >
          + Add Service
        </AdminButton>
      </div>

      <AdminCard>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/5">
                <th className="pb-2">Title</th>
                <th className="pb-2">Icon</th>
                <th className="pb-2">Order</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services?.map((service) => (
                <tr key={service.id} className="border-b border-black/5 hover:bg-black/2">
                  <td className="py-2">{service.title}</td>
                  <td className="py-2 text-primary">{service.icon}</td>
                  <td className="py-2">{service.sortOrder}</td>
                  <td className="py-2">
                    <span className={`text-xs ${service.isActive ? 'text-primary' : 'text-muted'}`}>
                      {service.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="py-2 text-right flex justify-end gap-2">
                    <AdminButton variant="ghost" className="h-7 w-7 p-1" onClick={() => handleEdit(service)}>
                      <Edit className="h-4 w-4" />
                    </AdminButton>
                    <AdminButton variant="ghost" className="h-7 w-7 p-1" onClick={() => { if (confirm('Are you sure?')) deleteMutation.mutate(service.id) }}>
                      <Trash className="h-4 w-4" />
                    </AdminButton>
                  </td>
                </tr>
              ))}
              {(!services || services.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted">
                    No services yet. Add your first service.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Service' : 'New Service'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AdminInput
            label="Service Title"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <AdminTextarea
            label="Short Description"
            value={formData.shortDesc || ''}
            onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
            rows={3}
            required
          />

          <AdminSelect
            label="Icon"
            value={formData.icon || 'Code2'}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          >
            {SERVICE_ICONS.map((icon) => (
              <option key={icon} value={icon}>{icon}</option>
            ))}
          </AdminSelect>

          <AdminInput
            label="Sort Order"
            type="number"
            value={formData.sortOrder || 0}
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
