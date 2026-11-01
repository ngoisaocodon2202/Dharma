'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { cn } from '@/lib/utils';

interface Props {
  entityType: 'ARTICLE' | 'AUDIO' | 'VIDEO' | 'TEMPLE' | 'BOOK';
  entityId: string;
  className?: string;
  showLabel?: boolean;
}

export function BookmarkButton({ entityType, entityId, className, showLabel = true }: Props) {
  const { user, openAuthModal } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check initial bookmark status when user is known
  useEffect(() => {
    if (!user) { setBookmarked(false); return; }
    fetch(`/api/bookmarks?type=${entityType}`)
      .then(r => r.json())
      .then(d => {
        const found = (d.bookmarks || []).some((b: any) => b.entity_id === entityId);
        setBookmarked(found);
      })
      .catch(() => {});
  }, [user, entityType, entityId]);

  const handleToggle = async () => {
    if (!user) { openAuthModal(); return; }
    setIsLoading(true);
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_type: entityType, entity_id: entityId }),
      });
      if (res.ok) {
        const data = await res.json();
        setBookmarked(data.bookmarked);
      }
    } catch {}
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      title={bookmarked ? 'Bỏ lưu' : 'Lưu bài'}
      className={cn(
        'group inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all duration-200 disabled:opacity-50 select-none active:scale-95',
        bookmarked
          ? 'border-saffron-300 dark:border-saffron-700 bg-saffron-50 dark:bg-saffron-950/40 text-saffron-700 dark:text-saffron-400'
          : 'border-ivory-300 dark:border-charcoal-600 bg-white/80 dark:bg-charcoal-800/80 text-charcoal-600 dark:text-charcoal-400 hover:border-saffron-300 hover:text-saffron-700 dark:hover:text-saffron-400 hover:bg-saffron-50/50',
        className
      )}
    >
      {bookmarked ? (
        <BookmarkCheck className="w-3.5 h-3.5 text-saffron-500 flex-shrink-0" />
      ) : (
        <Bookmark className="w-3.5 h-3.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
      )}
      {showLabel && <span>{bookmarked ? 'Đã lưu' : 'Lưu bài'}</span>}
    </button>
  );
}
