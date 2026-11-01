'use client';

import React from 'react';
import { useAudio, AudioTrack } from '@/components/audio/AudioContext';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AudioPlayButton({
  track,
  size = 'md',
  className,
}: {
  track: AudioTrack;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const isThisTrackPlaying = currentTrack?.id === track.id && isPlaying;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track);
    }
  };

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      onClick={handleClick}
      aria-label={isThisTrackPlaying ? `Tạm dừng ${track.title}` : `Phát ${track.title}`}
      className={cn(
        'rounded-full bg-saffron-500 hover:bg-saffron-600 text-white flex items-center justify-center shadow-md shadow-saffron-500/25 transition-all duration-200 active:scale-95 flex-shrink-0 cursor-pointer',
        sizes[size],
        className
      )}
    >
      {isThisTrackPlaying ? (
        <Pause className={iconSizes[size]} />
      ) : (
        <Play className={cn(iconSizes[size], 'ml-0.5')} />
      )}
    </button>
  );
}
