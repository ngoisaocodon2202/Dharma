'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Download,
  Check,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Repeat,
  Trash2,
  BookOpen,
  WifiOff,
  Headphones,
} from 'lucide-react';
import {
  OFFLINE_AUDIO_CATEGORIES,
  OFFLINE_SUTRA_AUDIO_TRACKS,
  type OfflineAudioCategory,
  type OfflineAudioTrack,
} from '@/data/practiceToolsData';
import {
  downloadTrackOffline,
  getOfflineTrackBlobUrl,
  removeOfflineTrack,
} from '@/lib/offlineAudioCache';
import { playBellSound, playWoodenFishSound } from '@/lib/buddhistSounds';
import { useDharmaPracticeStore } from '@/store/useDharmaPracticeStore';
import { cn } from '@/lib/utils';

interface Tool05NgheKinhProps {
  showToast: (msg: string) => void;
}

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5] as const;

export function Tool05NgheKinh({ showToast }: Tool05NgheKinhProps) {
  const {
    downloadedAudioIds,
    audioPositions,
    setAudioDownloaded,
    saveAudioPosition,
    addMeritEntry,
  } = useDharmaPracticeStore();

  const [categoryFilter, setCategoryFilter] = useState<'Tất cả' | OfflineAudioCategory>('Tất cả');
  const [onlyDownloaded, setOnlyDownloaded] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});

  // Audio player states
  const [selectedTrack, setSelectedTrack] = useState<OfflineAudioTrack>(OFFLINE_SUTRA_AUDIO_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(OFFLINE_SUTRA_AUDIO_TRACKS[0].durationSec);
  const [playbackSpeed, setPlaybackSpeed] = useState<(typeof SPEED_OPTIONS)[number]>(1);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [loadingTrackId, setLoadingTrackId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentBlobUrlRef = useRef<string | null>(null);
  const lastSavedSecRef = useRef<number>(0);

  const filteredTracks = useMemo(() => {
    return OFFLINE_SUTRA_AUDIO_TRACKS.filter((t) => {
      if (categoryFilter !== 'Tất cả' && t.category !== categoryFilter) return false;
      if (onlyDownloaded && !downloadedAudioIds.includes(t.id)) return false;
      return true;
    });
  }, [categoryFilter, onlyDownloaded, downloadedAudioIds]);

  // Clean up Blob URL and Audio instance on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current);
        currentBlobUrlRef.current = null;
      }
    };
  }, []);

  // Keep playbackRate synced
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Keep loop synced
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = loopEnabled;
    }
  }, [loopEnabled]);

  const loadAndPlayTrack = async (track: OfflineAudioTrack, autoPlay: boolean) => {
    setSelectedTrack(track);
    setLoadingTrackId(track.id);

    try {
      if (audioRef.current) {
        saveAudioPosition(selectedTrack.id, audioRef.current.currentTime || 0);
        audioRef.current.pause();
      }
      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current);
      }

      const blobUrl = await getOfflineTrackBlobUrl({
        id: track.id,
        title: track.title,
        durationSec: track.durationSec,
        baseFreq: track.baseFreq,
        cadenceNotes: track.cadenceNotes,
        transcriptText: track.transcriptParagraphs.join('\n'),
      });
      currentBlobUrlRef.current = blobUrl;

      const audioEl = audioRef.current;
      if (audioEl) {
        audioEl.src = blobUrl;
        audioEl.playbackRate = playbackSpeed;
        audioEl.loop = loopEnabled;

        const savedPos = audioPositions[track.id] || 0;
        const applyResumeAndPlay = () => {
          const maxSafe = Math.max(0, (audioEl.duration || track.durationSec) - 2);
          const resumeSec = savedPos > 1 && savedPos < maxSafe ? savedPos : 0;
          audioEl.currentTime = resumeSec;
          setCurrentTime(resumeSec);
          setDuration(audioEl.duration || track.durationSec);
          if (autoPlay) {
            audioEl
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => setIsPlaying(false));
          } else {
            setIsPlaying(false);
          }
        };

        audioEl.onloadedmetadata = applyResumeAndPlay;
      }
    } finally {
      setLoadingTrackId(null);
    }
  };

  // Load initial selected track lazily when user presses play or chooses track
  const handleTogglePlay = async () => {
    const el = audioRef.current;
    if (!el) return;

    if (!el.src || !currentBlobUrlRef.current) {
      await loadAndPlayTrack(selectedTrack, true);
      return;
    }

    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
      saveAudioPosition(selectedTrack.id, el.currentTime);
    } else {
      try {
        await el.play();
        setIsPlaying(true);
      } catch {
        showToast('Nhấn lại nút Phát để kích hoạt âm thanh trên trình duyệt');
      }
    }
  };

  const handleSeekOffset = (deltaSec: number) => {
    const el = audioRef.current;
    if (!el) return;
    const maxD = el.duration || duration;
    const target = Math.max(0, Math.min(maxD, (el.currentTime || 0) + deltaSec));
    el.currentTime = target;
    setCurrentTime(target);
    saveAudioPosition(selectedTrack.id, target);
  };

  const handleDownloadOffline = async (track: OfflineAudioTrack) => {
    if (downloadProgress[track.id] !== undefined) return;
    playWoodenFishSound(0.35);
    setDownloadProgress((p) => ({ ...p, [track.id]: 1 }));

    try {
      await downloadTrackOffline(
        {
          id: track.id,
          title: track.title,
          durationSec: track.durationSec,
          baseFreq: track.baseFreq,
          cadenceNotes: track.cadenceNotes,
          transcriptText: track.transcriptParagraphs.join('\n'),
        },
        (pct) => {
          setDownloadProgress((p) => ({ ...p, [track.id]: pct }));
        }
      );
      setAudioDownloaded(track.id, true);
      playBellSound(0.4);
      showToast(`Đã tải "${track.title}" về máy • Sẵn sàng nghe không cần mạng!`);
    } catch {
      showToast('Không thể lưu tệp âm thanh offline trên thiết bị này');
    } finally {
      setDownloadProgress((p) => {
        const copy = { ...p };
        delete copy[track.id];
        return copy;
      });
    }
  };

  const handleRemoveOffline = async (trackId: string) => {
    await removeOfflineTrack(trackId);
    setAudioDownloaded(trackId, false);
    showToast('Đã xóa bản lưu ngoại tuyến của bài kinh');
  };

  const formatSec = (sec: number) => {
    const safe = Math.max(0, Math.floor(sec));
    const m = Math.floor(safe / 60);
    const s = safe % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressRatio = duration > 0 ? Math.min(1, currentTime / duration) : 0;
  const activeParagraphIdx = Math.min(
    selectedTrack.transcriptParagraphs.length - 1,
    Math.floor(progressRatio * selectedTrack.transcriptParagraphs.length)
  );

  return (
    <div className="space-y-5">
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => {
          const cur = e.currentTarget.currentTime;
          setCurrentTime(cur);
          if (Math.abs(cur - lastSavedSecRef.current) >= 3) {
            lastSavedSecRef.current = cur;
            saveAudioPosition(selectedTrack.id, cur);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          saveAudioPosition(selectedTrack.id, 0);
          addMeritEntry({
            category: 'TUNG_KINH',
            title: `Nghe trọn vẹn: ${selectedTrack.title}`,
            dedicationText: 'Nghe pháp âm thanh tịnh, thấu hiểu nghĩa kinh, tăng trưởng trí tuệ từ bi.',
          });
          playBellSound(0.45);
          showToast(`Hoàn mãn nghe bài: ${selectedTrack.title} (+1 Công Đức)`);
        }}
        className="hidden"
      />

      {/* 1. ACTIVE PLAYER & SYNCHRONIZED READ-ALONG TEXT PANEL */}
      <div className="rounded-3xl bg-gradient-to-br from-[#FFFDF8] via-[#FFF9EB] to-[#FCECC9] border-2 border-[#D9A02E] p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFFFFF] border border-[#EAD7A7] text-[10px] font-bold uppercase tracking-wider text-[#8C5500]">
                {selectedTrack.category}
              </span>
              {downloadedAudioIds.includes(selectedTrack.id) && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                  <WifiOff className="w-3 h-3" /> Sẵn sàng nghe không cần mạng
                </span>
              )}
            </div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#2C1E10] mt-1">
              {selectedTrack.title}
            </h3>
            <p className="text-xs text-[#6B533B]">{selectedTrack.tradition}</p>
          </div>

          <button
            type="button"
            onClick={() => setPlaybackSpeed((cur) => {
              const i = SPEED_OPTIONS.indexOf(cur);
              return SPEED_OPTIONS[(i + 1) % SPEED_OPTIONS.length];
            })}
            className="px-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#EAD7A7] text-xs font-bold text-[#8C5500] cursor-pointer self-start sm:self-auto"
          >
            Tốc độ: {playbackSpeed}x
          </button>
        </div>

        {/* Interactive Scrubber */}
        <div className="space-y-1.5">
          <input
            type="range"
            min={0}
            max={Math.max(1, Math.floor(duration))}
            value={Math.floor(currentTime)}
            onChange={(e) => {
              const val = Number(e.target.value);
              setCurrentTime(val);
              if (audioRef.current) audioRef.current.currentTime = val;
              saveAudioPosition(selectedTrack.id, val);
            }}
            className="w-full accent-[#C8780A] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-mono font-bold text-[#6B533B]">
            <span>{formatSec(currentTime)}</span>
            <span>{formatSec(duration)}</span>
          </div>
        </div>

        {/* Transport Controls (-15s, Play/Pause, +15s, Loop) */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          <button
            type="button"
            onClick={() => handleSeekOffset(-15)}
            className="px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#EAD7A7] text-xs font-bold text-[#8C5500] flex items-center gap-1 cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" /> -15s
          </button>

          <button
            type="button"
            disabled={loadingTrackId === selectedTrack.id}
            onClick={handleTogglePlay}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold text-sm flex items-center gap-2 shadow-md cursor-pointer active:scale-95 disabled:opacity-60"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>
              {loadingTrackId === selectedTrack.id
                ? 'Đang nạp âm...'
                : isPlaying
                  ? 'Tạm Dừng'
                  : currentTime > 2
                    ? 'Nghe Tiếp'
                    : 'Phát Pháp Âm'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSeekOffset(15)}
            className="px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#EAD7A7] text-xs font-bold text-[#8C5500] flex items-center gap-1 cursor-pointer active:scale-95"
          >
            +15s <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setLoopEnabled((v) => !v)}
            className={cn(
              'px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer',
              loopEnabled
                ? 'bg-[#FFE07D] border-[#C68B19] text-[#3D2505]'
                : 'bg-[#FFFFFF] border-[#EAD7A7] text-[#6B533B]'
            )}
          >
            <Repeat className="w-3.5 h-3.5" /> Lặp
          </button>
        </div>

        {/* Synchronized Read-Along Sutra / Dharma Text Panel */}
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] p-3.5 sm:p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#8C5500]">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Văn Bản Kinh / Pháp Thoại
            </span>
            <span className="text-[11px] text-[#6B533B]">
              Đọc nhẩm theo tiếng chuông niệm
            </span>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2 pr-1 text-xs sm:text-sm leading-relaxed">
            {selectedTrack.transcriptParagraphs.map((para, i) => (
              <p
                key={i}
                className={cn(
                  'p-2.5 rounded-xl transition-colors whitespace-pre-line',
                  i === activeParagraphIdx && isPlaying
                    ? 'bg-[#FFF6DF] text-[#2C1E10] font-bold border border-[#D9A02E]'
                    : 'text-[#5C442C]'
                )}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* 2. FILTERS: CATEGORIES + OFFLINE DOWNLOADED TOGGLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {OFFLINE_AUDIO_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                'px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer',
                categoryFilter === cat
                  ? 'bg-[#FAD02C] border-[#C8780A] text-[#3D2505]'
                  : 'bg-[#FFFFFF] border-[#EAD7A7] text-[#6B533B] hover:border-[#C68B19]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOnlyDownloaded((v) => !v)}
          className={cn(
            'px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto',
            onlyDownloaded
              ? 'bg-emerald-700 border-emerald-800 text-white'
              : 'bg-[#FFFFFF] border-[#EAD7A7] text-[#8C5500]'
          )}
        >
          <WifiOff className="w-3.5 h-3.5" />
          <span>Chỉ hiện bài đã tải về ({downloadedAudioIds.length})</span>
        </button>
      </div>

      {/* 3. 10 CURATED TRACK CARDS WITH OFFLINE ENGINE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredTracks.length === 0 ? (
          <div className="md:col-span-2 rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] p-8 text-center text-xs text-[#6B533B]">
            Chưa có bài nào trong mục đã tải về. Hãy nhấn nút &ldquo;Tải về máy&rdquo; trên bài kinh bất kỳ để lưu trữ ngoại tuyến.
          </div>
        ) : (
          filteredTracks.map((track) => {
            const isDownloaded = downloadedAudioIds.includes(track.id);
            const pct = downloadProgress[track.id];
            const isSelected = selectedTrack.id === track.id;
            const savedPos = audioPositions[track.id] || 0;

            return (
              <div
                key={track.id}
                className={cn(
                  'rounded-2xl border p-4 space-y-3 transition-all',
                  isSelected
                    ? 'bg-[#FFF9EB] border-[#C68B19] shadow-2xs'
                    : 'bg-[#FFFFFF] border-[#EAD7A7] hover:border-[#C68B19]'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF6DF] border border-[#EAD7A7] text-[#8C5500]">
                        {track.category}
                      </span>
                      <span className="text-[10px] font-mono text-[#6B533B]">
                        {formatSec(track.durationSec)}
                      </span>
                      {savedPos > 5 && (
                        <span className="text-[10px] font-bold text-[#8C5500]">
                          • Nghe dở {formatSec(savedPos)}
                        </span>
                      )}
                    </div>

                    <h5 className="font-serif font-bold text-sm text-[#2C1E10] mt-1 leading-snug">
                      {track.title}
                    </h5>
                    <p className="text-[11px] text-[#6B533B] mt-0.5">{track.tradition}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => loadAndPlayTrack(track, true)}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFE79A] to-[#FAD02C] text-[#3D2505] flex items-center justify-center shrink-0 shadow-sm cursor-pointer active:scale-95"
                    title="Nghe bài này"
                  >
                    {isSelected && isPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Headphones className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-[#5C442C] leading-relaxed">{track.summary}</p>

                {/* Download Progress / Offline Ready Row */}
                {pct !== undefined ? (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-[#8C5500]">
                      <span>Đang tải âm thanh về máy...</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#EAD7A7]/60 overflow-hidden">
                      <div
                        className="h-full bg-[#C8780A] transition-all duration-150"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ) : isDownloaded ? (
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                      <Check className="w-3.5 h-3.5" />
                      Đã tải • Sẵn sàng nghe không cần mạng
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveOffline(track.id)}
                      className="p-1.5 text-[#6B533B] hover:text-rose-600 rounded-lg cursor-pointer"
                      title="Xóa bản tải offline"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleDownloadOffline(track)}
                    className="w-full py-2 px-3 rounded-xl bg-[#FFF6DF] hover:bg-[#FCECC2] border border-[#EAD7A7] text-[#8C5500] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải về máy (Nghe Offline)</span>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

