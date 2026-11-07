'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UtensilsCrossed,
  Clock,
  Users,
  Heart,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Flame,
  CheckCircle,
} from 'lucide-react';
import { VEGETARIAN_RECIPES, VegetarianRecipe } from '@/lib/vegetarianRecipes';
import { cn } from '@/lib/utils';

export default function VegetarianRecipesPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'kho' | 'canh'>('all');
  const [activeRecipe, setActiveRecipe] = useState<VegetarianRecipe>(VEGETARIAN_RECIPES[0]);

  const filtered = VEGETARIAN_RECIPES.filter(
    (r) => selectedCategory === 'all' || r.category === selectedCategory
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 select-text">
      {/* Header */}
      <div className="space-y-4 border-b border-ivory-200 dark:border-charcoal-800 pb-6 animate-fade-in-up">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-saffron-700 dark:text-saffron-400 font-bold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Trang Chủ</span>
        </Link>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider whitespace-nowrap">
            <UtensilsCrossed className="w-4 h-4 text-emerald-600 animate-pulse-glow shrink-0" />
            <span>Nuôi Dưỡng Tâm Từ Bi • Dưỡng Thân An Lạc</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-4xl font-bold text-charcoal-900 dark:text-charcoal-50">
            Sổ Tay Món Chay Dưỡng Sinh
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-400 max-w-xl mx-auto leading-relaxed">
            Tuyển tập các món ăn chay thuần Việt thanh đạm, giàu dinh dưỡng và dễ nấu, giúp bồi bổ sức khỏe cho gia đình và vun đắp lòng thương xót muôn loài.
          </p>
        </div>

        {/* Category Filter — Always single-line pills on mobile & desktop */}
        <div className="grid grid-cols-3 sm:flex items-center justify-center gap-1.5 sm:gap-2.5 pt-2 max-w-md mx-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'px-2 sm:px-4 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all active:scale-95 text-center cursor-pointer',
              selectedCategory === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-ivory-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 hover:bg-ivory-200'
            )}
          >
            Tất cả món chay
          </button>
          <button
            onClick={() => setSelectedCategory('kho')}
            className={cn(
              'px-2 sm:px-4 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all active:scale-95 text-center cursor-pointer',
              selectedCategory === 'kho'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-ivory-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 hover:bg-ivory-200'
            )}
          >
            Món kho đậm đà
          </button>
          <button
            onClick={() => setSelectedCategory('canh')}
            className={cn(
              'px-2 sm:px-4 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all active:scale-95 text-center cursor-pointer',
              selectedCategory === 'canh'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-ivory-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 hover:bg-ivory-200'
            )}
          >
            Canh thanh nhiệt
          </button>
        </div>
      </div>

      {/* Main Content Layout: Recipe List on Left, Active Recipe on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recipe Cards Selection */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="font-heading font-bold text-sm text-charcoal-700 dark:text-charcoal-300 uppercase tracking-wider px-1 whitespace-nowrap">
            Danh Sách Món Ăn ({filtered.length}):
          </h2>

          <div className="space-y-2.5">
            {filtered.map((item) => {
              const isSelected = activeRecipe.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveRecipe(item)}
                  className={cn(
                    'p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-98',
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-sm ring-1 ring-emerald-500/30'
                      : 'border-ivory-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 hover:bg-ivory-50'
                  )}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-heading font-bold text-sm sm:text-base text-charcoal-900 dark:text-ivory-100 truncate">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-charcoal-500 dark:text-charcoal-400">
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {item.cookTime}
                      </span>
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {item.servings}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={cn('w-4 h-4 text-charcoal-400 shrink-0', isSelected && 'text-emerald-600 translate-x-1 transition-transform')} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Cooking Recipe */}
        <div className="lg:col-span-7 bg-white dark:bg-charcoal-800 rounded-3xl border border-ivory-200 dark:border-charcoal-700 shadow-md p-5 sm:p-7 space-y-6 animate-fade-in">
          <div className="space-y-2 border-b border-ivory-100 dark:border-charcoal-700 pb-4">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider whitespace-nowrap">
              {activeRecipe.category === 'kho' ? 'Món kho dưỡng sinh' : 'Canh dưỡng tâm'}
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-charcoal-900 dark:text-ivory-100">
              {activeRecipe.name}
            </h2>
            <p className="text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed italic">
              {activeRecipe.description}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-2xl bg-ivory-50 dark:bg-charcoal-900/60 border border-ivory-200 dark:border-charcoal-700">
            <div className="min-w-0">
              <p className="text-[11px] text-charcoal-500 whitespace-nowrap">Thời gian</p>
              <p className="font-bold text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 whitespace-nowrap truncate">{activeRecipe.cookTime}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-charcoal-500 whitespace-nowrap">Khẩu phần</p>
              <p className="font-bold text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 whitespace-nowrap truncate">{activeRecipe.servings}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-charcoal-500 whitespace-nowrap">Độ khó</p>
              <p className="font-bold text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 whitespace-nowrap truncate">{activeRecipe.difficulty}</p>
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-2.5">
            <h3 className="font-heading font-bold text-base text-charcoal-900 dark:text-ivory-100 flex items-center gap-1.5">
              <span>🛒 Nguyên Liệu Chuẩn Bị:</span>
            </h3>
            <ul className="space-y-1.5 pl-2">
              {activeRecipe.ingredients.map((ing, idx) => (
                <li key={idx} className="text-sm text-charcoal-700 dark:text-charcoal-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cooking Steps */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-base text-charcoal-900 dark:text-ivory-100 flex items-center gap-1.5">
              <span>🍳 Các Bước Thực Hiện:</span>
            </h3>
            <div className="space-y-2.5">
              {activeRecipe.steps.map((step, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-ivory-50/70 dark:bg-charcoal-900/40 border border-ivory-100 dark:border-charcoal-700 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-charcoal-700 dark:text-charcoal-200 leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Health Benefit Badge */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
              <Heart className="w-4 h-4 text-emerald-600" />
              <span>Giá Trị Dưỡng Sinh &amp; Sức Khỏe:</span>
            </div>
            <p className="leading-relaxed">{activeRecipe.healthBenefit}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

