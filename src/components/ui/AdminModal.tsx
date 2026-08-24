import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AdminCard } from './AdminCard';
import { cn } from '../../lib/utils';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function AdminModal({ isOpen, onClose, title, children, className }: AdminModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg animate-in zoom-in-95 duration-200">
        <AdminCard title={title} onClose={onClose} className={cn("w-full shadow-lg", className)}>
          {children}
        </AdminCard>
      </div>
    </div>,
    document.body
  );
}

AdminModal.displayName = 'AdminModal';