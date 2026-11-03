'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage, BUDDHIST_LANGUAGES, BuddhistLanguageCode } from './LanguageContext';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  compact?: boolean;
}

function CountryFlag({ code, className = 'w-4 h-4' }: { code: BuddhistLanguageCode; className?: string }) {
  switch (code) {
    case 'vi': // Vietnam: Red background with golden 5-pointed star
      return (
        <svg viewBox="0 0 36 36" className={cn('rounded-full shrink-0 shadow-xs border border-black/10', className)}>
          <rect width="36" height="36" fill="#DA251D" />
          <polygon
            fill="#FFFF00"
            points="18,7.5 20.47,15.1 28.46,15.1 22,19.8 24.47,27.4 18,22.7 11.53,27.4 14,19.8 7.54,15.1 15.53,15.1"
          />
        </svg>
      );
    case 'en': // UK / International Union Jack
      return (
        <svg viewBox="0 0 36 36" className={cn('rounded-full shrink-0 shadow-xs border border-black/10', className)}>
          <rect width="36" height="36" fill="#012169" />
          <path d="M0,0 L36,36 M36,0 L0,36" stroke="#FFFFFF" strokeWidth="6" />
          <path d="M0,0 L36,36 M36,0 L0,36" stroke="#C8102E" strokeWidth="3" />
          <path d="M18,0 V36 M0,18 H36" stroke="#FFFFFF" strokeWidth="10" />
          <path d="M18,0 V36 M0,18 H36" stroke="#C8102E" strokeWidth="6" />
        </svg>
      );
    case 'zh': // China / Chinese Buddhist: Red with golden stars
      return (
        <svg viewBox="0 0 36 36" className={cn('rounded-full shrink-0 shadow-xs border border-black/10', className)}>
          <rect width="36" height="36" fill="#DE2910" />
          <polygon
            fill="#FFDE00"
            points="10,7 11.5,11.6 16.3,11.6 12.4,14.4 13.9,19 10,16.2 6.1,19 7.6,14.4 3.7,11.6 8.5,11.6"
          />
          <circle cx="19" cy="6.5" r="1.4" fill="#FFDE00" />
          <circle cx="22" cy="10" r="1.4" fill="#FFDE00" />
          <circle cx="22" cy="15" r="1.4" fill="#FFDE00" />
          <circle cx="19" cy="18.5" r="1.4" fill="#FFDE00" />
        </svg>
      );
    case 'th': // Thailand: Red - White - Blue - White - Red
      return (
        <svg viewBox="0 0 36 36" className={cn('rounded-full shrink-0 shadow-xs border border-black/10', className)}>
          <rect width="36" height="6" y="0" fill="#A51931" />
          <rect width="36" height="6" y="6" fill="#F4F5F8" />
          <rect width="36" height="12" y="12" fill="#2D2A4A" />
          <rect width="36" height="6" y="24" fill="#F4F5F8" />
          <rect width="36" height="6" y="30" fill="#A51931" />
        </svg>
      );
    case 'ja': // Japan: White with Crimson Sun
      return (
        <svg viewBox="0 0 36 36" className={cn('rounded-full shrink-0 shadow-xs border border-black/15', className)}>
          <rect width="36" height="36" fill="#FFFFFF" />
          <circle cx="18" cy="18" r="9.5" fill="#BC002D" />
        </svg>
      );
    case 'ko': // South Korea: White with Taegeuk & trigrams
      return (
        <svg viewBox="0 0 36 36" className={cn('rounded-full shrink-0 shadow-xs border border-black/15', className)}>
          <rect width="36" height="36" fill="#FFFFFF" />
          <path d="M18,9 A9,9 0 0,1 27,18 A4.5,4.5 0 0,1 18,18 A4.5,4.5 0 0,0 9,18 A9,9 0 0,1 18,9 Z" fill="#CD2E3A" />
          <path d="M18,27 A9,9 0 0,1 9,18 A4.5,4.5 0 0,0 18,18 A4.5,4.5 0 0,1 27,18 A9,9 0 0,1 18,27 Z" fill="#0047A0" />
          <rect x="6" y="7" width="5" height="1.5" transform="rotate(-45 8.5 7.75)" fill="#000" />
          <rect x="25" y="7" width="5" height="1.5" transform="rotate(45 27.5 7.75)" fill="#000" />
          <rect x="6" y="27" width="5" height="1.5" transform="rotate(45 8.5 27.75)" fill="#000" />
          <rect x="25" y="27" width="5" height="1.5" transform="rotate(-45 27.5 27.75)" fill="#000" />
        </svg>
      );
    case 'hi': // India: Saffron - White - Green with Ashoka Chakra
      return (
        <svg viewBox="0 0 36 36" className={cn('rounded-full shrink-0 shadow-xs border border-black/10', className)}>
          <rect width="36" height="12" y="0" fill="#FF9933" />
          <rect width="36" height="12" y="12" fill="#FFFFFF" />
          <rect width="36" height="12" y="24" fill="#138808" />
          <circle cx="18" cy="18" r="4.5" fill="none" stroke="#000080" strokeWidth="1.2" />
          <circle cx="18" cy="18" r="1.2" fill="#000080" />
        </svg>
      );
    default:
      return null;
  }
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { lang, setLang, currentLanguage, isTranslating } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative shrink-0" data-no-translate="true">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 rounded-full border border-ivory-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 hover:border-saffron-400 dark:hover:border-saffron-600 shadow-2xs transition-all cursor-pointer whitespace-nowrap select-none active:scale-95',
          compact ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1.5 text-xs'
        )}
        title="Chuyển đổi ngôn ngữ / Switch Language"
        aria-label="Chuyển đổi ngôn ngữ"
      >
        <CountryFlag code={currentLanguage.code} className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        <span className="font-bold text-charcoal-800 dark:text-charcoal-100 uppercase tracking-wide">
          {currentLanguage.code}
        </span>
        {isTranslating ? (
          <span className="w-2.5 h-2.5 rounded-full border-2 border-saffron-500 border-t-transparent animate-spin" />
        ) : (
          <ChevronDown className="w-3 h-3 text-charcoal-400" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-700 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3.5 py-1.5 border-b border-ivory-100 dark:border-charcoal-800 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
            <Globe className="w-3 h-3" />
            <span>Ngôn ngữ Phật giáo</span>
          </div>
          <div className="py-1 max-h-72 overflow-y-auto">
            {BUDDHIST_LANGUAGES.map((item) => {
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
                    'w-full px-3.5 py-2 flex items-center justify-between text-left text-xs transition-colors whitespace-nowrap',
                    isSelected
                      ? 'bg-saffron-50 dark:bg-saffron-950/50 text-saffron-800 dark:text-saffron-300 font-semibold'
                      : 'text-charcoal-700 dark:text-charcoal-300 hover:bg-ivory-100 dark:hover:bg-charcoal-800'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CountryFlag code={item.code} className="w-5 h-5" />
                    <div className="min-w-0">
                      <div className="font-semibold leading-tight truncate">{item.nativeName}</div>
                      <div className="text-[10px] text-charcoal-400 leading-tight truncate">
                        {item.country}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-saffron-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
