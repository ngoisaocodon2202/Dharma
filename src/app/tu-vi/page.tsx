'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { BuddhistDatePicker } from '@/components/ui/BuddhistDatePicker';
import { useAuth } from '@/components/auth/AuthContext';
import {
  calculateCanChiAndMenh,
  GIO_SINH_OPTIONS,
  FOCUS_AREAS,
  CanChiInfo,
} from '@/lib/tu-vi-calc';
import {
  Sparkles,
  History,
  Calendar,
  Clock,
  User,
  Heart,
  Briefcase,
  Coins,
  Shield,
  HelpCircle,
  Share2,
  Trash2,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Printer,
  Compass,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sun,
  Moon,
} from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { cn } from '@/lib/utils';
import { CustomSelect } from '@/components/ui/CustomSelect';

const VIEW_YEAR_OPTIONS = [
  { value: '2026', label: 'Năm 2026 (Bính Ngọ - Thiên Hà Thủy) ★ Trọng tâm' },
  { value: '2025', label: 'Năm 2025 (Ất Tỵ - Phú Đăng Hỏa)' },
  { value: '2027', label: 'Năm 2027 (Đinh Mùi - Thiên Hà Thủy)' },
];

interface HistoryItem {
  id: string;
  full_name: string;
  gender: string;
  birth_date: string;
  birth_hour: string;
  calendar_type: string;
  view_year: number;
  focus_area: string;
  can_chi: string;
  menh: string;
  cung: string;
  reading_result: any;
  created_at: string;
}

