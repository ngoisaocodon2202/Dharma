'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 w-screen h-[100dvh] z-[99999] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      <header className="px-4 py-3 bg-[#FFFDF8] border-b border-[#EAD7A7] flex items-center justify-between gap-3 shrink-0 shadow-xs">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] hover:border-[#8C5500] text-xs font-bold text-[#8C5500] cursor-pointer shrink-0"
          aria-label="Quay lại"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>

        {title && (
          <div className="min-w-0 flex-1 text-center">
            <h3 className="font-heading font-serif text-base sm:text-lg font-bold text-[#2C1E10] truncate">
              {title}
            </h3>
            {description && (
              <p className="text-[11px] text-[#6B533B] truncate">{description}</p>
            )}
          </div>
        )}

        <div className="w-20 shrink-0" />
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-3xl mx-auto w-full">
        {children}
      </div>
    </div>,
    document.body
  );
}
