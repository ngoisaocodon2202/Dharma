'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Volume2,
  VolumeX,
  Music2,
  Film,
  Sparkles,
} from 'lucide-react';
import {
  MEDITATION_MEDIA_TRACKS,
  MeditationTrack,
  formatMediaTime,
} from '@/data/meditationMusicTracks';
import { cn } from '@/lib/utils';

type MediaFilter = 'all' | 'mp3' | 'mp4';

interface MeditationMediaPlayerProps {
  /** Callback invoked when the user switches to a track with a recommended Hz layer. */
  onRecommendedHz?: (hzMode: '432' | '528' | 'om') => void;
  /** Incrementing this counter externally pauses playback cleanly. */
  stopSignal?: number;
}

/**
 * Native .MP3 & .MP4 relaxing meditation and instrumental music player.
 */
export default function MeditationMediaPlayer({
  onRecommendedHz,
  stopSignal = 0,
}: MeditationMediaPlayerProps) {
  const [filter, setFilter] = useState<MediaFilter>('all');
  const [activeTrackId, setActiveTrackId] = useState<string>(MEDITATION_MEDIA_TRACKS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number>(MEDITATION_MEDIA_TRACKS[0].durationSec);
  const [isLoop, setIsLoop] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pendingAutoPlayRef = useRef(false);

  const activeIndex = Math.max(
    0,
    MEDITATION_MEDIA_TRACKS.findIndex((t) => t.id === activeTrackId)
  );
  const activeTrack: MeditationTrack = MEDITATION_MEDIA_TRACKS[activeIndex] ?? MEDITATION_MEDIA_TRACKS[0];

  const visibleTracks = MEDITATION_MEDIA_TRACKS.filter((t) =>
    filter === 'all' ? true : t.format === filter
  );

  const getMediaEl = useCallback((): HTMLMediaElement | null => {
    return activeTrack.format === 'mp4' ? videoRef.current : audioRef.current;
  }, [activeTrack.format]);

  const stopAllMedia = useCallback(() => {
    [audioRef.current, videoRef.current].forEach((el) => {
      if (!el) return;
      try {
        el.pause();
        el.currentTime = 0;
      } catch {
        // Ignore DOM cleanup errors during unmount
      }
    });
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  useEffect(() => {
    return () => {
      stopAllMedia();
    };
  }, [stopAllMedia]);

  useEffect(() => {
    if (stopSignal > 0) {
      stopAllMedia();
    }
  }, [stopSignal, stopAllMedia]);

  useEffect(() => {
    const el = getMediaEl();
    if (!el) return;
    el.volume = isMuted ? 0 : volume;
  }, [volume, isMuted, activeTrack.id, getMediaEl]);

  useEffect(() => {
    const el = getMediaEl();
    if (!el) return;
    if (pendingAutoPlayRef.current) {
      pendingAutoPlayRef.current = false;
      el.volume = isMuted ? 0 : volume;
      el.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [activeTrack.id, getMediaEl, isMuted, volume]);

  const selectTrack = (track: MeditationTrack, shouldPlay = true) => {
    if (track.id === activeTrack.id) {
      togglePlayPause();
      return;
    }
    [audioRef.current, videoRef.current].forEach((el) => {
      if (!el) return;
      try {
        el.pause();
      } catch {
        // Ignore pause error
      }
    });
    pendingAutoPlayRef.current = shouldPlay;
    setActiveTrackId(track.id);
    setCurrentTime(0);
    setDuration(track.durationSec);
    setIsPlaying(false);
    onRecommendedHz?.(track.recommendedHz);
  };

  const togglePlayPause = () => {
    const el = getMediaEl();
    if (!el) return;
    if (el.paused) {
      el.volume = isMuted ? 0 : volume;
      el.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      el.pause();
      setIsPlaying(false);
    }
  };

  const stepTrack = (direction: 1 | -1) => {
    const list = visibleTracks.length > 0 ? visibleTracks : MEDITATION_MEDIA_TRACKS;
    const idxInVisible = list.findIndex((t) => t.id === activeTrack.id);
    const nextIdx =
      idxInVisible === -1
        ? 0
        : (idxInVisible + direction + list.length) % list.length;
    selectTrack(list[nextIdx], true);
  };

  const handleEnded = () => {
    if (isLoop) return;
    stepTrack(1);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextTime = Number(e.target.value);
    const el = getMediaEl();
    if (el && Number.isFinite(nextTime)) {
      el.currentTime = nextTime;
      setCurrentTime(nextTime);
    }
  };

  const mp3Count = MEDITATION_MEDIA_TRACKS.filter((t) => t.format === 'mp3').length;
  const mp4Count = MEDITATION_MEDIA_TRACKS.filter((t) => t.format === 'mp4').length;
  const safeDuration = duration > 0 ? duration : activeTrack.durationSec;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7]/50 space-y-4 shadow-2xs">
      {/* Header & Filter Pills */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C5500] inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Kho Nhạc Thiền Thư Giãn &amp; Không Lời
            </span>
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#2C1E10] mt-0.5 leading-snug">
              {activeTrack.title}
            </h3>
            <p className="text-xs text-[#6B533B] mt-0.5">{activeTrack.subtitle}</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#FFF6DF] text-[#8C5500] text-[10px] font-bold uppercase whitespace-nowrap shrink-0">
            .{activeTrack.format}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 pb-0.5">
          {[
            { id: 'all' as const, label: `Tất cả (${MEDITATION_MEDIA_TRACKS.length})` },
            { id: 'mp3' as const, label: `.MP3 (${mp3Count})` },
            { id: 'mp4' as const, label: `Video .MP4 (${mp4Count})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={cn(
                'px-2 py-1.5 rounded-full text-[11px] font-bold text-center whitespace-nowrap cursor-pointer transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D9A02E]',
                filter === tab.id
                  ? 'bg-[#FFE07D] text-[#3D2505] shadow-2xs'
                  : 'bg-[#FAF7F0] text-[#6B533B] hover:bg-[#FFF6DF]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stage: Real MP4 Video OR Calm MP3 Cover + Audio */}
      {activeTrack.format === 'mp4' ? (
        <div className="rounded-2xl overflow-hidden bg-[#1D150C] aspect-video">
          <video
            ref={videoRef}
            key={activeTrack.id}
            src={activeTrack.src}
            poster={activeTrack.coverImage}
            controls
            playsInline
            loop={isLoop}
            preload="metadata"
            onLoadedMetadata={(e) => {
              const d = e.currentTarget.duration;
              if (Number.isFinite(d) && d > 0) setDuration(d);
            }}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={handleEnded}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="relative h-40 sm:h-48 rounded-2xl overflow-hidden bg-[#FAF5E6]">
          <img
            src={activeTrack.coverImage}
            alt={activeTrack.title}
            className={cn(
              'w-full h-full object-cover transition-transform duration-1000',
              isPlaying ? 'scale-105' : 'scale-100'
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#241608]/80 via-[#241608]/25 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-xs text-[#FFE7A3] text-[10px] font-bold flex items-center gap-1 whitespace-nowrap">
              <Music2 className="w-3 h-3" />
              {activeTrack.instrumentLabel}
            </span>
          </div>
          {isPlaying && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-600/90 text-white text-[10px] font-bold flex items-center gap-1 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              Đang phát êm dịu
            </div>
          )}
          <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
            <div className="font-serif font-bold text-sm sm:text-base line-clamp-1">
              {activeTrack.title}
            </div>
            <div className="text-[11px] text-white/80 line-clamp-1 mt-0.5">
              Âm thanh thuần khiết không lời • Thời lượng {activeTrack.durationLabel}
            </div>
          </div>

          <audio
            ref={audioRef}
            key={activeTrack.id}
            src={activeTrack.src}
            loop={isLoop}
            preload="metadata"
            onLoadedMetadata={(e) => {
              const d = e.currentTarget.duration;
              if (Number.isFinite(d) && d > 0) setDuration(d);
            }}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={handleEnded}
          />
        </div>
      )}

      {/* Scrubber & Transport Controls */}
      <div className="space-y-2.5 px-0.5">
        <div className="flex items-center gap-2.5 text-[11px] font-mono text-[#6B533B]">
          <span className="w-10 text-left tabular-nums">{formatMediaTime(currentTime)}</span>
          <input
            type="range"
            aria-label="Thanh tua nhạc thiền"
            min={0}
            max={safeDuration}
            step={0.5}
            value={Math.min(currentTime, safeDuration)}
            onChange={handleSeek}
            className="flex-1 h-1.5 accent-[#D9A02E] bg-[#EAD7A7]/60 rounded-full cursor-pointer"
          />
          <span className="w-10 text-right tabular-nums">{formatMediaTime(safeDuration)}</span>
        </div>

        <div className="flex items-center justify-between gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => setIsLoop((prev) => !prev)}
            title={isLoop ? 'Đang lặp lại 1 bài' : 'Tự chuyển bài tiếp theo'}
            className={cn(
              'px-2.5 py-2 rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D9A02E]',
              isLoop
                ? 'bg-[#FFF6DF] text-[#8C5500]'
                : 'bg-[#FAF7F0] text-[#7A6248] hover:bg-[#FFF6DF]'
            )}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>{isLoop ? 'Lặp 1 bài' : 'Tự chuyển'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => stepTrack(-1)}
              aria-label="Bài trước"
              className="p-2 rounded-full bg-[#FAF7F0] text-[#5C442C] hover:bg-[#FFF6DF] cursor-pointer transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D9A02E]"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={togglePlayPause}
              className={cn(
                'px-4 py-2 rounded-full font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-all shadow-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D9A02E]',
                isPlaying
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-[#FFE07D] via-[#F5C542] to-[#E5A91C] text-[#3D2505]'
              )}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Tạm Dừng' : 'Phát Nhạc'}</span>
            </button>

            <button
              type="button"
              onClick={() => stepTrack(1)}
              aria-label="Bài tiếp theo"
              className="p-2 rounded-full bg-[#FAF7F0] text-[#5C442C] hover:bg-[#FFF6DF] cursor-pointer transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D9A02E]"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Fine volume row with mute toggle */}
        <div className="flex items-center justify-between gap-2 text-[11px] text-[#7A6248]">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setIsMuted((prev) => !prev)}
              aria-label={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
              className="p-1.5 rounded-lg bg-[#FAF7F0] text-[#6B533B] hover:bg-[#FFF6DF] cursor-pointer transition-colors shrink-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D9A02E]"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <span className="whitespace-nowrap">Âm lượng:</span>
            <input
              type="range"
              aria-label="Âm lượng nhạc thiền"
              min={0.1}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const v = Number(e.target.value);
                setVolume(v);
                setIsMuted(v === 0);
              }}
              className="flex-1 max-w-40 h-1 accent-[#D9A02E] bg-[#EAD7A7]/60 rounded-full cursor-pointer"
            />
          </div>
          <span className="tabular-nums shrink-0">{isMuted ? '0%' : `${Math.round(volume * 100)}%`}</span>
        </div>
      </div>

      {/* Track List */}
      <div className="pt-1 space-y-1.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C5500] px-1">
          Danh Sách Phát ({visibleTracks.length} bản)
        </div>
        <div className="space-y-1.5 max-h-80 overflow-y-auto pr-0.5">
          {visibleTracks.map((track, idx) => {
            const selected = track.id === activeTrack.id;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => selectTrack(track, true)}
                className={cn(
                  'w-full flex items-center gap-3 p-2.5 rounded-xl text-left cursor-pointer transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D9A02E]',
                  selected
                    ? 'bg-[#FFF6DF] shadow-2xs'
                    : 'bg-[#FAF7F0]/80 hover:bg-[#FFF8E8]'
                )}
              >
                <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-[#EFE6D2]">
                  <img
                    src={track.coverImage}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    {selected && isPlaying ? (
                      <Pause className="w-4 h-4 text-white" />
                    ) : track.format === 'mp4' ? (
                      <Film className="w-4 h-4 text-white" />
                    ) : (
                      <Play className="w-3.5 h-3.5 text-white fill-current ml-0.5" />
                    )}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-[#A17830] shrink-0">
                      {idx + 1}.
                    </span>
                    <span
                      className={cn(
                        'text-xs sm:text-sm font-serif truncate',
                        selected ? 'font-bold text-[#2C1E10]' : 'font-semibold text-[#3D2C1B]'
                      )}
                    >
                      {track.title}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#7A6248] truncate mt-0.5">
                    {track.instrumentLabel}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded text-[9px] font-bold uppercase',
                      track.format === 'mp4'
                        ? 'bg-[#E8DFC8] text-[#5B4010]'
                        : 'bg-[#FAF0D7] text-[#8C5500]'
                    )}
                  >
                    {track.format}
                  </span>
                  <span className="text-[10px] font-mono text-[#7A6248] tabular-nums">
                    {track.durationLabel}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