export default function TuViPage() {
  const { user, openAuthModal } = useAuth();

  // Tab: 'form' (Lập lá số & xem) or 'history' (Lịch sử tử vi)
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');

  // Form states
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [birthDate, setBirthDate] = useState('1998-06-15');
  const [birthHour, setBirthHour] = useState('Ngo');
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  const [viewYear, setViewYear] = useState(2026);
  const [focusArea, setFocusArea] = useState('tong_quan');
  const [wishes, setWishes] = useState('');

  // Execution & Result states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);

  // History states
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Auto-fill user name if logged in and not yet filled
  useEffect(() => {
    if (user?.full_name && !fullName) {
      setFullName(user.full_name);
    }
  }, [user]);

  // Live preview calculation based on birthDate
  const previewData: CanChiInfo | null = useMemo(() => {
    if (!birthDate) return null;
    const parts = birthDate.split('-');
    const year = parseInt(parts[0], 10);
    if (isNaN(year) || year < 1920 || year > 2030) return null;
    return calculateCanChiAndMenh(year, gender, viewYear);
  }, [birthDate, gender, viewYear]);

  // Fetch history from DB (if user logged in) + localStorage
  const loadHistory = async () => {
    setIsLoadingHistory(true);
    let combinedHistory: HistoryItem[] = [];

    // 1. Load from localStorage
    try {
      const localData = localStorage.getItem('tu_vi_local_history');
      if (localData) {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed)) {
          combinedHistory = [...parsed];
        }
      }
    } catch (e) {
      console.warn('Lỗi đọc local history:', e);
    }

    // 2. Load from PostgreSQL if user is logged in
    if (user?.id) {
      try {
        const res = await fetch('/api/tu-vi/history');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.history)) {
            // Merge unique by id
            const existingIds = new Set(combinedHistory.map((h) => h.id));
            const newDbItems = data.history.filter((h: HistoryItem) => !existingIds.has(h.id));
            combinedHistory = [...newDbItems, ...combinedHistory];
          }
        }
      } catch (err) {
        console.error('Lỗi tải lịch sử từ máy chủ:', err);
      }
    }

    // Sort by created_at desc
    combinedHistory.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setHistoryList(combinedHistory);
    setIsLoadingHistory(false);
  };

  useEffect(() => {
    loadHistory();
  }, [user]);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Vui lòng nhập Họ và Tên của bạn');
      return;
    }
    if (!birthDate) {
      setErrorMsg('Vui lòng chọn Ngày tháng năm sinh');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/tu-vi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          gender,
          birthDate,
          birthHour,
          calendarType,
          viewYear,
          focusArea,
          wishes: wishes.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Không thể luận giải tử vi. Vui lòng thử lại.');
      }

      setResult(data.data);

      // Save to localStorage as well so it's instantly accessible even offline
      const newHistoryItem: HistoryItem = {
        id: data.savedId || `local_${Date.now()}`,
        full_name: fullName.trim(),
        gender,
        birth_date: birthDate,
        birth_hour: GIO_SINH_OPTIONS.find((g) => g.value === birthHour)?.label || birthHour,
        calendar_type: calendarType,
        view_year: viewYear,
        focus_area: FOCUS_AREAS.find((f) => f.value === focusArea)?.label || focusArea,
        can_chi: data.data.canChi,
        menh: data.data.menh,
        cung: data.data.cung,
        reading_result: data.data,
        created_at: new Date().toISOString(),
      };

      try {
        const existing = JSON.parse(localStorage.getItem('tu_vi_local_history') || '[]');
        const updated = [newHistoryItem, ...existing.filter((x: any) => x.id !== newHistoryItem.id)].slice(0, 30);
        localStorage.setItem('tu_vi_local_history', JSON.stringify(updated));
        setHistoryList((prev) => [newHistoryItem, ...prev.filter((x) => x.id !== newHistoryItem.id)]);
      } catch (e) {
        console.warn('Lỗi lưu local history:', e);
      }

      // Scroll to result smoothly
      setTimeout(() => {
        const el = document.getElementById('ket-qua-tu-vi');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete history item
  const handleDeleteHistory = async (item: HistoryItem) => {
    // Remove from local storage
    try {
      const existing = JSON.parse(localStorage.getItem('tu_vi_local_history') || '[]');
      const updated = existing.filter((x: any) => x.id !== item.id);
      localStorage.setItem('tu_vi_local_history', JSON.stringify(updated));
    } catch (e) {}

    // If item was stored in PostgreSQL and user is logged in
    if (!item.id.startsWith('local_') && user?.id) {
      try {
        await fetch(`/api/tu-vi/history?id=${item.id}`, { method: 'DELETE' });
      } catch (err) {
        console.error('Lỗi xóa lịch sử phía server:', err);
      }
    }

    setHistoryList((prev) => prev.filter((x) => x.id !== item.id));
    if (selectedHistoryItem?.id === item.id) {
      setSelectedHistoryItem(null);
    }
    setDeleteConfirmId(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-ivory-50/60 dark:bg-charcoal-950 text-charcoal-900 dark:text-charcoal-100 transition-colors pb-28 lg:pb-16">
      {/* Top Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-100/60 via-ivory-100/80 to-ivory-50/60 dark:from-charcoal-900 dark:via-charcoal-950 dark:to-charcoal-950 border-b border-ivory-200/90 dark:border-charcoal-800/80 py-10 sm:py-14">
        {/* Subtle decorative background circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-saffron-400/5 dark:bg-saffron-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron-100/90 dark:bg-saffron-950/60 border border-saffron-300/80 dark:border-saffron-800/80 text-saffron-800 dark:text-saffron-300 text-xs sm:text-sm font-medium mb-4 shadow-xs">
            <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
              <video
                src="/tuvi.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover scale-110 pointer-events-none"
              />
            </div>
            <span>Chiêm Bổn Tử Vi & Soi Sáng Nghiệp Duyên</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-charcoal-900 dark:text-charcoal-50 mb-3 sm:mb-4">
            Đức Năng Thắng Số • Chuyển Hóa Vận Mệnh
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-charcoal-600 dark:text-charcoal-300 font-sans leading-relaxed">
            Kết hợp tinh hoa Chiêm Tinh Học Đông Phương và Triết Lý Duyên Khởi Phật Giáo.
            Thấu tỏ thiên thời bản mệnh, khai mở trí tuệ chánh kiến, tu tâm tích đức chuyển hung thành cát.
          </p>

          {/* Tab Navigation */}
          <div className="mt-8 flex items-center justify-center">
            <div className="inline-flex p-1 rounded-xl bg-ivory-200/80 dark:bg-charcoal-800/90 border border-ivory-300/80 dark:border-charcoal-700 shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200',
                  activeTab === 'form'
                    ? 'bg-white dark:bg-charcoal-900 text-saffron-700 dark:text-saffron-400 shadow-sm'
                    : 'text-charcoal-600 dark:text-charcoal-400 hover:text-charcoal-900 dark:hover:text-charcoal-200'
                )}
              >
                <div className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                  <video
                    src="/tuvi.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-110 pointer-events-none"
                  />
                </div>
                <span>Xem Tử Vi Mới</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 relative',
                  activeTab === 'history'
                    ? 'bg-white dark:bg-charcoal-900 text-saffron-700 dark:text-saffron-400 shadow-sm'
                    : 'text-charcoal-600 dark:text-charcoal-400 hover:text-charcoal-900 dark:hover:text-charcoal-200'
                )}
              >
                <History className="w-4 h-4" />
                <span>Lịch Sử Đã Xem</span>
                {historyList.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-saffron-500 text-white">
                    {historyList.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* ===================== TAB 1: FORM & RESULT ===================== */}
        {activeTab === 'form' && (
          <div className="space-y-10">
            {/* Input Form Card */}
            <div className="bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-md rounded-2xl border border-ivory-300/80 dark:border-charcoal-800 shadow-md p-5 sm:p-7 md:p-9 relative">
              <div className="flex items-center gap-3 pb-5 border-b border-ivory-200 dark:border-charcoal-800 mb-6">
                <div className="w-10 h-10 rounded-xl bg-saffron-100 dark:bg-saffron-950/80 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-xs border border-saffron-200 dark:border-saffron-800">
                  <video
                    src="/tuvi.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-110 pointer-events-none"
                  />
                </div>
                <div>
                  <h2 className="font-heading text-lg sm:text-xl font-bold text-charcoal-900 dark:text-charcoal-50">
                    Thông Tin Bản Mệnh & Giờ Sinh
                  </h2>
                  <p className="text-xs sm:text-sm text-charcoal-500 dark:text-charcoal-400">
                    Nhập chính xác thông tin để hệ thống an sao lập tinh bàn và phân tích tối ưu
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Row 1: Họ tên & Giới tính */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs sm:text-sm font-semibold text-charcoal-800 dark:text-charcoal-200">
                      Họ và Tên Tín Chủ <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: Nguyễn Văn An"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-ivory-50/60 dark:bg-charcoal-800/80 border border-ivory-300 dark:border-charcoal-700 text-charcoal-900 dark:text-charcoal-100 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500/40 focus:border-saffron-500 transition-all placeholder:text-charcoal-400"
                      />
                      <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-semibold text-charcoal-800 dark:text-charcoal-200">
                      Giới Tính <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setGender('Nam')}
                        className={cn(
                          'py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all text-center',
                          gender === 'Nam'
                            ? 'bg-saffron-500 text-white border-saffron-600 shadow-sm'
                            : 'bg-ivory-50/60 dark:bg-charcoal-800/80 text-charcoal-700 dark:text-charcoal-300 border-ivory-300 dark:border-charcoal-700 hover:border-saffron-400'
                        )}
                      >
                        Nam
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('Nữ')}
                        className={cn(
                          'py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all text-center',
                          gender === 'Nữ'
                            ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                            : 'bg-ivory-50/60 dark:bg-charcoal-800/80 text-charcoal-700 dark:text-charcoal-300 border-ivory-300 dark:border-charcoal-700 hover:border-rose-400'
                        )}
                      >
                        Nữ
                      </button>
                    </div>
                  </div>
                </div>

                {/* Row 2: Ngày sinh & Loại lịch */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs sm:text-sm font-semibold text-charcoal-800 dark:text-charcoal-200">
                      Ngày Tháng Năm Sinh <span className="text-red-500">*</span>
                    </label>
                    <BuddhistDatePicker
                      required
                      value={birthDate}
                      onChange={(newDate) => setBirthDate(newDate)}
                      placeholder="Chọn ngày tháng năm sinh"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-semibold text-charcoal-800 dark:text-charcoal-200">
                      Hệ Thống Lịch
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCalendarType('solar')}
                        className={cn(
                          'flex items-center justify-center gap-1.5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all',
                          calendarType === 'solar'
                            ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                            : 'bg-ivory-50/60 dark:bg-charcoal-800/80 text-charcoal-700 dark:text-charcoal-300 border-ivory-300 dark:border-charcoal-700 hover:border-amber-400'
                        )}
                      >
                        <Sun className="w-3.5 h-3.5" />
                        <span>Dương lịch</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalendarType('lunar')}
                        className={cn(
                          'flex items-center justify-center gap-1.5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all',
                          calendarType === 'lunar'
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                            : 'bg-ivory-50/60 dark:bg-charcoal-800/80 text-charcoal-700 dark:text-charcoal-300 border-ivory-300 dark:border-charcoal-700 hover:border-indigo-400'
                        )}
                      >
                        <Moon className="w-3.5 h-3.5" />
                        <span>Âm lịch</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Preview Box when valid date is picked */}
                {previewData && (
                  <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-saffron-50 via-amber-50 to-ivory-100 dark:from-charcoal-800/90 dark:via-charcoal-800/70 dark:to-charcoal-900 border border-saffron-200/90 dark:border-charcoal-700 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-saffron-600 dark:text-saffron-400 flex-shrink-0 animate-pulse" />
                      <span className="font-medium text-charcoal-700 dark:text-charcoal-300">
                        Tuổi Can Chi: <strong className="text-saffron-800 dark:text-saffron-300">{previewData.canChi}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-charcoal-700 dark:text-charcoal-300">
                        Bản Mệnh: <strong className="text-saffron-800 dark:text-saffron-300">{previewData.menh}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-charcoal-700 dark:text-charcoal-300">
                        Cung Phi: <strong className="text-saffron-800 dark:text-saffron-300">{previewData.cung}</strong>
                      </span>
                    </div>
                  </div>
                )}

                {/* Row 3: Giờ sinh & Năm xem */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-semibold text-charcoal-800 dark:text-charcoal-200">
                      Giờ Sinh (12 Can Chi)
                    </label>
                    <CustomSelect
                      value={birthHour}
                      onChange={setBirthHour}
                      options={GIO_SINH_OPTIONS}
                      placeholder="-- Chọn giờ sinh --"
                      icon={<Clock className="w-4 h-4" />}
                      searchable={false}
                      allowClear={false}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-semibold text-charcoal-800 dark:text-charcoal-200">
                      Năm Cần Chiêm Nghiệm Vận Hạn
                    </label>
                    <CustomSelect
                      value={String(viewYear)}
                      onChange={(val) => setViewYear(parseInt(val, 10))}
                      options={VIEW_YEAR_OPTIONS}
                      placeholder="-- Chọn năm chiêm nghiệm --"
                      icon={<Calendar className="w-4 h-4" />}
                      searchable={false}
                      allowClear={false}
                    />
                  </div>
                </div>

                {/* Row 4: Khía cạnh quan tâm */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-charcoal-800 dark:text-charcoal-200">
                    Khía Cạnh Cần Soi Rọi Đặc Biệt
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {FOCUS_AREAS.map((f) => {
                      const isSelected = focusArea === f.value;
                      return (
                        <button
                          key={f.value}
                          type="button"
                          onClick={() => setFocusArea(f.value)}
                          className={cn(
                            'p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center gap-2.5',
                            isSelected
                              ? 'bg-saffron-50/90 dark:bg-saffron-950/60 border-saffron-500 text-saffron-900 dark:text-saffron-200 font-semibold shadow-xs'
                              : 'bg-ivory-50/50 dark:bg-charcoal-800/60 border-ivory-300/80 dark:border-charcoal-700/80 text-charcoal-700 dark:text-charcoal-300 hover:border-saffron-300'
                          )}
                        >
                          <span
                            className={cn(
                              'w-2 h-2 rounded-full flex-shrink-0',
                              isSelected ? 'bg-saffron-500' : 'bg-charcoal-300 dark:bg-charcoal-600'
                            )}
                          />
                          <span className="truncate">{f.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Row 5: Ước nguyện / Trăn trở thêm (Tùy chọn) */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <label className="block text-xs sm:text-sm font-semibold text-charcoal-800 dark:text-charcoal-200">
                      Trăn Trở Hoặc Ước Nguyện Trong Năm
                    </label>
                    <span className="text-[11px] text-charcoal-500 dark:text-charcoal-400 font-normal">
                      (Tùy chọn để AI thấu hiểu sâu hơn)
                    </span>
                  </div>
                  <div className="relative">
                    <textarea
                      rows={3}
                      maxLength={500}
                      placeholder="Ví dụ: Dự định chuyển đổi công việc, khởi sự kinh doanh, muốn chiêm nghiệm duyên khởi và cách tu tâm..."
                      value={wishes}
                      onChange={(e) => setWishes(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl bg-ivory-50/60 dark:bg-charcoal-800/80 border border-ivory-300 dark:border-charcoal-700 text-charcoal-900 dark:text-charcoal-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500/40 focus:border-saffron-500 transition-all placeholder:text-charcoal-400/80 resize-none min-h-[92px] leading-relaxed"
                    />
                    {wishes.length > 0 && (
                      <span className="absolute bottom-2.5 right-3 text-[10px] text-charcoal-400 pointer-events-none">
                        {wishes.length}/500
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 sm:py-4 px-6 rounded-xl font-heading text-sm sm:text-base font-bold text-white bg-gradient-to-r from-saffron-600 via-amber-600 to-saffron-700 hover:from-saffron-700 hover:to-amber-700 shadow-md hover:shadow-lg transition-all transform active:scale-[0.99] flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Đang An Sao Lập Tinh Bàn & Soi Sáng Nghiệp Duyên...</span>
                      </>
                    ) : (
                      <>
                        <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                          <video
                            src="/tuvi.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover scale-110 pointer-events-none"
                          />
                        </div>
                        <span>Xem Tử Vi & Khai Mở Vận Mệnh</span>
                      </>
                    )}
                  </button>

                  <p className="mt-3 text-center text-[11px] sm:text-xs text-charcoal-500 dark:text-charcoal-400">
                    ★ Tự động lưu trữ lịch sử để bạn có thể xem lại bất kỳ lúc nào trên máy và tài khoản
                  </p>
                </div>
              </form>
            </div>

            {/* ===================== RESULT DISPLAY SECTION ===================== */}
            {result && (
              <section id="ket-qua-tu-vi" className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
                {/* 1. Mệnh Bàn Header Card */}
                <div className="bg-gradient-to-br from-amber-700 via-amber-800 to-charcoal-900 text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-saffron-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-6 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 overflow-hidden shadow-inner flex-shrink-0">
                          <video
                            src="/tuvi.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover scale-110 pointer-events-none"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs uppercase tracking-widest text-saffron-300 font-semibold">
                              Lá Số Tử Vi & Nghiệp Duyên
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-medium">
                              Năm {result.namXemCanChi}
                            </span>
                          </div>
                          <h3 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mt-0.5">
                            {fullName || 'Tín Chủ'} • {gender}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handlePrint}
                          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/20 flex items-center gap-1.5 transition-all"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>In / Lưu PDF</span>
                        </button>
                      </div>
                    </div>

                    {/* Bento Matrix: Can Chi, Mệnh, Cung, Tuổi Âm */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                      <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                        <span className="text-[11px] text-amber-200 block">Năm Sinh Can Chi</span>
                        <strong className="text-base sm:text-lg font-heading text-white block mt-0.5">
                          {result.canChi}
                        </strong>
                        <span className="text-[11px] text-white/70 block">Tuổi mụ: {result.tuoiAm} tuổi</span>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                        <span className="text-[11px] text-amber-200 block">Bản Mệnh Nạp Âm</span>
                        <strong className="text-base sm:text-lg font-heading text-white block mt-0.5">
                          {result.nguHanh}
                        </strong>
                        <span className="text-[11px] text-white/70 truncate block">{result.menh}</span>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                        <span className="text-[11px] text-amber-200 block">Cung Mạng Bát Trạch</span>
                        <strong className="text-base sm:text-lg font-heading text-white block mt-0.5">
                          {result.cung?.split(' ')[0] || 'Cung Cát'}
                        </strong>
                        <span className="text-[11px] text-white/70 truncate block">{result.cung}</span>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                        <span className="text-[11px] text-amber-200 block">Vận Hạn Năm Xem</span>
                        <strong className="text-base sm:text-lg font-heading text-saffron-300 block mt-0.5">
                          {viewYear} ({result.namXemCanChi})
                        </strong>
                        <span className="text-[11px] text-white/70 block">Đức năng thắng số</span>
                      </div>
                    </div>

                    {/* Chỉ số may mắn nhanh */}
                    <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-white/90">
                      <div>
                        <span className="text-amber-200 block text-[10px]">Màu Hợp Mệnh:</span>
                        <span className="font-medium">{result.mauSacMayMan?.join(', ') || 'Vàng, Trắng'}</span>
                      </div>
                      <div>
                        <span className="text-amber-200 block text-[10px]">Con Số May Mắn:</span>
                        <span className="font-medium">{result.conSoMayMan?.join(', ') || '6, 8, 9'}</span>
                      </div>
                      <div>
                        <span className="text-amber-200 block text-[10px]">Tuổi Tam Hợp/Lục Hợp:</span>
                        <span className="font-medium">{result.tuoiHop?.join(', ') || 'Ất Mão, Đinh Mùi'}</span>
                      </div>
                      <div>
                        <span className="text-amber-200 block text-[10px]">Hướng Cát Lợi:</span>
                        <span className="font-medium">{result.huongTot?.[0] || 'Đông Nam'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Tổng Quan Vận Thế */}
                <div className="bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-md rounded-2xl border border-ivory-300/80 dark:border-charcoal-800 p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="font-heading text-lg sm:text-xl font-bold text-charcoal-900 dark:text-charcoal-100">
                      Tổng Quan Vận Thế Năm {viewYear} ({result.namXemCanChi})
                    </h4>
                  </div>
                  <p className="text-sm sm:text-base text-charcoal-700 dark:text-charcoal-300 leading-relaxed font-sans whitespace-pre-line">
                    {result.tongQuan}
                  </p>
                </div>

                {/* 3. Bốn Trụ Cột Đời Sống (Grid 2x2) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  {/* Công danh */}
                  <div className="bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-md rounded-2xl border border-ivory-300/80 dark:border-charcoal-800 p-6 shadow-xs flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <h4 className="font-heading text-base sm:text-lg font-bold text-charcoal-900 dark:text-charcoal-100">
                        Công Danh & Sự Nghiệp
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed font-sans flex-1 whitespace-pre-line">
                      {result.congDanh}
                    </p>
                  </div>

                  {/* Tài lộc */}
                  <div className="bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-md rounded-2xl border border-ivory-300/80 dark:border-charcoal-800 p-6 shadow-xs flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                        <Coins className="w-4 h-4" />
                      </div>
                      <h4 className="font-heading text-base sm:text-lg font-bold text-charcoal-900 dark:text-charcoal-100">
                        Tài Lộc & Tiền Tài
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed font-sans flex-1 whitespace-pre-line">
                      {result.taiLoc}
                    </p>
                  </div>

                  {/* Tình duyên & Gia đạo */}
                  <div className="bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-md rounded-2xl border border-ivory-300/80 dark:border-charcoal-800 p-6 shadow-xs flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
                        <Heart className="w-4 h-4" />
                      </div>
                      <h4 className="font-heading text-base sm:text-lg font-bold text-charcoal-900 dark:text-charcoal-100">
                        Tình Duyên & Gia Đạo
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed font-sans flex-1 whitespace-pre-line">
                      {result.tinhDuyen}
                    </p>
                  </div>

                  {/* Sức khỏe */}
                  <div className="bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-md rounded-2xl border border-ivory-300/80 dark:border-charcoal-800 p-6 shadow-xs flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4" />
                      </div>
                      <h4 className="font-heading text-base sm:text-lg font-bold text-charcoal-900 dark:text-charcoal-100">
                        Sức Khỏe & Thân Tâm
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed font-sans flex-1 whitespace-pre-line">
                      {result.sucKhoe}
                    </p>
                  </div>
                </div>

                {/* 4. ĐẶC BIỆT: GÓC NHÌN PHẬT GIÁO & HÓA GIẢI NGHIỆP LỰC */}
                {result.loiKhuyenPhatPhap && (
                  <div className="bg-gradient-to-br from-saffron-50/90 via-amber-50/70 to-ivory-100/90 dark:from-charcoal-900 dark:via-charcoal-900 dark:to-charcoal-950 rounded-3xl border-2 border-saffron-300/80 dark:border-saffron-800/80 p-6 sm:p-8 md:p-10 shadow-lg relative overflow-hidden">
                    <div className="flex items-center gap-3.5 mb-6">
                      <div className="w-11 h-11 rounded-2xl bg-saffron-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                        <BuddhaBodhiIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-wider text-saffron-700 dark:text-saffron-400 font-bold block">
                          Pháp Bảo Soi Sáng
                        </span>
                        <h4 className="font-heading text-lg sm:text-2xl font-bold text-charcoal-900 dark:text-charcoal-50">
                          Hóa Giải Nghiệp Lực & Phương Pháp Tu Phước Cát Tường
                        </h4>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Quán chiếu nghiệp duyên */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-charcoal-800/80 border border-saffron-200/80 dark:border-charcoal-700">
                        <h5 className="text-xs sm:text-sm font-bold text-saffron-900 dark:text-saffron-300 mb-1 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-saffron-600" />
                          Quán Chiếu Nghiệp Duyên Theo Luật Nhân Quả:
                        </h5>
                        <p className="text-xs sm:text-sm text-charcoal-700 dark:text-charcoal-300 leading-relaxed font-sans">
                          {result.loiKhuyenPhatPhap.nghiepDuyen}
                        </p>
                      </div>

                      {/* Phương pháp hóa giải */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-charcoal-800/80 border border-saffron-200/80 dark:border-charcoal-700">
                        <h5 className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-amber-600" />
                          Thực Hành Đức Năng Thắng Số:
                        </h5>
                        <p className="text-xs sm:text-sm text-charcoal-700 dark:text-charcoal-300 leading-relaxed font-sans">
                          {result.loiKhuyenPhatPhap.phuongPhapHoaGiai}
                        </p>
                      </div>

                      {/* Kinh chú và thiện hạnh */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-white/80 dark:bg-charcoal-800/80 border border-saffron-200/80 dark:border-charcoal-700">
                          <h6 className="text-xs font-bold text-charcoal-900 dark:text-charcoal-100 mb-1 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-saffron-600" />
                            Kinh Chú Tương Thích:
                          </h6>
                          <p className="text-xs text-charcoal-600 dark:text-charcoal-300 leading-relaxed font-sans">
                            {result.loiKhuyenPhatPhap.kinhChuPhuHop}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-white/80 dark:bg-charcoal-800/80 border border-saffron-200/80 dark:border-charcoal-700">
                          <h6 className="text-xs font-bold text-charcoal-900 dark:text-charcoal-100 mb-1 flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5 text-rose-600" />
                            Hành Thiện & Bố Thí:
                          </h6>
                          <p className="text-xs text-charcoal-600 dark:text-charcoal-300 leading-relaxed font-sans">
                            {result.loiKhuyenPhatPhap.hanhThienBoThi}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-medium text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Lập Lá Số Khác</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className="px-6 py-3 rounded-xl bg-ivory-200 dark:bg-charcoal-800 hover:bg-ivory-300 dark:hover:bg-charcoal-700 text-charcoal-800 dark:text-charcoal-200 font-medium text-xs sm:text-sm flex items-center gap-2 transition-all"
                  >
                    <History className="w-4 h-4" />
                    <span>Xem Danh Sách Lịch Sử ({historyList.length})</span>
                  </button>
                </div>
              </section>
            )}
          </div>
        )}

        {/* ===================== TAB 2: HISTORY ===================== */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-ivory-300 dark:border-charcoal-800">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-charcoal-900 dark:text-charcoal-50 flex items-center gap-2">
                  <History className="w-5 h-5 text-saffron-600" />
                  Lịch Sử Các Lá Số Đã Xem
                </h2>
                <p className="text-xs sm:text-sm text-charcoal-500 dark:text-charcoal-400 mt-0.5">
                  Lưu trữ các lần bạn đã tra cứu vận mệnh để chiêm nghiệm và theo dõi sự chuyển hóa
                </p>
              </div>

              {!user && (
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
                >
                  Đăng nhập để đồng bộ vĩnh viễn
                </button>
              )}
            </div>

            {isLoadingHistory ? (
              <div className="py-16 text-center text-charcoal-400">
                <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-3 text-saffron-500" />
                <p className="text-sm">Đang tải lịch sử xem lá số...</p>
              </div>
            ) : historyList.length === 0 ? (
              <div className="py-16 text-center bg-white/70 dark:bg-charcoal-900/70 rounded-2xl border border-ivory-300 dark:border-charcoal-800 p-8">
                <div className="w-16 h-16 rounded-2xl bg-saffron-100 dark:bg-saffron-950/80 flex items-center justify-center mx-auto mb-4 overflow-hidden border border-saffron-200 dark:border-saffron-800 shadow-xs">
                  <video
                    src="/tuvi.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-110 pointer-events-none"
                  />
                </div>
                <h3 className="font-heading text-base sm:text-lg font-bold text-charcoal-800 dark:text-charcoal-200">
                  Chưa có lịch sử xem tử vi nào
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-500 dark:text-charcoal-400 max-w-md mx-auto mt-1 mb-6">
                  Bạn có thể lập lá số tử vi cho bản thân hoặc người thân, kết quả sẽ được tự động lưu lại tại đây.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('form')}
                  className="px-6 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-all shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Lập Lá Số Ngay</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {historyList.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-white/95 dark:bg-charcoal-900/95 border border-ivory-300/80 dark:border-charcoal-800 hover:border-saffron-400/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-heading text-base sm:text-lg font-bold text-charcoal-900 dark:text-charcoal-50 group-hover:text-saffron-700 dark:group-hover:text-saffron-400 transition-colors">
                              {item.full_name}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-ivory-200 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300">
                              {item.gender}
                            </span>
                          </div>
                          <span className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-0.5 block">
                            Sinh ngày: {item.birth_date} • {item.birth_hour}
                          </span>
                        </div>

                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-saffron-100 dark:bg-saffron-950/80 text-saffron-800 dark:text-saffron-300 border border-saffron-200/80 dark:border-saffron-800 flex-shrink-0">
                          {item.view_year}
                        </span>
                      </div>

                      {/* Thông số Can chi & Bản mệnh */}
                      <div className="p-2.5 rounded-xl bg-ivory-100/60 dark:bg-charcoal-800/60 border border-ivory-200 dark:border-charcoal-700/80 text-xs text-charcoal-700 dark:text-charcoal-300 space-y-1 mb-4">
                        <div className="flex justify-between">
                          <span className="text-charcoal-500 dark:text-charcoal-400">Can Chi:</span>
                          <span className="font-semibold">{item.can_chi}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-charcoal-500 dark:text-charcoal-400">Bản Mệnh:</span>
                          <span className="font-semibold truncate max-w-[200px]">{item.menh}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-charcoal-500 dark:text-charcoal-400">Thời gian xem:</span>
                          <span className="text-charcoal-400">
                            {new Date(item.created_at).toLocaleDateString('vi-VN')} {new Date(item.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-ivory-200 dark:border-charcoal-800">
                      <button
                        type="button"
                        onClick={() => {
                          setResult(item.reading_result);
                          setFullName(item.full_name);
                          setGender(item.gender as any);
                          setBirthDate(item.birth_date);
                          setViewYear(item.view_year);
                          setActiveTab('form');
                          setTimeout(() => {
                            const el = document.getElementById('ket-qua-tu-vi');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }, 150);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-saffron-500/10 hover:bg-saffron-500/20 text-saffron-700 dark:text-saffron-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                      >
                        <span>Xem lại luận giải</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      {deleteConfirmId === item.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDeleteHistory(item)}
                            className="px-2.5 py-1.5 rounded-lg bg-red-600 text-white text-[11px] font-semibold"
                          >
                            Xác nhận xóa
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1.5 rounded-lg bg-ivory-200 dark:bg-charcoal-800 text-[11px]"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-2 rounded-xl text-charcoal-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all"
                          title="Xóa khỏi lịch sử"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
