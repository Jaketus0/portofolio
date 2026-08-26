'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/api';
import { AdminCard } from '../../../components/ui/AdminCard';
import { ActivityLog } from '../../../types';
import { cn } from '../../../lib/utils';
import { User } from 'lucide-react';

const ACTION_COLORS: Record<string, string> = {
  CREATE: 'text-emerald-600 bg-emerald-50',
  UPDATE: 'text-blue-600 bg-blue-50',
  DELETE: 'text-red-600 bg-red-50',
};

export default function ActivityLogPage() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['admin-activity-log'],
    queryFn: async () => {
      const { data } = await api.get('/activity-log?limit=100');
      return data.data as ActivityLog[];
    },
  });

  if (isLoading) return <div className="text-sm text-muted">Loading...</div>;

  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Activity Log</h1>

      <AdminCard>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/5">
                <th className="pb-2">Admin</th>
                <th className="pb-2">Action</th>
                <th className="pb-2">Entity</th>
                <th className="pb-2">Entity ID</th>
                <th className="pb-2 text-right">Time</th>
              </tr>
            </thead>
            <tbody>
              {logs?.map((log) => (
                <tr key={log.id} className="border-b border-black/5 hover:bg-black/2">
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      {log.admin.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={log.admin.avatar} alt="" className="h-6 w-6 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black/5">
                          <User className="h-3 w-3 text-muted" />
                        </div>
                      )}
                      <span className="text-xs">{log.admin.name}</span>
                    </div>
                  </td>
                  <td className="py-2">
                    <span className={cn('inline-block rounded px-2 py-0.5 text-xs font-medium', ACTION_COLORS[log.action] || 'text-muted bg-black/5')}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2 text-muted">{log.entity}</td>
                  <td className="py-2 font-mono text-xs text-muted">{log.entityId || '—'}</td>
                  <td className="py-2 text-right text-xs text-muted">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {(!logs || logs.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted">
                    No activity recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
