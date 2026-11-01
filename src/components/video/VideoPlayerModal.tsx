'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Play, Eye, Clock, User, Share2, Check, ExternalLink } from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { Badge } from '@/components/ui/Badge';
import { formatDuration } from '@/lib/utils';

export interface VideoItem {
  id: string;
  title: string;
  speaker: string;
  video_url: string;
  thumbnail_url: string;
  duration_seconds: number;
  category: string;
  description?: string;
  view_count?: number;
}

interface VideoPlayerModalProps {
  video: VideoItem | null;
  onClose: () => void;
  relatedVideos?: VideoItem[];
  onSelectVideo?: (v: VideoItem) => void;
}

export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

export function getVideoThumbnail(videoUrl: string, fallbackThumb?: string): string {
  const ytid = getYouTubeId(videoUrl);
  if (ytid) {
    return `https://i.ytimg.com/vi/${ytid}/hqdefault.jpg`;
  }
  return fallbackThumb || 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800&auto=format&fit=crop&q=80';
}

export function VideoPlayerModal({
  video,
  onClose,
  relatedVideos = [],
  onSelectVideo,
}: VideoPlayerModalProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (video) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [video, onClose]);

  if (!video || !mounted) return null;

  const youtubeId = getYouTubeId(video.video_url);

  const handleShare = async () => {
    const shareUrl = video.video_url;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'PHAP_THOAI':
        return <Badge variant="saffron">Pháp thoại</Badge>;
      case 'THIEN_QUAN':
        return <Badge variant="jade">Thiền quán</Badge>;
      case 'KINH_TUNG':
        return <Badge variant="lotus">Kinh tụng</Badge>;
      case 'VAN_HOA':
        return <Badge variant="outline">Di sản Cổ tự</Badge>;
      default:
        return <Badge variant="neutral">{cat}</Badge>;
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 dark:bg-black/90 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92dvh] sm:max-h-[90vh] flex flex-col bg-white dark:bg-charcoal-900 rounded-2xl md:rounded-3xl shadow-2xl border border-ivory-200 dark:border-charcoal-700 overflow-hidden z-10 animate-scale-in"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-ivory-200 dark:border-charcoal-800 bg-ivory-50/70 dark:bg-charcoal-900/70">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <span className="p-1.5 rounded-lg bg-saffron-100 dark:bg-saffron-950/60 text-saffron-700 dark:text-saffron-400 flex-shrink-0">
              <BuddhaBodhiIcon className="w-4 h-4 text-saffron-600 dark:text-saffron-400" />
            </span>
            <span className="text-xs sm:text-sm font-semibold text-charcoal-800 dark:text-charcoal-200 truncate">
              Xem Video Phật Pháp & Pháp Thoại Tỉnh Thức
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-xs font-medium text-charcoal-600 dark:text-charcoal-300 hover:bg-ivory-100 dark:hover:bg-charcoal-800 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              title="Sao chép link video"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-jade-600" />
                  <span className="hidden sm:inline text-jade-600">Đã chép</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Chia sẻ</span>
                </>
              )}
            </button>

            <a
              href={video.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-xs font-medium text-charcoal-600 dark:text-charcoal-300 hover:bg-ivory-100 dark:hover:bg-charcoal-800 transition-colors hidden sm:flex items-center gap-1 whitespace-nowrap"
              title="Mở trên YouTube"
            >
              <ExternalLink className="w-4 h-4" />
              <span>YouTube</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-charcoal-500 hover:text-charcoal-900 dark:text-charcoal-400 dark:hover:text-charcoal-100 hover:bg-ivory-100 dark:hover:bg-charcoal-800 transition-colors"
              aria-label="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto overflow-x-hidden flex-1">
          {/* Video Player (Responsive 16:9 Container) */}
          <div className="relative w-full aspect-video bg-black">
            {youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-charcoal-950">
                <Play className="w-12 h-12 text-saffron-500 mb-3 animate-pulse" />
                <p className="text-sm">Không thể nạp trình phát cho video này.</p>
                <a
                  href={video.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 px-4 py-2 bg-saffron-600 text-white text-xs rounded-xl font-medium"
                >
                  Mở trực tiếp trên YouTube
                </a>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                {getCategoryBadge(video.category)}
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-saffron-50 dark:bg-saffron-950/40 text-saffron-700 dark:text-saffron-300 border border-saffron-200/50 whitespace-nowrap">
                  Thước Phim Tuyển Chọn
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-charcoal-500 dark:text-charcoal-400 whitespace-nowrap">
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDuration(video.duration_seconds)}
                </span>
                {video.view_count && (
                  <span className="flex items-center gap-1 whitespace-nowrap">
                    <Eye className="w-3.5 h-3.5" />
                    {video.view_count.toLocaleString('vi-VN')} lượt xem
                  </span>
                )}
              </div>
            </div>

            <div>
              <h2 className="font-heading text-lg sm:text-2xl font-bold text-charcoal-900 dark:text-charcoal-50 leading-snug">
                {video.title}
              </h2>
              <div className="flex items-center gap-1.5 mt-2 text-xs sm:text-sm font-medium text-saffron-700 dark:text-saffron-400">
                <User className="w-4 h-4 flex-shrink-0" />
                <span>Giảng sư / Tác giả: {video.speaker}</span>
              </div>
            </div>

            {video.description && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-ivory-50 dark:bg-charcoal-800/60 border border-ivory-200/80 dark:border-charcoal-700/80">
                <p className="text-xs sm:text-sm text-charcoal-700 dark:text-charcoal-300 leading-relaxed whitespace-pre-line">
                  {video.description}
                </p>
              </div>
            )}

            {/* Related Videos Playlist */}
            {relatedVideos.length > 0 && (
              <div className="pt-4 border-t border-ivory-200 dark:border-charcoal-800 space-y-3">
                <h3 className="font-heading text-sm sm:text-base font-bold text-charcoal-900 dark:text-charcoal-100">
                  Gợi Ý Video Phật Pháp Khác
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {relatedVideos
                    .filter((r) => r.id !== video.id)
                    .slice(0, 3)
                    .map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onSelectVideo?.(item)}
                        className="group flex gap-3 p-2.5 rounded-xl bg-white dark:bg-charcoal-800 border border-ivory-200 dark:border-charcoal-700 hover:border-saffron-400 dark:hover:border-saffron-600 transition-all cursor-pointer shadow-xs hover-lift"
                      >
                        <div className="relative w-24 aspect-video rounded-lg overflow-hidden bg-ivory-100 flex-shrink-0">
                          <img
                            src={getVideoThumbnail(item.video_url, item.thumbnail_url)}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-4 h-4 text-white fill-white" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 flex flex-col justify-between">
                          <h4 className="font-heading text-xs font-semibold text-charcoal-900 dark:text-charcoal-100 line-clamp-2 leading-snug group-hover:text-saffron-600 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-charcoal-500 truncate mt-1">
                            {item.speaker}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
