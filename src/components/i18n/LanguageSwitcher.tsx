'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Globe, Check, ChevronDown, Search, X } from 'lucide-react';
import {
  useLanguage,
  WORLD_LANGUAGES,
  LanguageOption,
  LanguageRegion,
} from './LanguageContext';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  compact?: boolean;
  variant?: 'default' | 'sanctuary';
}

const REGION_FILTERS: { id: 'ALL' | LanguageRegion; label: string }[] = [
  { id: 'ALL', label: `Tất cả (${WORLD_LANGUAGES.length})` },
  { id: 'Phật giáo & Châu Á', label: 'Châu Á' },
  { id: 'Châu Âu', label: 'Châu Âu' },
  { id: 'Trung Đông & Trung Á', label: 'Trung Đông' },
  { id: 'Châu Mỹ & Đại Dương', label: 'Châu Mỹ & ĐD' },
  { id: 'Châu Phi', label: 'Châu Phi' },
];

function CountryFlag({
  item,
  className = 'w-4 h-4',
}: {
  item: LanguageOption;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);

  if (item.countryCode === 'un' || imgError) {
    return (
      <span
        className={cn(
          'rounded-full bg-saffron-100 text-saffron-800 border border-saffron-300 inline-flex items-center justify-center font-bold text-[9px] shrink-0',
          className
        )}
      >
        🌍
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/w40/${item.countryCode}.png`}
      alt={item.country}
      onError={() => setImgError(true)}
      loading="lazy"
      className={cn(
        'rounded-full object-cover shrink-0 shadow-2xs border border-black/10',
        className
      )}
    />
  );
}

export function LanguageSwitcher({
  compact = false,
  variant = 'default',
}: LanguageSwitcherProps) {
  const { lang, setLang, currentLanguage, isTranslating } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState<'ALL' | LanguageRegion>('ALL');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 60);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredLanguages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return WORLD_LANGUAGES.filter((item) => {
      if (activeRegion !== 'ALL' && item.region !== activeRegion) {
        return false;
      }
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.nativeName.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, activeRegion]);

  const shortDisplayCode = currentLanguage.code.split('-')[0].toUpperCase();

  return (
    <div ref={dropdownRef} className="relative shrink-0" data-no-translate="true">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap select-none active:scale-95',
          variant === 'sanctuary'
            ? 'h-9 px-2.5 border border-[#D4AF37]/50 bg-black/45 hover:bg-black/65 text-[#F9D783] shadow-sm text-xs'
            : cn(
                'border border-ivory-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 hover:border-saffron-400 dark:hover:border-saffron-600 shadow-2xs',
                compact ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1.5 text-xs'
              )
        )}
        title="Chuyển đổi ngôn ngữ thế giới / Switch Language"
        aria-label="Chuyển đổi ngôn ngữ"
      >
        <CountryFlag
          item={currentLanguage}
          className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'}
        />
        <span
          className={cn(
            'font-bold uppercase tracking-wide',
            variant === 'sanctuary'
              ? 'text-[#FFE082]'
              : 'text-charcoal-800 dark:text-charcoal-100'
          )}
        >
          {shortDisplayCode}
        </span>
        {isTranslating ? (
          <span className="w-2.5 h-2.5 rounded-full border-2 border-saffron-500 border-t-transparent animate-spin" />
        ) : (
          <ChevronDown
            className={cn(
              'w-3 h-3',
              variant === 'sanctuary' ? 'text-[#F9D783]/80' : 'text-charcoal-400'
            )}
          />
        )}
      </button>

      {isOpen && (
        <div
          className={cn(
            'fixed sm:absolute right-2 sm:right-0 top-14 sm:top-auto sm:mt-2 w-[calc(100vw-16px)] max-w-[330px] rounded-2xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-700 shadow-2xl py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150'
          )}
        >
          {/* Header */}
          <div className="px-3.5 pb-2 border-b border-ivory-100 dark:border-charcoal-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400 whitespace-nowrap">
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span>Ngôn ngữ thế giới ({WORLD_LANGUAGES.length})</span>
            </div>
            {isTranslating && (
              <span className="text-[10px] font-semibold text-saffron-600 animate-pulse whitespace-nowrap">
                Đang dịch...
              </span>
            )}
          </div>

          {/* Search Input */}
          <div className="px-3 pt-2 pb-1.5">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-2.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm ngôn ngữ, quốc gia (VD: Pháp, Nhật, Anh...)"
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-ivory-100/80 dark:bg-charcoal-800 border border-ivory-200 dark:border-charcoal-700 text-charcoal-800 dark:text-charcoal-100 placeholder:text-charcoal-400 focus:outline-none focus:border-saffron-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-charcoal-400 hover:text-charcoal-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Region Filter Pills (Single-line horizontal scroll) */}
          <div className="px-3 pb-2 flex items-center gap-1 overflow-x-auto no-scrollbar">
            {REGION_FILTERS.map((region) => {
              const active = activeRegion === region.id;
              return (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => setActiveRegion(region.id)}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer',
                    active
                      ? 'bg-saffron-500 text-white shadow-2xs'
                      : 'bg-ivory-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300 hover:bg-ivory-200'
                  )}
                >
                  {region.label}
                </button>
              );
            })}
          </div>

          {/* Languages List */}
          <div className="py-1 px-2 max-h-72 overflow-y-auto custom-dropdown-scroll space-y-0.5">
            {filteredLanguages.length === 0 ? (
              <div className="py-6 text-center text-xs text-charcoal-400">
                Không tìm thấy ngôn ngữ phù hợp
              </div>
            ) : (
              filteredLanguages.map((item) => {
                const isSelected = item.code === lang;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setLang(item.code);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full px-2.5 py-2 rounded-xl flex items-center justify-between text-left text-xs transition-colors whitespace-nowrap cursor-pointer',
                      isSelected
                        ? 'bg-gradient-to-r from-amber-50 to-[#fff6df] dark:from-saffron-950/60 dark:to-charcoal-800 text-[#4a2508] dark:text-saffron-300 font-bold shadow-2xs border border-saffron-200/70'
                        : 'text-charcoal-700 dark:text-charcoal-300 hover:bg-ivory-100 dark:hover:bg-charcoal-800'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                      <CountryFlag item={item} className="w-5 h-5" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-semibold leading-tight truncate">
                            {item.nativeName}
                          </span>
                          <span className="text-[10px] text-charcoal-400 font-normal truncate">
                            • {item.name}
                          </span>
                        </div>
                        <div className="text-[10px] text-charcoal-400 leading-tight truncate">
                          {item.country} ({item.code.toUpperCase()})
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-saffron-600 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
