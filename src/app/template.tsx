'use client';

import React from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-in-up transition-all duration-600 ease-out will-change-transform">
      {children}
    </div>
  );
}
