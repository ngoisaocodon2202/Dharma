'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage, BUDDHIST_LANGUAGES } from './LanguageContext';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  compact?: boolean;
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
          'flex items-center gap-1 rounded-full border border-ivory-200 dark:border-charcoal-700 bg-ivory-50/90 dark:bg-charcoal-800 hover:border-saffron-400 dark:hover:border-saffron-600 transition-all cursor-pointer whitespace-nowrap select-none active:scale-95',
          compact ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1.5 text-xs'
        )}
        title="Chuyển đổi ngôn ngữ / Switch Language"
        aria-label="Chuyển đổi ngôn ngữ"
      >
        <span className="text-sm leading-none">{currentLanguage.flag}</span>
        <span className="font-semibold text-charcoal-800 dark:text-charcoal-100 uppercase">
          {currentLanguage.code}
        </span>
        {isTranslating ? (
          <span className="w-2.5 h-2.5 rounded-full border-2 border-saffron-500 border-t-transparent animate-spin" />
        ) : (
          <ChevronDown className="w-3 h-3 text-charcoal-400" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-700 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 border-b border-ivory-100 dark:border-charcoal-800 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
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
                    'w-full px-3 py-2 flex items-center justify-between text-left text-xs transition-colors whitespace-nowrap',
                    isSelected
                      ? 'bg-saffron-50 dark:bg-saffron-950/50 text-saffron-800 dark:text-saffron-300 font-semibold'
                      : 'text-charcoal-700 dark:text-charcoal-300 hover:bg-ivory-100 dark:hover:bg-charcoal-800'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base leading-none shrink-0">{item.flag}</span>
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


