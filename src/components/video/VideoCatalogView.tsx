'use client';

import React, { useState } from 'react';
import { VideoItem, VideoPlayerModal, getVideoThumbnail } from './VideoPlayerModal';
import { formatDuration } from '@/lib/utils';
import { Play, Eye, Clock, User, Search, Filter } from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { Badge } from '@/components/ui/Badge';

interface VideoCatalogViewProps {
  videos: VideoItem[];
  speakers: string[];
  currentSpeaker?: string;
  currentCategory?: string;
}

const CATEGORIES = [
  { label: 'Tất cả chủ đề', value: '' },
  { label: 'Pháp thoại', value: 'PHAP_THOAI' },
  { label: 'Thiền quán', value: 'THIEN_QUAN' },
  { label: 'Kinh tụng', value: 'KINH_TUNG' },
  { label: 'Di sản Cổ tự', value: 'VAN_HOA' },
];

export function VideoCatalogView({
  videos,
  speakers,
  currentSpeaker,
  currentCategory,
}: VideoCatalogViewProps) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  return (
    <div className="space-y-6">
      {/* Videos Grid */}
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {videos.map((vid) => (
            <div
              key={vid.id}
              onClick={() => setActiveVideo(vid)}
              className="group bg-white dark:bg-charcoal-800 rounded-2xl border border-ivory-200 dark:border-charcoal-700 overflow-hidden shadow-xs hover:shadow-lg hover:border-saffron-400 dark:hover:border-saffron-600 transition-all cursor-pointer flex flex-col justify-between hover-lift"
            >
              <div>
                {/* Thumbnail Container */}
                <div className="relative aspect-video bg-ivory-100 overflow-hidden">
                  <img
                    src={getVideoThumbnail(vid.video_url, vid.thumbnail_url)}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Badge Phim Tư Liệu */}
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-mono text-white flex items-center gap-1.5 whitespace-nowrap shadow-xs">
                    <BuddhaBodhiIcon className="w-3.5 h-3.5 text-saffron-400" />
                    <span>Phim Tư Liệu</span>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs text-white text-[11px] font-mono whitespace-nowrap shadow-xs flex items-center gap-1">
                    <Clock className="w-3 h-3 text-ivory-300" />
                    <span>{formatDuration(vid.duration_seconds)}</span>
                  </div>

                  {/* Hover Play Icon Overlay */}
                  <div className="absolute inset-0 bg-charcoal-950/30 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-saffron-500 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-white translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4 sm:p-5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-charcoal-400 whitespace-nowrap">
                    <span className="font-semibold text-saffron-700 dark:text-saffron-400 truncate">
                      {vid.category === 'PHAP_THOAI'
                        ? 'Pháp thoại'
                        : vid.category === 'THIEN_QUAN'
                        ? 'Thiền quán'
                        : vid.category === 'KINH_TUNG'
                        ? 'Kinh tụng'
                        : 'Di sản Cổ tự'}
                    </span>
                    {vid.view_count ? (
                      <span className="flex items-center gap-1 text-charcoal-500 dark:text-charcoal-400 whitespace-nowrap flex-shrink-0">
                        <Eye className="w-3.5 h-3.5" />
                        {vid.view_count.toLocaleString('vi-VN')}
                      </span>
                    ) : null}
                  </div>

                  <h3 className="font-heading text-base font-bold text-charcoal-900 dark:text-charcoal-50 line-clamp-2 leading-snug group-hover:text-saffron-600 transition-colors">
                    {vid.title}
                  </h3>

                  <p className="text-xs text-charcoal-600 dark:text-charcoal-400 line-clamp-2 leading-relaxed">
                    {vid.description}
                  </p>
                </div>
              </div>

              <div className="px-5 py-3 bg-ivory-50/80 dark:bg-charcoal-900/60 border-t border-ivory-100 dark:border-charcoal-700/80 flex items-center justify-between text-xs">
                <span className="text-charcoal-600 dark:text-charcoal-300 font-medium truncate flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-saffron-500 flex-shrink-0" />
                  <span className="truncate">{vid.speaker}</span>
                </span>
                <span className="text-saffron-700 dark:text-saffron-400 font-semibold hover:underline flex-shrink-0 ml-2 whitespace-nowrap flex items-center gap-1">
                  <Play className="w-3 h-3 fill-current" /> Xem ngay
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-charcoal-800 rounded-2xl border border-ivory-200 dark:border-charcoal-700">
          <p className="text-sm text-charcoal-500">
            Không tìm thấy video nào phù hợp với bộ lọc hiện tại.
          </p>
        </div>
      )}

      {/* Video Player Modal */}
      <VideoPlayerModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
        relatedVideos={videos}
        onSelectVideo={(v) => setActiveVideo(v)}
      />
    </div>
  );
}
