'use client';

import React from 'react';
import { useAudio } from './AudioContext';
import { formatDuration } from '@/lib/utils';
import { Play, Pause, RotateCcw, RotateCw, Volume2, X, Music } from 'lucide-react';

export function GlobalAudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    seek,
    skipForward,
    skipBackward,
    setVolume,
    closePlayer,
  } = useAudio();

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <aside
      aria-label="Trình phát âm thanh Phật pháp"
      className="fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))] lg:bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-md border-t border-ivory-200 dark:border-charcoal-700 shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom"
    >
      {/* Top micro progress bar for quick visual & scrubbing */}
      <div
        className="w-full h-1 bg-ivory-200 dark:bg-charcoal-700 cursor-pointer overflow-hidden group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const ratio = clickX / rect.width;
          seek(ratio * duration);
        }}
        title="Tua thanh tiến trình"
      >
        <div
          className="h-full bg-saffron-500 dark:bg-saffron-400 transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5">
        {/* Mobile Mini-Player (< md) */}
        <div className="flex md:hidden items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-lg bg-saffron-100 dark:bg-saffron-900/40 border border-saffron-200 dark:border-saffron-800/50 overflow-hidden flex-shrink-0 flex items-center justify-center">
              {currentTrack.cover_image ? (
                <img
                  src={currentTrack.cover_image}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Music className="w-5 h-5 text-saffron-600 dark:text-saffron-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-semibold text-charcoal-900 dark:text-charcoal-100 truncate">
                {currentTrack.title}
              </h4>
              <p className="text-[10px] text-charcoal-500 dark:text-charcoal-400 truncate">
                {currentTrack.speaker} • <span className="font-mono">{formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(duration || currentTrack.duration_seconds))}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => skipBackward(10)}
              className="p-2 text-charcoal-500 hover:text-charcoal-800 dark:hover:text-charcoal-200 active:scale-95 transition-all"
              title="Lùi 10 giây"
              aria-label="Lùi 10 giây"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-saffron-500 hover:bg-saffron-600 text-white flex items-center justify-center shadow-md shadow-saffron-500/20 active:scale-90 transition-all"
              aria-label={isPlaying ? 'Tạm dừng' : 'Tiếp tục phát'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button
              onClick={closePlayer}
              className="p-2 text-charcoal-400 hover:text-charcoal-700 dark:hover:text-charcoal-200 transition-colors"
              title="Đóng trình phát"
              aria-label="Đóng trình phát"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Desktop Full Player (>= md) */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-3 w-1/4">
            <div className="w-11 h-11 rounded-lg bg-saffron-100 dark:bg-saffron-900/40 border border-saffron-200 dark:border-saffron-800/50 overflow-hidden flex-shrink-0 flex items-center justify-center">
              {currentTrack.cover_image ? (
                <img
                  src={currentTrack.cover_image}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Music className="w-5 h-5 text-saffron-600 dark:text-saffron-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-semibold text-charcoal-900 dark:text-charcoal-100 truncate">
                  {currentTrack.title}
                </h4>
                {isPlaying && (
                  <div className="flex items-end gap-0.5 h-3 flex-shrink-0">
                    <span className="w-0.5 bg-saffron-500 rounded-full animate-wave" style={{ animationDelay: '0ms' }} />
                    <span className="w-0.5 bg-saffron-500 rounded-full animate-wave" style={{ animationDelay: '200ms' }} />
                    <span className="w-0.5 bg-saffron-500 rounded-full animate-wave" style={{ animationDelay: '400ms' }} />
                  </div>
                )}
              </div>
              <p className="text-[11px] text-charcoal-500 dark:text-charcoal-400 truncate">
                {currentTrack.speaker}
              </p>
            </div>
          </div>

          {/* Playback Controls & Progress Bar */}
          <div className="flex flex-col items-center gap-1.5 w-2/4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => skipBackward(10)}
                className="text-charcoal-500 hover:text-charcoal-800 dark:hover:text-charcoal-200 transition-colors p-1"
                title="Lùi 10 giây"
                aria-label="Lùi 10 giây"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-saffron-500 hover:bg-saffron-600 text-white flex items-center justify-center shadow-md shadow-saffron-500/20 active:scale-95 transition-all"
                aria-label={isPlaying ? 'Tạm dừng' : 'Tiếp tục phát'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={() => skipForward(10)}
                className="text-charcoal-500 hover:text-charcoal-800 dark:hover:text-charcoal-200 transition-colors p-1"
                title="Tua tới 10 giây"
                aria-label="Tua tới 10 giây"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 w-full">
              <span className="text-[10px] text-charcoal-400 dark:text-charcoal-500 w-8 text-right font-mono">
                {formatDuration(Math.floor(currentTime))}
              </span>
              <div
                className="relative flex-1 h-1.5 bg-ivory-200 dark:bg-charcoal-700 rounded-full cursor-pointer overflow-hidden group"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = clickX / rect.width;
                  seek(ratio * duration);
                }}
              >
                <div
                  className="h-full bg-saffron-500 dark:bg-saffron-400 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-charcoal-400 dark:text-charcoal-500 w-8 font-mono">
                {formatDuration(Math.floor(duration || currentTrack.duration_seconds))}
              </span>
            </div>
          </div>

          {/* Volume & Close */}
          <div className="flex items-center justify-end gap-3 w-1/4">
            <div className="flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-charcoal-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 h-1 accent-saffron-500 cursor-pointer"
                aria-label="Âm lượng"
              />
            </div>

            <button
              onClick={closePlayer}
              className="p-1.5 text-charcoal-400 hover:text-charcoal-700 dark:hover:text-charcoal-200 rounded-lg hover:bg-ivory-100 dark:hover:bg-charcoal-800 transition-colors"
              title="Đóng trình phát"
              aria-label="Đóng trình phát"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
