'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../providers/auth-provider';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  User,
  Briefcase,
  Wrench,
  Code2,
  MessageSquare,
  Image as ImageIcon,
  Send,
  Settings,
  LogOut,
  Mail,
  Link2,
  Activity,
  FileText,
} from 'lucide-react';

const MENU_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/hero', label: 'Hero / Profile', icon: User },
  { href: '/admin/social-links', label: 'Social Links', icon: Link2 },
  { href: '/admin/services', label: 'Services', icon: Wrench },
  { href: '/admin/cv', label: 'CV / Resume', icon: FileText },
  { href: '/admin/projects', label: 'Projects', icon: Briefcase },
  { href: '/admin/contact', label: 'Contact Info', icon: Mail },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/contact-submissions', label: 'Contact Form', icon: Send },
  { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
  { href: '/admin/activity-log', label: 'Activity Log', icon: Activity },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-black/5 bg-white">
      <div className="flex h-16 items-center justify-center border-b border-black/5">
        <span className="text-sm font-semibold tracking-[0.2em] text-foreground">
          VIA CMS
        </span>
      </div>

      <div className="p-4">
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-black/5 bg-black/2 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-white">
            <User className="h-4 w-4" />
          </div>
          <div className="overflow-hidden">
            <p className="truncate text-xs font-medium text-foreground">{user?.email || 'Admin'}</p>
            <p className="text-xs text-muted">Administrator</p>
          </div>
        </div>

        <nav className="space-y-1">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'rounded-lg bg-black/5 text-foreground font-medium'
                    : 'text-muted hover:text-foreground hover:bg-black/2 rounded-lg'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-black/5 p-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2 text-sm text-danger transition-colors hover:bg-danger/5 rounded-lg"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
