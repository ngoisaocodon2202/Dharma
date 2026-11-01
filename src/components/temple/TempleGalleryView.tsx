'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { MapPin, CheckCircle, Maximize2, X, Compass, ExternalLink, ArrowRight } from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { Badge } from '@/components/ui/Badge';

export interface TempleItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  tradition?: string;
  abbot_name?: string;
  address: string;
  province: string;
  district?: string;
  cover_image: string;
  description: string;
  history?: string;
  is_verified?: boolean;
}

interface TempleGalleryViewProps {
  temples: TempleItem[];
}

export function TempleGalleryView({ temples }: TempleGalleryViewProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<TempleItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'gallery'>('grid');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhoto(null);
    };
    if (selectedPhoto) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPhoto]);

  return (
    <div className="space-y-6">
      {/* View Mode Toggle Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="text-xs text-charcoal-500 dark:text-charcoal-400 whitespace-nowrap">
          Hiển thị <span className="font-semibold text-charcoal-800 dark:text-charcoal-200">{temples.length}</span> danh lam cổ tự & thánh tích tiêu biểu
        </div>

        <div className="inline-flex p-1 bg-ivory-100 dark:bg-charcoal-800 rounded-xl border border-ivory-200 dark:border-charcoal-700">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-charcoal-700 text-charcoal-900 dark:text-charcoal-100 shadow-xs'
                : 'text-charcoal-600 dark:text-charcoal-400 hover:text-charcoal-900'
            }`}
          >
            Lưới chi tiết
          </button>
          <button
            onClick={() => setViewMode('gallery')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              viewMode === 'gallery'
                ? 'bg-lotus-500 text-white shadow-xs'
                : 'text-charcoal-600 dark:text-charcoal-400 hover:text-charcoal-900'
            }`}
          >
            <BuddhaBodhiIcon className="w-3.5 h-3.5 text-saffron-300" />
            Không gian Cổ tự
          </button>
        </div>
      </div>

      {/* Grid Mode */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {temples.map((temple) => (
            <Card key={temple.id} className="flex flex-col justify-between overflow-hidden group hover-lift border-ivory-200 dark:border-charcoal-700">
              <div>
                {/* Image Container */}
                <div className="relative aspect-[16/10] bg-ivory-100 overflow-hidden">
                  <img
                    src={temple.cover_image}
                    alt={temple.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Cổ Tự Badge */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-mono font-medium text-white flex items-center gap-1.5 shadow-xs whitespace-nowrap">
                    <BuddhaBodhiIcon className="w-3.5 h-3.5 text-saffron-400" />
                    <span>Danh Lam Cổ Tự</span>
                  </div>

                  {temple.is_verified && (
                    <div className="absolute top-3 right-3 bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-medium text-jade-700 dark:text-jade-300 flex items-center gap-1 shadow-xs whitespace-nowrap">
                      <CheckCircle className="w-3.5 h-3.5 text-jade-600" /> Đã xác minh
                    </div>
                  )}

                  {/* Quick Photo Zoom Trigger */}
                  <button
                    onClick={() => setSelectedPhoto(temple)}
                    className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/90 dark:bg-charcoal-900/90 text-charcoal-800 dark:text-charcoal-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-110"
                    title="Xem ảnh độ nét cao"
                    aria-label="Xem ảnh độ nét cao"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                <CardHeader className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-charcoal-500 dark:text-charcoal-400 whitespace-nowrap">
                    <MapPin className="w-3.5 h-3.5 text-lotus-500 flex-shrink-0" />
                    <span className="font-medium text-lotus-700 dark:text-lotus-400">{temple.province}</span>
                    <span>•</span>
                    <span className="truncate">{temple.tradition || 'Bắc tông'}</span>
                  </div>

                  <Link href={`/chua-dia-danh/${temple.slug}`}>
                    <h2 className="font-heading text-lg font-bold text-charcoal-900 dark:text-charcoal-100 hover:text-lotus-600 transition-colors leading-snug line-clamp-1">
                      {temple.name}
                    </h2>
                  </Link>
                </CardHeader>

                <CardContent>
                  <p className="text-xs text-charcoal-600 dark:text-charcoal-400 line-clamp-3 leading-relaxed">
                    {temple.description}
                  </p>
                </CardContent>
              </div>

              <CardFooter className="pt-3 border-t border-ivory-100 dark:border-charcoal-800">
                <span className="text-xs text-charcoal-500 truncate max-w-[200px] whitespace-nowrap">
                  {temple.district ? `${temple.district}, ` : ''}{temple.province}
                </span>
                <Link
                  href={`/chua-dia-danh/${temple.slug}`}
                  className="text-xs text-lotus-600 dark:text-lotus-400 font-semibold hover:underline whitespace-nowrap flex-shrink-0 flex items-center gap-1"
                >
                  Chi tiết <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        /* Gallery Showcase Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {temples.map((temple) => (
            <div
              key={temple.id}
              onClick={() => setSelectedPhoto(temple)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 bg-charcoal-900"
            >
              <img
                src={temple.cover_image}
                alt={temple.name}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/20 to-black/30 group-hover:from-charcoal-950/95 transition-all" />

              {/* Top Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-mono text-saffron-300 border border-saffron-400/30 whitespace-nowrap flex items-center gap-1.5">
                  <BuddhaBodhiIcon className="w-3.5 h-3.5 text-saffron-400" /> Toàn Cảnh Cổ Tự
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-medium text-white whitespace-nowrap">
                  {temple.province}
                </span>
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                <h3 className="font-heading text-base font-bold leading-tight group-hover:text-saffron-300 transition-colors line-clamp-1">
                  {temple.name}
                </h3>
                <p className="text-[11px] text-ivory-200/80 line-clamp-2 leading-relaxed">
                  {temple.description}
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px] text-saffron-300 font-medium whitespace-nowrap">
                  <span>Nhấn để xem toàn cảnh chi tiết</span>
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {selectedPhoto && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 animate-fade-in" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/85 dark:bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedPhoto(null)}
          />

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl bg-charcoal-900 rounded-3xl overflow-hidden shadow-2xl border border-charcoal-700 z-10 flex flex-col max-h-[92vh] animate-scale-in"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-charcoal-800 bg-charcoal-950/80">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-saffron-500/20 text-saffron-400 text-[10px] font-mono border border-saffron-400/40 whitespace-nowrap">
                  Ảnh Độ Nét Cao
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
                  {selectedPhoto.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/chua-dia-danh/${selectedPhoto.slug}`}
                  className="px-3 py-1.5 rounded-xl bg-lotus-600 text-white text-xs font-medium hover:bg-lotus-700 transition-colors flex items-center gap-1 whitespace-nowrap"
                >
                  Xem bài giới thiệu <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="p-1.5 rounded-xl text-charcoal-400 hover:text-white hover:bg-charcoal-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* High-Res Image Display */}
            <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center min-h-[300px] sm:min-h-[480px]">
              <img
                src={selectedPhoto.cover_image}
                alt={selectedPhoto.name}
                className="w-full h-full max-h-[70vh] object-contain"
              />
            </div>

            {/* Bottom Info */}
            <div className="p-4 sm:p-5 bg-charcoal-950/95 border-t border-charcoal-800 text-charcoal-300 text-xs sm:text-sm space-y-1.5">
              <div className="flex items-center gap-2 text-saffron-400 font-medium whitespace-nowrap">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{selectedPhoto.address}</span>
              </div>
              <p className="line-clamp-2 leading-relaxed text-charcoal-400">
                {selectedPhoto.description}
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
