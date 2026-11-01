'use client';

import React, { useState } from 'react';
import { BookItem } from './types';
import { BookReaderModal } from './BookReaderModal';
import { Button } from '@/components/ui/Button';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DirectReaderLauncherProps {
  book: BookItem;
  className?: string;
}

export function DirectReaderLauncher({ book, className }: DirectReaderLauncherProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="primary"
        size="lg"
        onClick={() => setOpen(true)}
        className={cn('w-full sm:w-auto gap-2 shadow-md hover:scale-102 transition-transform', className)}
      >
        <BookOpen className="w-4 h-4" />
        Đọc sách từng trang ngay
      </Button>
      <BookReaderModal book={book} isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default DirectReaderLauncher;
