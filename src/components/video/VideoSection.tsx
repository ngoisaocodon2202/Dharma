'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { VideoItem, VideoPlayerModal, getVideoThumbnail } from './VideoPlayerModal';
import { formatDuration } from '@/lib/utils';
import { Play, Video, ArrowRight, Eye, Clock } from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { Badge } from '@/components/ui/Badge';

interface VideoSectionProps {
  initialVideos: VideoItem[];
}

const CATEGORIES = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Pháp thoại', value: 'PHAP_THOAI' },
  { label: 'Thiền quán', value: 'THIEN_QUAN' },
  { label: 'Kinh tụng', value: 'KINH_TUNG' },
  { label: 'Di sản Cổ tự', value: 'VAN_HOA' },
];

export function VideoSection({ initialVideos }: VideoSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const filteredVideos =
    selectedCategory === 'ALL'
      ? initialVideos
      : initialVideos.filter((v) => v.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-ivory-200 dark:border-charcoal-800 pb-3 gap-2 sm:gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-saffron-700 dark:text-saffron-400 uppercase tracking-wider mb-1">
            <Video className="w-4 h-4 text-saffron-500 animate-pulse-glow flex-shrink-0" />
            <span>Kho Tư Liệu & Pháp Âm Trực Quan</span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-charcoal-900 dark:text-charcoal-100">
            Video Phật Pháp & Danh Lam Cổ Tự
          </h2>
        </div>

        <Link
          href="/phap-thoai?dinh-dang=video"
          className="text-xs font-medium text-saffron-700 dark:text-saffron-400 hover:underline flex items-center gap-1 whitespace-nowrap flex-shrink-0"
        >
          Xem tất cả video <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Category Pills Filter — Horizontal Scroll on Mobile, Edge bleed */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-saffron-500 text-white shadow-xs'
                  : 'bg-white dark:bg-charcoal-800 border border-ivory-200 dark:border-charcoal-700 text-charcoal-700 dark:text-charcoal-300 hover:border-saffron-400'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredVideos.map((vid) => (
          <div
            key={vid.id}
            onClick={() => setActiveVideo(vid)}
            className="group bg-white dark:bg-charcoal-800 rounded-2xl border border-ivory-200 dark:border-charcoal-700 overflow-hidden shadow-xs hover:shadow-md hover:border-saffron-400 dark:hover:border-saffron-600 transition-all cursor-pointer flex flex-col justify-between hover-lift"
          >
            <div>
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-ivory-100 overflow-hidden">
                <img
                  src={getVideoThumbnail(vid.video_url, vid.thumbnail_url)}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge Phim Tư Liệu */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-mono text-white flex items-center gap-1.5 whitespace-nowrap shadow-xs">
                  <BuddhaBodhiIcon className="w-3.5 h-3.5 text-saffron-400" />
                  <span>Phim Tư Liệu</span>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs text-white text-[11px] font-mono whitespace-nowrap shadow-xs flex items-center gap-1">
                  <Clock className="w-3 h-3 text-ivory-300" />
                  <span>{formatDuration(vid.duration_seconds)}</span>
                </div>

                {/* Hover Play Button Overlay */}
                <div className="absolute inset-0 bg-charcoal-950/30 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-saffron-500/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-white translate-x-0.5" />
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-charcoal-400 whitespace-nowrap">
                  <span className="font-medium text-saffron-700 dark:text-saffron-400 truncate">
                    {vid.category === 'PHAP_THOAI'
                      ? 'Pháp thoại'
                      : vid.category === 'THIEN_QUAN'
                      ? 'Thiền quán'
                      : vid.category === 'KINH_TUNG'
                      ? 'Kinh tụng'
                      : 'Di sản Cổ tự'}
                  </span>
                  {vid.view_count && (
                    <span className="flex items-center gap-1 text-charcoal-500 dark:text-charcoal-400 whitespace-nowrap flex-shrink-0">
                      <Eye className="w-3 h-3" />
                      {vid.view_count.toLocaleString('vi-VN')}
                    </span>
                  )}
                </div>

                <h3 className="font-heading text-sm font-bold text-charcoal-900 dark:text-charcoal-50 line-clamp-2 leading-snug group-hover:text-saffron-600 transition-colors">
                  {vid.title}
                </h3>

                <p className="text-xs text-charcoal-600 dark:text-charcoal-400 truncate">
                  {vid.speaker}
                </p>
              </div>
            </div>

            <div className="px-4 py-2.5 bg-ivory-50/70 dark:bg-charcoal-900/60 border-t border-ivory-100 dark:border-charcoal-700/80 flex items-center justify-between text-xs text-saffron-700 dark:text-saffron-400 font-medium">
              <span className="whitespace-nowrap flex items-center gap-1">
                <Play className="w-3 h-3 fill-current" /> Xem ngay
              </span>
              <span className="text-[11px] text-charcoal-400 whitespace-nowrap">
                Miễn phí
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
        relatedVideos={initialVideos}
        onSelectVideo={(v) => setActiveVideo(v)}
      />
    </div>
  );
}
