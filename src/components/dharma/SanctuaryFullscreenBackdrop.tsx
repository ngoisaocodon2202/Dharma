'use client';

import React from 'react';

interface SanctuaryFullscreenBackdropProps {
  /** 9:16 portrait artwork path for mobile viewports */
  mobileSrc: string;
  /** 16:9 landscape artwork path for tablet/desktop viewports */
  desktopSrc: string;
  /** Accessible description of the deity artwork */
  alt: string;
}

/**
 * Renders a seamless edge-to-edge sacred silk-painting backdrop that adapts
 * aspect ratio between vertical mobile screens and panoramic desktops while
 * preserving legibility for the translucent header and bottom prayer stream.
 */
export function SanctuaryFullscreenBackdrop({
  mobileSrc,
  desktopSrc,
  alt,
}: SanctuaryFullscreenBackdropProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#FAF5E6]"
      aria-hidden="true"
    >
      <picture className="block w-full h-full">
        <source media="(min-width: 768px)" srcSet={desktopSrc} />
        <img
          src={mobileSrc}
          alt={alt}
          className="w-full h-full object-cover object-top md:object-center select-none"
        />
      </picture>
      {/* Keep the middle figure crisp while softening top bar & lower prayer-stream edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF5E6]/35 via-transparent via-40% to-[#FAF5E6]/60" />
    </div>
  );
}

