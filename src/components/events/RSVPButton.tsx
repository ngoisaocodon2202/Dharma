'use client';

import React, { useState, useEffect } from 'react';
import { CalendarCheck, CalendarX, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { cn } from '@/lib/utils';

interface Props {
  eventSlug: string;
  maxAttendees?: number;
  currentCount?: number;
  className?: string;
}

export function RSVPButton({ eventSlug, maxAttendees, currentCount = 0, className }: Props) {
  const { user, openAuthModal } = useAuth();
  const [registered, setRegistered] = useState(false);
  const [count, setCount] = useState(currentCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isFull, setIsFull] = useState(maxAttendees ? currentCount >= maxAttendees : false);

  const handleClick = async () => {
    if (!user) { openAuthModal(); return; }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/events/${eventSlug}/rsvp`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setRegistered(data.registered);
        setCount(prev => data.registered ? prev + 1 : Math.max(0, prev - 1));
        if (maxAttendees) {
          setIsFull(data.registered && count + 1 >= maxAttendees);
        }
      } else if (res.status === 409) {
        setIsFull(true);
      }
    } catch {}
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || (isFull && !registered)}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-60 select-none active:scale-95',
        registered
          ? 'bg-jade-50 dark:bg-jade-950/40 border border-jade-300 dark:border-jade-700 text-jade-700 dark:text-jade-300 hover:bg-jade-100'
          : isFull
          ? 'bg-ivory-100 dark:bg-charcoal-700 border border-ivory-300 dark:border-charcoal-600 text-charcoal-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-lotus-500 to-lotus-600 text-white hover:from-lotus-600 hover:to-lotus-700 shadow-sm hover:shadow-md hover:shadow-lotus-500/20 hover:-translate-y-0.5',
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
      ) : registered ? (
        <CalendarCheck className="w-4 h-4 flex-shrink-0" />
      ) : (
        <CalendarX className="w-4 h-4 flex-shrink-0" />
      )}
      <span>
        {isLoading ? 'Đang xử lý...' : registered ? 'Đã đăng ký' : isFull ? 'Đã đủ chỗ' : 'Đăng ký tham gia'}
      </span>
      {maxAttendees && !isLoading && (
        <span className="text-[11px] opacity-60 font-mono">
          {count}/{maxAttendees}
        </span>
      )}
    </button>
  );
}
