'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  direction?: 'up' | 'down' | 'none';
  distance?: number;
  durationMs?: number;
}

export function ScrollReveal({
  children,
  className,
  delayMs = 0,
  direction = 'up',
  distance = 24,
  durationMs = 600,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If SSR or reduced motion preferred, reveal immediately
    if (typeof window === 'undefined') {
      setIsVisible(true);
      return;
    }

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const elem = domRef.current;
    if (!elem) {
      setIsVisible(true);
      return;
    }

    // Check if already in or near viewport on mount
    const rect = elem.getBoundingClientRect();
    if (rect.top < window.innerHeight + 150) {
      setIsVisible(true);
      return;
    }

    // If IntersectionObserver is not supported, reveal immediately
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '150px 0px 150px 0px',
      }
    );

    observer.observe(elem);

    // Failsafe timer: guarantee that content is never stuck in opacity: 0
    const failsafeTimer = setTimeout(() => {
      setIsVisible(true);
    }, 600 + delayMs);

    return () => {
      clearTimeout(failsafeTimer);
      if (elem) {
        observer.unobserve(elem);
      }
    };
  }, [delayMs]);

  const getTransform = () => {
    if (isVisible) return 'none';
    if (direction === 'up') return `translate3d(0, ${distance}px, 0)`;
    if (direction === 'down') return `translate3d(0, -${distance}px, 0)`;
    return 'none';
  };

  return (
    <div
      ref={domRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
        willChange: isVisible ? 'auto' : 'opacity, transform',
      }}
      className={cn('w-full', className)}
    >
      {children}
    </div>
  );
}
