'use client';

import React from 'react';
import Link from 'next/link';
import {
  Edit3,
  Camera,
  ChevronRight,
  BookOpen,
  Heart,
  Calendar,
  Clock,
  BarChart2,
  Settings,
  Share2,
  Sparkles,
  ExternalLink,
  LogOut,
  Bell,
  Check,
} from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { cn } from '@/lib/utils';

export interface OmManiDesktopProfileProps {
  dharmaName: string;
  fullName: string;
  userMotto: string;
  refugeDate: string;
  refugeTemple: string;
  masterName: string;
  onOpenEditProfile: () => void;
  onOpenSettings: () => void;
  onOpenMemorial: () => void;
  onOpenPersonalEvents: () => void;
  onOpenMeditationSchedule: () => void;
  onOpenSupport: () => void;
  onLogout: () => void;
  showToast: (msg: string) => void;
}

const PRACTICE_METRICS = [
  { id: 'tung-kinh', name: 'Tụng kinh', value: '0 lần', icon: BookOpen, subtext: 'Chưa có thời khóa hôm nay' },
  { id: 'thien-dinh', name: 'Thiền định', value: '0 phút', icon: Clock, subtext: 'Chưa có thời khóa hôm nay' },
  { id: 'chuoi-hat', name: 'Lần chuỗi hạt', value: '0 hạt', icon: Sparkles, subtext: 'Trì niệm danh hiệu Phật' },
  { id: 'cau-nguyen', name: 'Cầu nguyện', value: '0 lời cầu', icon: Heart, subtext: 'Hồi hướng bình an' },
  { id: 'thong-ke', name: 'Thống kê tiến trình', value: 'Chi tiết', icon: BarChart2, subtext: 'Xem biểu đồ tuần & tháng' },
];

const NOVEMBER_DAYS = [
  { solar: '26', isPrev: true },
  { solar: '27', isPrev: true },
  { solar: '28', isPrev: true },
  { solar: '29', isPrev: true },
  { solar: '30', isPrev: true },
  { solar: '31', isPrev: true },
  { solar: '1', isSunday: true },
  { solar: '2' },
  { solar: '3' },
  { solar: '4' },
  { solar: '5' },
  { solar: '6' },
  { solar: '7' },
  { solar: '8', isToday: true, isSunday: true },
  { solar: '9' },
  { solar: '10' },
  { solar: '11' },
  { solar: '12' },
  { solar: '13' },
  { solar: '14' },
  { solar: '15', isSunday: true },
  { solar: '16' },
  { solar: '17' },
  { solar: '18' },
  { solar: '19' },
  { solar: '20' },
  { solar: '21' },
  { solar: '22', isSunday: true },
  { solar: '23' },
  { solar: '24' },
  { solar: '25' },
  { solar: '26' },
  { solar: '27' },
  { solar: '28' },
  { solar: '29', isSunday: true },
  { solar: '30' },
  { solar: '1', isNext: true },
  { solar: '2', isNext: true },
  { solar: '3', isNext: true },
  { solar: '4', isNext: true },
  { solar: '5', isNext: true },
  { solar: '6', isNext: true },
];

