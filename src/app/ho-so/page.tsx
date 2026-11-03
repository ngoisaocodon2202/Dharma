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
  Scroll,
  Heart,
  LogOut,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  const { user, openAuthModal, setDharmaProfile, logout } = useAuth();

  const [dharmaName, setDharmaName] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [vowText, setVowText] = useState("");
  const [chantCount, setChantCount] = useState(0);
  const [reminderCount, setReminderCount] = useState(0);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (user) {
      setDharmaName(user.dharma_name || user.full_name || "");
      setGender(user.gender || "male");
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-16 space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#3d1f0d] via-[#5c1616] to-[#3d1f0d] text-white p-6 sm:p-8 border border-[#d4af37]/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#d4af37]/20 border-2 border-[#d4af37] flex items-center justify-center text-2xl font-bold text-[#ffd966] shrink-0">
            {user ? (user.dharma_name || user.full_name).charAt(0).toUpperCase() : "☸"}
          </div>
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 text-[#ffd966] text-[11px] font-semibold uppercase tracking-wider">
              Hồ Sơ Phật Tử Tại Gia
            </span>
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-white mt-1">
              {user
                ? `Pháp danh: ${user.dharma_name || user.full_name}`
                : "Nhập Pháp Danh & Giới Tính"}
            </h1>
            <p className="text-xs text-[#e8d5b5] mt-0.5">
              {user
                ? `Giới tính: ${
                    user.gender === "female" ? "Tín Nữ (Nữ)" : "Thiện Nam (Nam)"
                  }`
                : "Không cần tài khoản Google hay mật khẩu — lưu trực tiếp trên thiết bị"}
            </p>
          </div>
        </div>

        {user && (
          <button
            onClick={() => logout()}
            className="self-start sm:self-center px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-amber-200 flex items-center gap-1.5 whitespace-nowrap transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Xóa Pháp Danh</span>
          </button>
        )}
      </div>

      {/* Personal Practice Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#e6dfd3] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-stone-500">Tâm niệm Phật đã ghi nhận</p>
            <p className="text-lg font-bold text-stone-800">
              {chantCount.toLocaleString("vi-VN")} câu niệm
            </p>
          </div>
        </div>

        <Link
          href="/lich-phat-giao"
          className="bg-white rounded-2xl p-4 border border-[#e6dfd3] hover:border-amber-400 shadow-xs flex items-center gap-3.5 transition-all"
        >
          <div className="w-11 h-11 rounded-xl bg-red-50 text-[#800000] flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-stone-500">Lịch nhắc Ngày Giỗ / Quan Trọng</p>
            <p className="text-lg font-bold text-stone-800">
              {reminderCount} sự kiện đã lưu
            </p>
          </div>
        </Link>

        <Link
          href="/tu-vi"
          className="bg-white rounded-2xl p-4 border border-[#e6dfd3] hover:border-emerald-400 shadow-xs flex items-center gap-3.5 transition-all"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-stone-500">Màu Chủ Đạo & Ngày Tốt</p>
            <p className="text-sm font-bold text-emerald-700">Xem bản mệnh →</p>
          </div>
        </Link>
      </div>

      {/* Form Update Dharma Name & Gender */}
      <form
        onSubmit={handleSave}
        className="bg-white rounded-2xl border border-[#e6dfd3] p-5 sm:p-6 shadow-xs space-y-5"
      >
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h2 className="font-heading text-lg font-bold text-stone-800 flex items-center gap-2">
            <User className="w-5 h-5 text-[#b5892e]" />
            <span>Thông Tin Pháp Danh & Giới Tính</span>
          </h2>
          {savedNotice && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Đã lưu Pháp Danh!
            </span>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            Pháp Danh hoặc Tên Gọi *
          </label>
          <input
            type="text"
            required
            value={dharmaName}
            onChange={(e) => setDharmaName(e.target.value)}
            placeholder="Ví dụ: Thiện Tâm, Minh Đức, Diệu Âm..."
            className="w-full px-4 py-2.5 rounded-xl bg-[#fdfbf7] border border-stone-300 text-sm text-stone-800 focus:outline-none focus:border-[#b5892e]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            Giới Tính *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setGender("male")}
              className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                gender === "male"
                  ? "bg-amber-50 border-amber-500 text-amber-900 shadow-xs"
                  : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
              }`}
            >
              <span>🙏</span>
              <span>Nam (Thiện Nam)</span>
            </button>
            <button
              type="button"
              onClick={() => setGender("female")}
              className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                gender === "female"
                  ? "bg-amber-50 border-amber-500 text-amber-900 shadow-xs"
                  : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
              }`}
            >
              <span>🪷</span>
              <span>Nữ (Tín Nữ)</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            Lời Phát Nguyện Tu Tập Cá Nhân (Tùy chọn)
          </label>
          <textarea
            rows={3}
            value={vowText}
            onChange={(e) => setVowText(e.target.value)}
            placeholder="Ví dụ: Nguyện sống chánh niệm, hiếu kính cha mẹ, ăn chay ngày Rằm và Mùng 1..."
            className="w-full px-4 py-2.5 rounded-xl bg-[#fdfbf7] border border-stone-300 text-sm text-stone-800 focus:outline-none focus:border-[#b5892e]"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="primary" size="md" className="gap-2">
            <Save className="w-4 h-4" />
            <span>Lưu Pháp Danh</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
