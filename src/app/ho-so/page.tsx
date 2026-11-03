"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";
import {
  User,
  Sparkles,
  CheckCircle2,
  Calendar,
  Palette,
  Heart,
  LogOut,
  Save,
  ShieldCheck,
} from "lucide-react";

export default function ProfilePage() {
  const { user, setDharmaProfile, logout } = useAuth();

  const [dharmaName, setDharmaName] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [vowText, setVowText] = useState("");
  const [chantCount, setChantCount] = useState(0);
  const [reminderCount, setReminderCount] = useState(0);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (user) {
      setDharmaName(user.dharma_name || user.full_name || "");
      setGender(user.gender === "female" || user.gender === "Nữ" ? "female" : "male");
    }
    if (typeof window !== "undefined") {
      const savedVow = localStorage.getItem("phatphap_user_vow");
      if (savedVow) setVowText(savedVow);
      const savedChants = localStorage.getItem("phatphap_personal_chant_count");
      if (savedChants) setChantCount(Number(savedChants) || 0);
      try {
        const savedRem = localStorage.getItem("phatphap_personal_reminders_v1");
        if (savedRem) {
          const parsed = JSON.parse(savedRem);
          if (Array.isArray(parsed)) setReminderCount(parsed.length);
        }
      } catch {
        // ignore
      }
    }
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dharmaName.trim()) return;
    setDharmaProfile(dharmaName.trim(), gender);
    if (typeof window !== "undefined") {
      localStorage.setItem("phatphap_user_vow", vowText.trim());
    }
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto px-3.5 sm:px-6 pt-4 pb-16 space-y-4 sm:space-y-5">
      {/* Top Hero Banner — Strictly single-line title & badge on mobile */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3d1f0d] via-[#5c1616] to-[#2e1508] text-white p-4 sm:p-6 border border-[#d4af37]/40 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#ffd966]/25 to-[#b5892e]/20 border-2 border-[#d4af37] flex items-center justify-center text-xl sm:text-2xl font-bold text-[#ffd966] shrink-0 shadow-inner">
              {user ? (user.dharma_name || user.full_name).charAt(0).toUpperCase() : "☸"}
            </div>
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#ffd966] text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                <Sparkles className="w-2.5 h-2.5 shrink-0" />
                <span>Hồ Sơ Phật Tử</span>
              </div>
              <h1 className="font-heading text-base sm:text-xl font-bold text-white mt-1 whitespace-nowrap truncate">
                {user ? user.dharma_name || user.full_name : "Pháp Danh & Giới Tính"}
              </h1>
              <p className="text-[11px] sm:text-xs text-[#e8d5b5] mt-0.5 whitespace-nowrap truncate">
                {user
                  ? user.gender === "female" || user.gender === "Nữ"
                    ? "Tín Nữ • Lưu trên thiết bị"
                    : "Thiện Nam • Lưu trên thiết bị"
                  : "Bảo mật riêng tư • Không cần mật khẩu"}
              </p>
            </div>
          </div>

          {user && (
            <button
              type="button"
              onClick={() => logout()}
              className="shrink-0 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 text-[11px] font-semibold text-amber-200 flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer"
              title="Xóa Pháp Danh"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Xóa Pháp Danh</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 Compact Summary Cards — 3 columns on mobile & desktop, zero text wrapping */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-[#e6dfd3] shadow-2xs flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between gap-1.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-700 flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700/80 whitespace-nowrap truncate">
              Công Phu
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-stone-500 whitespace-nowrap truncate">Niệm Phật</p>
            <p className="text-sm sm:text-base font-bold text-stone-800 whitespace-nowrap truncate mt-0.5">
              {chantCount.toLocaleString("vi-VN")} câu
            </p>
          </div>
        </div>

        <Link
          href="/lich-phat-giao"
          className="bg-white rounded-2xl p-3 sm:p-4 border border-[#e6dfd3] hover:border-amber-400 shadow-2xs flex flex-col justify-between min-w-0 transition-all active:scale-98"
        >
          <div className="flex items-center justify-between gap-1.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200/70 text-[#800000] flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#800000]/80 whitespace-nowrap truncate">
              Lịch Nhắc
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-stone-500 whitespace-nowrap truncate">Ngày Giỗ / Lễ</p>
            <p className="text-sm sm:text-base font-bold text-stone-800 whitespace-nowrap truncate mt-0.5">
              {reminderCount} sự kiện
            </p>
          </div>
        </Link>

        <Link
          href="/tu-vi"
          className="bg-white rounded-2xl p-3 sm:p-4 border border-[#e6dfd3] hover:border-emerald-400 shadow-2xs flex flex-col justify-between min-w-0 transition-all active:scale-98"
        >
          <div className="flex items-center justify-between gap-1.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/70 text-emerald-700 flex items-center justify-center shrink-0">
              <Palette className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700/80 whitespace-nowrap truncate">
              Bản Mệnh
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-stone-500 whitespace-nowrap truncate">Màu & Ngày Tốt</p>
            <p className="text-xs sm:text-sm font-bold text-emerald-700 whitespace-nowrap truncate mt-0.5">
              Xem ngay →
            </p>
          </div>
        </Link>
      </div>

      {/* Form Update Dharma Name & Gender */}
      <form
        onSubmit={handleSave}
        className="bg-white rounded-3xl border border-[#e6dfd3] p-4 sm:p-6 shadow-xs space-y-5"
      >
        <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-[#b5892e] shrink-0">
              <User className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-heading text-sm sm:text-base font-bold text-stone-800 whitespace-nowrap truncate">
                Cập Nhật Hồ Sơ Phật Tử
              </h2>
              <p className="text-[11px] text-stone-400 whitespace-nowrap truncate">
                Hiển thị trên Niệm Phật Đường & Lịch Nhắc
              </p>
            </div>
          </div>

          {savedNotice && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Đã lưu!</span>
            </span>
          )}
        </div>

        {/* Dharma Name Input */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider whitespace-nowrap">
            Pháp Danh hoặc Họ Tên *
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={dharmaName}
              onChange={(e) => setDharmaName(e.target.value)}
              placeholder="Ví dụ: Thiện Tâm, Minh Đức, Diệu Âm..."
              className="w-full px-4 py-3 rounded-2xl bg-[#fdfbf7] border border-stone-200/90 text-sm font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#b5892e] focus:ring-2 focus:ring-[#b5892e]/15 transition-all"
            />
          </div>
        </div>

        {/* Refined Gender Selector Cards */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider whitespace-nowrap">
            Chọn Danh Xưng Giới Tính *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Male Card */}
            <button
              type="button"
              onClick={() => setGender("male")}
              className={`relative p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 min-w-0 active:scale-98 ${
                gender === "male"
                  ? "bg-gradient-to-br from-amber-50/90 via-[#fff9eb] to-amber-100/50 border-[#b5892e] shadow-sm"
                  : "bg-[#fdfbf7] border-stone-200/80 hover:border-stone-300 text-stone-600"
              }`}
            >
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-lg sm:text-xl shrink-0 transition-all ${
                  gender === "male"
                    ? "bg-gradient-to-br from-[#d4af37] to-[#9a721c] text-white shadow-xs"
                    : "bg-stone-100 text-stone-500"
                }`}
              >
                🙏
              </div>
              <div className="min-w-0 flex-1">
                <div
                  className={`text-xs sm:text-sm font-bold whitespace-nowrap truncate ${
                    gender === "male" ? "text-[#4a2508]" : "text-stone-700"
                  }`}
                >
                  Thiện Nam
                </div>
                <div className="text-[10px] sm:text-[11px] text-stone-500 whitespace-nowrap truncate mt-0.5">
                  Phật tử Nam
                </div>
              </div>
              {gender === "male" && (
                <CheckCircle2 className="w-4 h-4 text-[#b5892e] shrink-0" />
              )}
            </button>

            {/* Female Card */}
            <button
              type="button"
              onClick={() => setGender("female")}
              className={`relative p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 min-w-0 active:scale-98 ${
                gender === "female"
                  ? "bg-gradient-to-br from-amber-50/90 via-[#fff9eb] to-amber-100/50 border-[#b5892e] shadow-sm"
                  : "bg-[#fdfbf7] border-stone-200/80 hover:border-stone-300 text-stone-600"
              }`}
            >
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-lg sm:text-xl shrink-0 transition-all ${
                  gender === "female"
                    ? "bg-gradient-to-br from-[#d4af37] to-[#9a721c] text-white shadow-xs"
                    : "bg-stone-100 text-stone-500"
                }`}
              >
                🪷
              </div>
              <div className="min-w-0 flex-1">
                <div
                  className={`text-xs sm:text-sm font-bold whitespace-nowrap truncate ${
                    gender === "female" ? "text-[#4a2508]" : "text-stone-700"
                  }`}
                >
                  Tín Nữ
                </div>
                <div className="text-[10px] sm:text-[11px] text-stone-500 whitespace-nowrap truncate mt-0.5">
                  Phật tử Nữ
                </div>
              </div>
              {gender === "female" && (
                <CheckCircle2 className="w-4 h-4 text-[#b5892e] shrink-0" />
              )}
            </button>
          </div>
        </div>

        {/* Personal Vow */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider whitespace-nowrap truncate">
            Lời Phát Nguyện Tu Tập (Tùy chọn)
          </label>
          <textarea
            rows={3}
            value={vowText}
            onChange={(e) => setVowText(e.target.value)}
            placeholder="Ví dụ: Nguyện sống chánh niệm, hiếu kính cha mẹ, ăn chay ngày Rằm và Mùng 1..."
            className="w-full px-4 py-3 rounded-2xl bg-[#fdfbf7] border border-stone-200/90 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#b5892e] focus:ring-2 focus:ring-[#b5892e]/15 transition-all"
          />
        </div>

        {/* Luxury Full-width Submit Button */}
        <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-stone-400 whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Lưu tự động trên trình duyệt của bạn</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto min-w-[200px] px-6 py-3 rounded-2xl bg-gradient-to-r from-[#b5892e] via-[#c99a36] to-[#9a721c] hover:from-[#9a721c] hover:to-[#7c5a12] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Save className="w-4 h-4 shrink-0" />
            <span>Lưu Hồ Sơ Pháp Danh</span>
          </button>
        </div>
      </form>
    </div>
  );
}