export function OmManiDesktopProfile({
  dharmaName,
  fullName,
  userMotto,
  refugeDate,
  refugeTemple,
  masterName,
  onOpenEditProfile,
  onOpenSettings,
  onOpenMemorial,
  onOpenPersonalEvents,
  onOpenMeditationSchedule,
  onOpenSupport,
  onLogout,
  showToast,
}: OmManiDesktopProfileProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER TITLE                                                       */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#E5B548] via-[#FFE082] to-[#B38328] shadow-[0_0_15px_rgba(212,175,55,0.35)] flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#1F140D] flex items-center justify-center">
              <BuddhaBodhiIcon className="w-6 h-6 text-[#FFE082]" />
            </div>
          </div>
          <div>
            <h1 className="font-heading font-serif text-2xl font-black text-white flex items-center gap-2.5">
              <span>Hồ Sơ Phật Tử &amp; Hành Trình Tu Tập</span>
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Theo dõi sự tinh tấn, ghi nhớ công đức và gìn giữ hạt giống Bồ Đề mỗi ngày
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenEditProfile}
            className="px-4 py-2 rounded-2xl bg-[#1C140E] border border-amber-500/40 hover:border-amber-300 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-md"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Chỉnh Sửa Hồ Sơ</span>
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2.5 rounded-2xl bg-[#1C140E] border border-white/10 hover:border-amber-400/50 text-stone-300 hover:text-white transition-all active:scale-95 cursor-pointer shadow-md"
            title="Cài đặt hệ thống"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TWO-COLUMN DASHBOARD (4 COLS PROFILE & 8 COLS PRACTICE DASHBOARD)      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Left Column (4 cols) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* User Profile Overview Card */}
          <div className="rounded-3xl bg-[#18110B] border border-amber-500/25 shadow-xl overflow-hidden">
            {/* Top Banner Image with Buddha & Petals */}
            <div className="relative h-28 bg-gradient-to-r from-[#3E2112] via-[#2A160C] to-[#1C0E08] overflow-hidden">
              <img
                src="/images/buddha_teaching.jpg"
                alt="Banner"
                className="w-full h-full object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#18110B] via-transparent to-transparent" />
            </div>

            {/* Overlapping Avatar */}
            <div className="px-6 pb-6 text-center -mt-14 relative z-10 space-y-4">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full border-4 border-[#18110B] bg-gradient-to-tr from-[#E5B548] via-[#FFE082] to-[#B38328] shadow-2xl p-1 flex items-center justify-center mx-auto">
                  <div className="w-full h-full rounded-full bg-[#20150E] flex flex-col items-center justify-center text-center">
                    <BuddhaBodhiIcon className="w-8 h-8 text-[#FFE082]" />
                    <span className="text-[9px] font-bold text-[#FFE082] tracking-widest mt-0.5">OMA</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenEditProfile}
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white text-stone-900 border border-stone-300 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Thay ảnh đại diện"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h3 className="font-heading font-serif font-bold text-xl text-white">
                  {dharmaName}
                </h3>
                {fullName && (
                  <p className="text-xs text-stone-400 font-mono mt-0.5">
                    Thế danh: {fullName}
                  </p>
                )}
                <p className="text-xs text-amber-200/80 italic font-serif mt-2 px-2">
                  &ldquo;{userMotto}&rdquo;
                </p>
              </div>

              {/* Dharma Refuge Credentials */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 text-xs text-left space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span>Ngày Quy Y Tam Bảo:</span>
                  <span className="text-stone-200 font-mono font-medium">{refugeDate || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex items-center justify-between text-stone-400">
                  <span>Chùa Quy Y:</span>
                  <span className="text-stone-200 font-medium">{refugeTemple || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex items-center justify-between text-stone-400">
                  <span>Bổn Sư Truyền Giới:</span>
                  <span className="text-amber-300 font-medium">{masterName || 'Chưa cập nhật'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Tools Card */}
          <div className="p-5 rounded-3xl bg-[#18110B] border border-amber-500/25 shadow-xl space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 pb-2 border-b border-amber-500/15">
              Sổ Tay &amp; Lịch Cá Nhân
            </h4>

            <div className="space-y-1">
              <button
                type="button"
                onClick={onOpenMemorial}
                className="w-full p-3 rounded-2xl bg-[#20150E] hover:bg-[#2A1C13] border border-white/5 hover:border-amber-400/40 text-left flex items-center justify-between group transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">📜</span>
                  <div>
                    <h5 className="text-xs font-bold text-white group-hover:text-amber-200">
                      Sổ Giỗ Chạp
                    </h5>
                    <p className="text-[11px] text-stone-400">Ghi nhớ ngày giỗ thân quyến</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-300" />
              </button>

              <button
                type="button"
                onClick={onOpenPersonalEvents}
                className="w-full p-3 rounded-2xl bg-[#20150E] hover:bg-[#2A1C13] border border-white/5 hover:border-amber-400/40 text-left flex items-center justify-between group transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">📅</span>
                  <div>
                    <h5 className="text-xs font-bold text-white group-hover:text-amber-200">
                      Sự Kiện Cá Nhân
                    </h5>
                    <p className="text-[11px] text-stone-400">Tạo &amp; quản lý lời nhắc việc thiện</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-300" />
              </button>

              <button
                type="button"
                onClick={onOpenMeditationSchedule}
                className="w-full p-3 rounded-2xl bg-[#20150E] hover:bg-[#2A1C13] border border-white/5 hover:border-amber-400/40 text-left flex items-center justify-between group transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">⏰</span>
                  <div>
                    <h5 className="text-xs font-bold text-white group-hover:text-amber-200">
                      Lịch Nhắc Thiền Định
                    </h5>
                    <p className="text-[11px] text-stone-400">Chuông nhắc thiền sáng và tối</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-300" />
              </button>
            </div>
          </div>

          {/* Support & Community Card */}
          <div className="p-5 rounded-3xl bg-[#18110B] border border-amber-500/25 shadow-xl space-y-4">
            <button
              type="button"
              onClick={onOpenSupport}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#291A11] to-[#1C120C] border border-amber-500/30 hover:border-amber-400 flex items-center justify-between transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🪷</span>
                <div className="text-left">
                  <h5 className="text-xs font-bold text-white group-hover:text-amber-200">
                    Ủng Hộ Om Mani
                  </h5>
                  <p className="text-[11px] text-stone-400">Tiếp sức lan tỏa Chánh pháp</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-300" />
            </button>

            {/* Social Community Buttons */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Cộng Đồng Tu Học
              </span>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <a
                  href="https://zalo.me"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-[#20150E] hover:bg-[#2A1D15] border border-white/5 text-stone-300 hover:text-white flex flex-col items-center justify-center gap-1 transition-all"
                >
                  <span className="font-bold text-blue-400">Zalo</span>
                  <span className="text-[10px] text-stone-500">Nhóm</span>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-[#20150E] hover:bg-[#2A1D15] border border-white/5 text-stone-300 hover:text-white flex flex-col items-center justify-center gap-1 transition-all"
                >
                  <span className="font-bold text-blue-500">FB</span>
                  <span className="text-[10px] text-stone-500">Fanpage</span>
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-[#20150E] hover:bg-[#2A1D15] border border-white/5 text-stone-300 hover:text-white flex flex-col items-center justify-center gap-1 transition-all"
                >
                  <span className="font-bold text-rose-400">TikTok</span>
                  <span className="text-[10px] text-stone-500">Video</span>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-[#20150E] hover:bg-[#2A1D15] border border-white/5 text-stone-300 hover:text-white flex flex-col items-center justify-center gap-1 transition-all"
                >
                  <span className="font-bold text-red-500">YouTube</span>
                  <span className="text-[10px] text-stone-500">Pháp Âm</span>
                </a>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={onLogout}
                className="w-full py-2.5 rounded-xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng Xuất Tài Khoản</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Practice Analytics & Heatmap (8 cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Top Big Practice Number Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#241710] via-[#1C120C] to-[#120B07] border border-amber-500/30 shadow-2xl relative overflow-hidden space-y-4">
            <div className="absolute top-2 right-2 w-48 h-48 opacity-10 pointer-events-none">
              <BuddhaBodhiIcon className="w-full h-full text-amber-400" />
            </div>

            <div className="flex items-start justify-between relative z-10">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-300">
                  Hành Trình Chánh Niệm
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-mono text-4xl sm:text-5xl font-black text-[#FFE082]">
                    0
                  </span>
                  <span className="text-sm font-semibold text-stone-300">
                    ngày tinh tấn
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  Tháng 11 năm 2026: 0 ngày tu tập hoàn thành
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-semibold inline-block">
                  Hôm nay: 08/11/2026
                </span>
                <p className="text-[11px] text-amber-200/70 mt-1">
                  Hãy bắt đầu một thời khóa tĩnh tâm
                </p>
              </div>
            </div>

            {/* Practice Calendar Heatmap (7 columns) */}
            <div className="pt-3 border-t border-amber-500/15 space-y-2">
              <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-mono text-stone-400 uppercase">
                <span>T2</span>
                <span>T3</span>
                <span>T4</span>
                <span>T5</span>
                <span>T6</span>
                <span>T7</span>
                <span className="text-red-400">CN</span>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {NOVEMBER_DAYS.map((day, idx) => (
                  <div
                    key={`${day.solar}-${idx}`}
                    className={cn(
                      'h-9 rounded-xl flex items-center justify-center font-mono text-xs transition-all relative',
                      day.isToday
                        ? 'bg-amber-500 text-charcoal-950 font-black shadow-md ring-2 ring-amber-300'
                        : day.isPrev || day.isNext
                        ? 'bg-black/20 text-stone-600'
                        : day.isSunday
                        ? 'bg-[#20150E] text-red-300/80 font-bold'
                        : 'bg-[#20150E] text-stone-300 hover:bg-[#2A1D15]'
                    )}
                  >
                    <span>{day.solar}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5 Practice Metrics Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {PRACTICE_METRICS.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.id}
                  className="p-4 rounded-2xl bg-[#18110B] border border-amber-500/20 hover:border-amber-400/50 shadow-xl space-y-2 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-300 group-hover:text-amber-200">
                      {metric.name}
                    </span>
                    <Icon className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="font-mono text-lg font-bold text-white">
                    {metric.value}
                  </div>
                  <p className="text-[11px] text-stone-500 truncate">
                    {metric.subtext}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Memorial & Ancestor Remembrance Section */}
          <div className="p-6 rounded-3xl bg-[#18110B] border border-amber-500/25 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/15">
              <div className="flex items-center gap-2">
                <span className="text-base">📜</span>
                <h3 className="font-heading font-serif font-bold text-sm text-[#FFE082]">
                  Sổ Giỗ Chạp &amp; Tưởng Niệm Tiên Tổ
                </h3>
              </div>
              <button
                type="button"
                onClick={onOpenMemorial}
                className="text-xs text-amber-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>+ Thêm ngày giỗ</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Truyền thống &ldquo;Uống nước nhớ nguồn&rdquo; là đạo lý căn bản của người con Phật. Om Mani sẽ tự động chuyển đổi ngày âm lịch và nhắc nhở quý vị trước 3 ngày để chuẩn bị lễ tưởng niệm, cầu siêu thanh tịnh.
            </p>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
              <div className="text-xs space-y-0.5">
                <span className="text-amber-200 font-bold">Chưa có ngày giỗ nào được lưu</span>
                <p className="text-stone-500">Nhấn &ldquo;Thêm ngày giỗ&rdquo; để ghi nhớ ngày kỷ niệm thân quyến</p>
              </div>
              <button
                type="button"
                onClick={onOpenMemorial}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-amber-300 text-xs font-semibold cursor-pointer"
              >
                Thêm ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

