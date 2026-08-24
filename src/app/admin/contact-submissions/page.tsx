'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api';
import { AdminCard } from '../../../components/ui/AdminCard';
import { AdminButton } from '../../../components/ui/AdminButton';
import { ContactSubmission, SubmissionStatus } from '../../../types';
import { formatDate } from '../../../lib/utils';
import { Check, Archive, RotateCcw, Trash } from 'lucide-react';

export default function ContactSubmissionsAdminPage() {
  const queryClient = useQueryClient();

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['admin-contact-submissions'],
    queryFn: async () => {
      const { data } = await api.get('/contact-submissions');
      return data.data as ContactSubmission[];
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: SubmissionStatus }) =>
      api.put(`/contact-submissions/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-contact-submissions'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/contact-submissions/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-contact-submissions'] }),
  });

  if (isLoading) return <div className="text-sm text-muted">Loading...</div>;

  return (
    <div className="max-w-6xl space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Contact Submissions</h1>

      {(!submissions || submissions.length === 0) && (
        <AdminCard>
          <p className="p-4 text-sm text-muted">
            No contact submissions yet.
          </p>
        </AdminCard>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {submissions?.map((item) => (
          <AdminCard
            key={item.id}
            title={`${item.fullName} - ${formatDate(item.createdAt)}`}
            className="flex flex-col"
          >
            <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted">Phone:</span> {item.phone}
              </div>
              <div>
                <span className="text-muted">Email:</span> {item.email}
              </div>
            </div>
            <p className="flex-grow mb-4 text-sm text-foreground whitespace-pre-wrap">
              {item.message}
            </p>

            <div className="pt-4 border-t border-black/5 flex justify-between items-center">
              <span className={`text-xs ${
                item.status === 'PENDING'
                  ? 'text-accent'
                  : item.status === 'READ'
                  ? 'text-primary'
                  : 'text-danger'
              }`}>
                [{item.status}]
              </span>

              <div className="flex gap-2">
                {item.status !== 'READ' && (
                  <AdminButton variant="ghost" className="h-7 w-7 p-1" onClick={() => statusMutation.mutate({ id: item.id, status: 'READ' })}>
                    <Check className="h-4 w-4" />
                  </AdminButton>
                )}
                <AdminButton variant="ghost" className="h-7 w-7 p-1" onClick={() => statusMutation.mutate({ id: item.id, status: 'ARCHIVED' })}>
                  <Archive className="h-4 w-4" />
                </AdminButton>
                <AdminButton variant="ghost" className="h-7 w-7 p-1" onClick={() => statusMutation.mutate({ id: item.id, status: 'PENDING' })}>
                  <RotateCcw className="h-4 w-4" />
                </AdminButton>
                <AdminButton variant="ghost" className="h-7 w-7 p-1" onClick={() => { if (confirm('Delete submission?')) deleteMutation.mutate(item.id) }}>
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
