'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api';
import { AdminCard } from '../../../components/ui/AdminCard';
import { AdminButton } from '../../../components/ui/AdminButton';
import { GuestMessage } from '../../../types';
import { formatDate } from '../../../lib/utils';
import { Check, X, EyeOff, Pin, Trash } from 'lucide-react';

export default function MessagesAdminPage() {
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['admin-messages-all'],
    queryFn: async () => {
      const { data } = await api.get('/messages');
      return data.data as GuestMessage[];
    },
  });

  const actionMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string, action: 'approve' | 'hide' | 'pin' | 'unpin' | 'delete' }) => {
      if (action === 'delete') {
          return api.delete(`/messages/${id}`);
      }
      return api.put(`/messages/${id}/${action}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages-all'] });
    },
  });

  if (isLoading) return <div className="text-sm text-muted">Loading...</div>;

  return (
    <div className="max-w-6xl space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Guestbook Messages</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {messages?.map((msg) => (
          <AdminCard key={msg.id} title={`${msg.name} - ${formatDate(msg.createdAt)}`} className="flex flex-col">
            {msg.pinned && (
              <div className="absolute -top-2 -right-2 z-10 text-primary">
                <Pin className="h-5 w-5 fill-current transform rotate-45" />
              </div>
            )}

            <div className="flex-grow mb-4">
              <p className="text-sm text-foreground whitespace-pre-wrap">{msg.message}</p>
            </div>

            <div className="pt-4 border-t border-black/5 flex justify-between items-center">
              <span className={`text-xs ${
                msg.status === 'PENDING' ? 'text-accent' : 
                msg.status === 'APPROVED' ? 'text-primary' : 'text-danger'
              }`}>
                [{msg.status}]
              </span>

              <div className="flex gap-2">
                {msg.status !== 'APPROVED' && (
                  <AdminButton variant="ghost" className="h-7 w-7 p-1" onClick={() => actionMutation.mutate({ id: msg.id, action: 'approve' })}>
                    <Check className="h-4 w-4" />
                  </AdminButton>
                )}
                {msg.status !== 'HIDDEN' && (
                  <AdminButton variant="ghost" className="h-7 w-7 p-1" onClick={() => actionMutation.mutate({ id: msg.id, action: 'hide' })}>
                    <EyeOff className="h-4 w-4" />
                  </AdminButton>
                )}
                <AdminButton variant="ghost" className="h-7 w-7 p-1" onClick={() => actionMutation.mutate({ id: msg.id, action: msg.pinned ? 'unpin' : 'pin' })}>
                  <Pin className={`h-4 w-4 ${msg.pinned ? 'text-muted' : 'text-primary'}`} />
                </AdminButton>
                <AdminButton variant="ghost" className="h-7 w-7 p-1" onClick={() => { if (confirm('Delete message?')) actionMutation.mutate({ id: msg.id, action: 'delete' }) }}>
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
