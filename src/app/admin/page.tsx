'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { AdminCard } from '../../components/ui/AdminCard';
import { AdminButton } from '../../components/ui/AdminButton';
import { useSocket } from '../../providers/socket-provider';
import { Users, Eye, MousePointerClick, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { onlineVisitors } = useSocket();

  const { data: statsData, isLoading } = useQuery({
    queryKey: ['visitor-stats'],
    queryFn: async () => {
      const { data } = await api.get('/visitors/stats');
      return data.data;
    },
  });

  const { data: messagesData } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: async () => {
      const { data } = await api.get('/messages');
      return data.data;
    },
  });

  if (isLoading) {
    return <div className="text-sm text-muted">Loading...</div>;
  }

  const pendingMessages = messagesData?.filter((m: any) => m.status === 'PENDING').length || 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <div className="flex items-center gap-2 rounded-full border border-black/5 bg-black/2 px-3 py-1.5">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-muted">{onlineVisitors} online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Visitors"
          value={statsData?.total || 0}
          icon={<Users className="h-7 w-7 text-black" />}
        />
        <StatCard
          title="Today's Visits"
          value={statsData?.today || 0}
          icon={<Eye className="h-7 w-7 text-black" />}
        />
        <StatCard
          title="This Month"
          value={statsData?.monthly || 0}
          icon={<MousePointerClick className="h-7 w-7 text-black" />}
        />
        <StatCard
          title="Pending Msgs"
          value={pendingMessages}
          icon={<MessageSquare className="h-7 w-7 text-danger" />}
          alert={pendingMessages > 0}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AdminCard title="Recent Activity" className="min-h-[300px]">
          <div className="flex h-full flex-col items-center justify-center text-center text-muted">
            <p className="text-sm">No recent activity</p>
          </div>
        </AdminCard>

        <AdminCard title="Quick Actions" className="min-h-[300px]">
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/projects/new">
              <AdminButton variant="secondary" className="h-28 w-full flex-col py-4">
                <span className="text-xs">New Project</span>
              </AdminButton>
            </Link>
            <Link href="/admin/messages">
              <AdminButton variant="secondary" className="h-28 w-full flex-col py-4">
                <span className="text-xs">Check Inbox</span>
              </AdminButton>
            </Link>
            <Link href="/admin/settings">
              <AdminButton variant="secondary" className="h-28 w-full flex-col py-4">
                <span className="text-xs">Settings</span>
              </AdminButton>
            </Link>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, alert }: { title: string; value: number; icon: React.ReactNode; alert?: boolean }) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl border bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex flex-col justify-between h-36", alert && "border-danger")}>
      {alert && <div className="absolute top-0 right-0 h-8 w-8 bg-danger" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />}
      <div className="flex justify-between items-start">
        <h3 className="text-xs text-muted uppercase leading-relaxed max-w-[60%]">{title}</h3>
        {icon}
      </div>
      <div className="text-3xl font-medium text-foreground">{value}</div>
    </div>
  );
}
