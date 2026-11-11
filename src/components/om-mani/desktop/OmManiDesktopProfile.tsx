'use client';

import React from 'react';
import {
  Edit3,
  Camera,
  ChevronRight,
  Settings,
  LogOut,
  Check,
} from 'lucide-react';
import {
  DharmaWheelIcon,
  LotusMinimalIcon,
  BodhiLeafIcon,
  MalaBeadsMinimalIcon,
  SutraScrollIcon,
  MeditatingMonkOutlineIcon,
  TempleBellIcon,
  PagodaMinimalIcon,
} from '@/components/icons/DharmaMinimalIcons';
import { DharmaMeritEntry } from '@/components/om-mani/OmManiInteractiveTools';
import { cn } from '@/lib/utils';

export interface PreceptItem {
  id: string;
  number: string;
  title: string;
  pali: string;
  desc: string;
}

export interface OmManiDesktopProfileProps {
  dharmaName: string;
  fullName: string;
  userMotto: string;
  refugeDate: string;
  refugeTemple: string;
  masterName: string;
  preceptsList: PreceptItem[];
  checkedPrecepts: string[];
  onTogglePrecept: (id: string) => void;
  onConfirmPreceptsToday: () => void;
  meritLedger: DharmaMeritEntry[];
  totalMeritPoints: number;
  bodhiStageTitle: string;
  onOpenEditProfile: () => void;
  onOpenSettings: () => void;
  onOpenMemorial: () => void;
  onOpenPersonalEvents: () => void;
  onOpenMeditationSchedule: () => void;
  onOpenSupport: () => void;
  onLogout: () => void;
  showToast: (msg: string) => void;
}

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
  preceptsList,
  checkedPrecepts,
  onTogglePrecept,
  onConfirmPreceptsToday,
  meritLedger,
  totalMeritPoints,
  bodhiStageTitle,
  onOpenEditProfile,
  onOpenSettings,
  onOpenMemorial,
  onOpenPersonalEvents,
  onOpenMeditationSchedule,
  onOpenSupport,
  onLogout,
}: OmManiDesktopProfileProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER TITLE                                                       */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#EEDBBA]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl p-[1.5px] bg-gradient-to-tr from-[#E5A91C] via-[#FFD966] to-[#F5C542] shadow-[0_0_20px_rgba(245,197,66,0.3)] flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center">
              <BodhiLeafIcon className="w-6 h-6 text-[#8C5500]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFF4D0] border border-[#EEDBBA] text-[10px] font-bold uppercase tracking-widest text-[#8C5500]">
                DHARMA UPĀSAKA PROFILE
              </span>
              <span className="text-xs text-[#7D6442]">
                Thẻ Cư Sĩ Hoàng Kim • Tự Kiểm Ngũ Giới &amp; Sổ Công Đức
              </span>
            </div>
            <h1 className="font-heading font-serif text-2xl font-bold text-[#2E1E0F] mt-1">
              Hồ Sơ Cư Sĩ &amp; Cây Bồ Đề Công Đức
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenEditProfile}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-md"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Cập Nhật Thẻ Cư Sĩ</span>
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2.5 rounded-2xl bg-white border border-[#EEDBBA] hover:border-[#E5C158] text-[#8C5500] transition-all active:scale-95 cursor-pointer shadow-md"
            title="Cài đặt ứng dụng Dharma"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TWO-COLUMN DASHBOARD (4 COLS LAYPERSON CARD & 8 COLS PRECEPTS/MERIT)   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Left Column (4 cols): Digital Golden Layperson ID Card & Quick Tools */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* THẺ CƯ SĨ HOÀNG KIM (DIGITAL DHARMA LAYPERSON ID CARD) */}
          <div className="rounded-3xl bg-gradient-to-br from-[#FFFDF2] via-[#FFF9E6] to-[#FFF4D1] border border-[#ECD9A8] shadow-2xl overflow-hidden">
            {/* Top Banner Image with Golden Buddha Altar */}
            <div className="relative h-32 bg-white overflow-hidden">
              <img
                src="/images/golden_buddha_altar.jpg"
                alt="Thẻ Cư Sĩ Dharma"
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white border border-[#ECD9A8] text-[10px] font-bold uppercase tracking-widest text-[#8C5500]">
                THẺ CƯ SĨ TAM BẢO • DHARMA
              </div>
            </div>

            {/* Overlapping Dharma Wheel Seal Avatar */}
            <div className="px-6 pb-6 text-center -mt-14 relative z-10 space-y-4">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-3xl border-4 border-white bg-white shadow-2xl overflow-hidden flex items-center justify-center mx-auto ring-2 ring-[#F5C542]/60">
                  <img
                    src="/dharma-logo.png"
                    alt="Dharma Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={onOpenEditProfile}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-[#FFD966] text-[#3D2505] border border-[#ECD9A8] shadow-md flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
                  title="Cập nhật Pháp danh"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C5500] block">
                  Pháp Danh Cư Sĩ
                </span>
                <h3 className="font-heading font-serif font-bold text-xl text-[#2E1E0F] mt-0.5">
                  {dharmaName}
                </h3>
                {fullName && (
                  <p className="text-xs text-[#7D6442] font-mono mt-0.5">
                    Thế danh: {fullName}
                  </p>
                )}
                <p className="text-xs text-[#5A4329] italic font-serif mt-2 px-2">
                  “{userMotto}”
                </p>
              </div>

              {/* Dharma Refuge Credentials */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#EEDBBA] text-xs text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#7D6442]">Ngày Quy Y Tam Bảo:</span>
                  <span className="text-[#2E1E0F] font-mono font-bold">{refugeDate || '01/01/2024'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7D6442]">Đạo Tràng / Tự Viện:</span>
                  <span className="text-[#2E1E0F] font-semibold">{refugeTemple}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7D6442]">Bổn Sư Truyền Giới:</span>
                  <span className="text-[#8C5500] font-bold">{masterName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Dharma Notebooks Card */}
          <div className="p-5 rounded-3xl bg-white border border-[#EEDBBA] shadow-xl space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C5500] pb-2 border-b border-[#EEDBBA]">
              Sổ Tay Hành Trì Cá Nhân
            </h4>

            <div className="space-y-2">
              <button
                type="button"
                onClick={onOpenMemorial}
                className="w-full p-3 rounded-2xl bg-white hover:bg-[#FFF9EA] border border-[#EEDBBA] hover:border-[#E5C158] text-left flex items-center justify-between group transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF4D0] border border-[#EEDBBA] flex items-center justify-center text-[#8C5500]">
                    <LotusMinimalIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#2E1E0F] group-hover:text-[#8C5500]">
                      Sổ Hiếu Hạnh Gia Tiên
                    </h5>
                    <p className="text-[11px] text-[#7D6442]">Ghi nhớ ngày húy kỵ cửu huyền thất tổ</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#7D6442] group-hover:text-[#8C5500]" />
              </button>

              <button
                type="button"
                onClick={onOpenPersonalEvents}
                className="w-full p-3 rounded-2xl bg-white hover:bg-[#FFF9EA] border border-[#EEDBBA] hover:border-[#E5C158] text-left flex items-center justify-between group transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF4D0] border border-[#EEDBBA] flex items-center justify-center text-[#8C5500]">
                    <PagodaMinimalIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#2E1E0F] group-hover:text-[#8C5500]">
                      Lịch Trai Giới &amp; Phật Sự
                    </h5>
                    <p className="text-[11px] text-[#7D6442]">Quản lý lời nhắc thọ trai &amp; lễ chùa</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#7D6442] group-hover:text-[#8C5500]" />
              </button>

              <button
                type="button"
                onClick={onOpenMeditationSchedule}
                className="w-full p-3 rounded-2xl bg-white hover:bg-[#FFF9EA] border border-[#EEDBBA] hover:border-[#E5C158] text-left flex items-center justify-between group transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF4D0] border border-[#EEDBBA] flex items-center justify-center text-[#8C5500]">
                    <TempleBellIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#2E1E0F] group-hover:text-[#8C5500]">
                      Chuông Nhắc Tọa Thiền
                    </h5>
                    <p className="text-[11px] text-[#7D6442]">Báo thức thời khóa công phu sáng &amp; tối</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#7D6442] group-hover:text-[#8C5500]" />
              </button>
            </div>
          </div>

          {/* Support Dharma & Logout Card */}
          <div className="p-5 rounded-3xl bg-white border border-[#EEDBBA] shadow-xl space-y-3">
            <button
              type="button"
              onClick={onOpenSupport}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#FFFDF5] to-[#FFF9E6] border border-[#ECD9A8] hover:border-[#E5C158] flex items-center justify-between transition-all group cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFF4D0] border border-[#ECD9A8] flex items-center justify-center text-[#8C5500]">
                  <DharmaWheelIcon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h5 className="text-xs font-bold text-[#2E1E0F] group-hover:text-[#8C5500]">
                    Ấn Tống Kinh Điển &amp; Hộ Trì Dharma
                  </h5>
                  <p className="text-[11px] text-[#7D6442]">Lan tỏa Pháp Bảo miễn phí đến muôn nơi</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8C5500]" />
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="w-full py-2.5 rounded-xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/25 text-red-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng Xuất Tài Khoản</span>
            </button>
          </div>
        </div>

        {/* Right Column (8 cols): Bodhi Tree Merit Progress + 5 Precepts + Merit Ledger */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* 1. CÂY BỒ ĐỀ CÔNG ĐỨC & LỊCH TINH TẤN */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FFFDF2] via-[#FFF9E6] to-[#FFF4D1] border border-[#ECD9A8] shadow-2xl relative overflow-hidden space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white border border-[#ECD9A8] flex items-center justify-center text-[#8C5500] shadow-[0_0_25px_rgba(245,197,66,0.25)]">
                  <BodhiLeafIcon className="w-9 h-9" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5500]">
                    Cây Bồ Đề Công Đức • {bodhiStageTitle}
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-mono text-3xl sm:text-4xl font-black text-[#2E1E0F]">
                      {totalMeritPoints}
                    </span>
                    <span className="text-xs font-bold text-[#8C5500] uppercase">
                      Điểm Công Đức Tích Lũy
                    </span>
                  </div>
                  <p className="text-xs text-[#6A5234] mt-0.5">
                    Đã ghi nhận {meritLedger.length} thời khóa hành trì trong Sổ Công Đức Dharma
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#FFF4D0] text-[#8C5500] border border-[#EEDBBA] font-bold inline-block">
                  Tháng 11 • 2026
                </span>
                <p className="text-[11px] text-[#5A4329] mt-1">
                  Tinh tấn mỗi ngày vun bồi gốc rễ Bồ Đề
                </p>
              </div>
            </div>

            {/* Practice Calendar Heatmap (7 columns) */}
            <div className="pt-3 border-t border-[#EEDBBA] space-y-2">
              <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-mono text-[#7D6442] uppercase font-bold">
                <span>T2</span>
                <span>T3</span>
                <span>T4</span>
                <span>T5</span>
                <span>T6</span>
                <span>T7</span>
                <span className="text-[#8C5500]">CN</span>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {NOVEMBER_DAYS.map((day, idx) => (
                  <div
                    key={`${day.solar}-${idx}`}
                    className={cn(
                      'h-9 rounded-xl flex items-center justify-center font-mono text-xs transition-all relative border',
                      day.isToday
                        ? 'bg-gradient-to-b from-[#F5C542] to-[#E5A91C] text-[#3D2505] border-[#FFF3B0] font-black shadow-md'
                        : day.isPrev || day.isNext
                        ? 'bg-white/40 border-transparent text-[#7D6442]/30'
                        : 'bg-white border-[#F2E5C7] text-[#2E1E0F]'
                    )}
                  >
                    <span>{day.solar}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. BẢNG TỰ KIỂM NGŨ GIỚI TẠI GIA (ORIGINAL DHARMA LAYPERSON FEATURE) */}
          <div className="p-6 rounded-3xl bg-white border border-[#EEDBBA] shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EEDBBA]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FFF4D0] border border-[#EEDBBA] flex items-center justify-center text-[#8C5500]">
                  <LotusMinimalIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-serif font-bold text-base text-[#8C5500]">
                    Bảng Tự Kiểm Ngũ Giới Cư Sĩ Tại Gia Hôm Nay
                  </h3>
                  <p className="text-xs text-[#7D6442]">
                    Đã giữ trọn {checkedPrecepts.length}/5 giới học • Nền tảng bảo hộ thân tâm và gia đạo bình an
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onConfirmPreceptsToday}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Xác Nhận Trì Giới (+25 Công Đức)</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {preceptsList.map((p) => {
                const isChecked = checkedPrecepts.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => onTogglePrecept(p.id)}
                    className={cn(
                      'p-3.5 rounded-2xl border flex items-start justify-between gap-3 cursor-pointer transition-all',
                      isChecked
                        ? 'bg-[#FFF9EA] border-[#E5C158] shadow-sm'
                        : 'bg-white border-[#EEDBBA] hover:border-[#E5C158]'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all',
                          isChecked
                            ? 'bg-[#F5C542] border-[#FFF3B0] text-[#3D2505]'
                            : 'bg-white border-[#EEDBBA] text-transparent'
                        )}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FFF4D0] text-[#8C5500]">
                            {p.number}
                          </span>
                          <h4 className="font-heading font-serif font-bold text-sm text-[#2E1E0F]">
                            {p.title}
                          </h4>
                          <span className="text-[11px] font-mono italic text-[#7D6442]">
                            ({p.pali})
                          </span>
                        </div>
                        <p className="text-xs text-[#5A4329]/90 mt-1 leading-relaxed">
                          {p.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. SỔ CÔNG ĐỨC HỒI HƯỚNG TRỰC TIẾP (LIVE MERIT LEDGER) */}
          <div className="p-6 rounded-3xl bg-white border border-[#EEDBBA] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEDBBA]">
              <div className="flex items-center gap-2">
                <SutraScrollIcon className="w-5 h-5 text-[#8C5500]" />
                <h3 className="font-heading font-serif font-bold text-base text-[#8C5500]">
                  Nhật Ký Sổ Công Đức Hồi Hướng
                </h3>
              </div>
              <span className="text-xs font-mono text-[#6A5234]">
                {meritLedger.length} thời khóa đã ghi nhận
              </span>
            </div>

            {meritLedger.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white border border-[#F2E5C7] text-center space-y-2">
                <p className="text-xs text-[#5A4329]">
                  Hãy thực hành Dâng Hương, Lần Chuỗi 108 Hạt, Tọa Thiền, Tụng Kinh hoặc Xác Nhận Trì Giới để ghi nhận vào Sổ Công Đức.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {meritLedger.slice(0, 8).map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-white border border-[#EEDBBA] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <h5 className="font-heading font-serif font-bold text-xs text-[#2E1E0F] truncate">
                        {item.title}
                      </h5>
                      <p className="text-[11px] text-[#7D6442] truncate mt-0.5">
                        {item.detail}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#FFF4D0] border border-[#EEDBBA] text-[10px] font-mono font-bold text-[#8C5500] shrink-0">
                      +{item.meritPoints} công đức
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
