'use client';

import React from 'react';
import { useAuth } from '../../providers/auth-provider';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-foreground" />
          <p className="text-sm text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-base">
      <AdminSidebar />
      <main className="pl-64">
        <div className="p-8 pb-24">
          {children}
        </div>
      </main>
    </div>
  );
}
