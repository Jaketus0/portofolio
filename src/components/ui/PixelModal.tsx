import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PixelWindow } from './PixelWindow';
import { cn } from '../../lib/utils';

interface PixelModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function PixelModal({ isOpen, onClose, title, children, className }: PixelModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-lg animate-in zoom-in-95 duration-200">
        <PixelWindow title={title} onClose={onClose} className={cn("w-full shadow-[16px_16px_0_0_rgba(0,0,0,0.8)]", className)}>
          {children}
        </PixelWindow>
      </div>
    </div>,
    document.body
  );
}
