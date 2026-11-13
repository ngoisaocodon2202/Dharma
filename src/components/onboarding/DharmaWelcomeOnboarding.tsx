'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CalendarHeart,
  Check,
  Flower2,
  Headphones,
  Landmark,
  ShieldCheck,
  Sparkles,
  Upload,
} from 'lucide-react';
import { CenterToast } from '@/components/ui/CenterToast';
import { useTempleStore } from '@/components/sanctuary/useTempleStore';
import { useDharmaStore } from '@/store/useDharmaStore';
import {
  DEFAULT_DHARMA_AVATAR,
  DEFAULT_DHARMA_NAME,
  DHARMA_PRESET_AVATARS,
  ONBOARDING_DHARMA_SUGGESTIONS,
  readDeviceAuthCookie,
  resizeAvatarToDataUrl,
  writeDeviceAuthCookie,
  type DeviceAuthState,
} from '@/lib/deviceAuthCookie';

const DHARMA_PILLARS = [
  {
    icon: Headphones,
    title: 'Nghe Kinh & Pháp Âm',
    desc: 'Hơn 150 bài kinh tụng chọn lọc cùng chuông mõ thiền định và tần số an tịnh.',
  },
  {
    icon: Landmark,
    title: 'Chùa 3D & Cầu Nguyện',
    desc: 'Chiêm bái Đạo Tràng 3D, thắp hương Cầu An, Cầu Siêu và thả hoa đăng thanh tịnh.',
  },
  {
    icon: Flower2,
    title: '18 Bổn Tôn & Tràng Hạt',
    desc: 'Tìm hiểu công hạnh chư Phật, Bồ Tát, trì tụng Thần Chú và niệm châu 108 hạt.',
  },
  {
    icon: CalendarHeart,
    title: 'Âm Lịch & Sổ Công Đức',
    desc: 'Theo dõi ngày Sóc Vọng, ngày vía Bồ Tát, lịch thiền định và nhật ký hành trì.',
  },
];

export default function DharmaWelcomeOnboarding() {
  const updateProfile = useDharmaStore((s) => s.updateProfile);
  const setTempleProfile = useTempleStore((s) => s.setProfile);

  const [hasCheckedCookie, setHasCheckedCookie] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<0 | 1 | 2>(0);

  const [dharmaNameInput, setDharmaNameInput] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(DEFAULT_DHARMA_AVATAR);
  const [isProcessingAvatar, setIsProcessingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 3200);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const syncStoresWithAuthState = (auth: DeviceAuthState) => {
    const cleanName = auth.dharmaName.trim() || DEFAULT_DHARMA_NAME;
    const cleanAvatar = auth.avatarUrl || DEFAULT_DHARMA_AVATAR;

    updateProfile({
      dharmaName: cleanName,
      fullName: cleanName,
      avatarUrl: cleanAvatar,
    });
    setTempleProfile({ name: cleanName });
  };

  useEffect(() => {
    const savedCookie = readDeviceAuthCookie();
    if (savedCookie && savedCookie.onboarded) {
      syncStoresWithAuthState(savedCookie);
      setIsOpen(false);
    } else {
      setStep(0);
      setDharmaNameInput('');
      setSelectedAvatar(DEFAULT_DHARMA_AVATAR);
      setIsOpen(true);
    }
    setHasCheckedCookie(true);

    const handleDeviceAuthChanged = (evt: Event) => {
      const detail = (evt as CustomEvent<DeviceAuthState>).detail;
      if (detail) {
        syncStoresWithAuthState(detail);
      }
    };
    const unsubscribeHydrate = useDharmaStore.persist?.onFinishHydration?.(() => {
      const latestCookie = readDeviceAuthCookie();
      if (latestCookie && latestCookie.onboarded) {
        syncStoresWithAuthState(latestCookie);
      }
    });
    window.addEventListener('dharma-device-auth-changed', handleDeviceAuthChanged);
    return () => {
      window.removeEventListener('dharma-device-auth-changed', handleDeviceAuthChanged);
      unsubscribeHydrate?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSkipAll = () => {
    const saved = writeDeviceAuthCookie({
      dharmaName: DEFAULT_DHARMA_NAME,
      avatarUrl: DEFAULT_DHARMA_AVATAR,
      onboarded: true,
      skipped: true,
    });
    syncStoresWithAuthState(saved);
    setIsOpen(false);
    showToast(`Đã thiết lập Pháp danh mặc định: ${DEFAULT_DHARMA_NAME}`);
  };

  const handleCompleteOnboarding = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalName = dharmaNameInput.trim() || DEFAULT_DHARMA_NAME;
    const saved = writeDeviceAuthCookie({
      dharmaName: finalName,
      avatarUrl: selectedAvatar || DEFAULT_DHARMA_AVATAR,
      onboarded: true,
      skipped: false,
    });
    syncStoresWithAuthState(saved);
    setIsOpen(false);
    showToast(`Chào mừng ${saved.dharmaName} đến với DHARMA`);
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError(null);

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Vui lòng chọn ảnh có dung lượng dưới 5MB.');
      return;
    }

    setIsProcessingAvatar(true);
    try {
      const dataUrl = await resizeAvatarToDataUrl(file);
      setSelectedAvatar(dataUrl);
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : 'Không thể tải ảnh lên.');
    } finally {
      setIsProcessingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const previewName = dharmaNameInput.trim() || DEFAULT_DHARMA_NAME;

  if (!hasCheckedCookie) {
    return null;
  }

  return (
    <>
      <CenterToast message={toastMessage} />

      {isOpen && (
        <div
          className="fixed inset-0 w-screen h-[100dvh] z-[999990] bg-gradient-to-b from-[#FFFDF8] via-[#FAF7F0] to-[#F7F1E2] text-[#2C1E10] flex flex-col overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dharma-onboarding-title"
        >
          {/* Soft golden lotus top halo */}
          <div
            className="pointer-events-none fixed -top-28 left-1/2 -translate-x-1/2 w-[520px] h-[260px] rounded-full opacity-45 blur-3xl"
            style={{ background: 'radial-gradient(circle, #F5D57A 0%, rgba(245,213,122,0) 70%)' }}
          />

          {/* Full-screen Sticky Top Header */}
          <header className="relative z-10 px-4 sm:px-8 py-3.5 bg-[#FFFDF8]/90 backdrop-blur-md border-b border-[#EAD7A7] shrink-0">
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 min-w-0" aria-label={`Thẻ ${step + 1} trên 3`}>
                {[0, 1, 2].map((idx) => {
                  const isActive = step === idx;
                  const isDone = step > idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setStep(idx as 0 | 1 | 2)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer shrink-0 ${
                        isActive
                          ? 'w-7 bg-[#C68B19]'
                          : isDone
                            ? 'w-3.5 bg-[#DFB456]'
                            : 'w-2.5 bg-[#E6D7B3] hover:bg-[#D7C28D]'
                      }`}
                      aria-label={`Chuyển đến thẻ ${idx + 1}`}
                    />
                  );
                })}
                <span className="ml-1.5 text-[11px] font-bold uppercase tracking-wider text-[#8C5500] whitespace-nowrap">
                  Thẻ {step + 1}/3
                </span>
              </div>

              <button
                type="button"
                onClick={handleSkipAll}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-[#7A5000] hover:text-[#3D2505] bg-[#FFF4D6]/90 hover:bg-[#FCE8B6] border border-[#E5C67E] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Bỏ qua
              </button>
            </div>
          </header>

          {/* CARD 1: CHÀO MỪNG ĐẾN VỚI DHARMA */}
          {step === 0 && (
            <div className="relative z-10 flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-10 flex flex-col">
                <div className="my-auto w-full max-w-2xl mx-auto flex flex-col items-center text-center">
                  <div className="relative mb-5">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-br from-[#F7D77E] via-[#D89A2B] to-[#9E680A] shadow-[0_14px_36px_rgba(140,85,0,0.22)]">
                      <div className="w-full h-full rounded-full overflow-hidden bg-[#FFFDF8] border border-[#FFFDF8]">
                        <img
                          src="/images/dharma-logo.png"
                          alt="DHARMA Liên Hoa Đài"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#FFF9EB] border border-[#DFC27D] text-[10px] font-bold uppercase tracking-wider text-[#8C5500] whitespace-nowrap shadow-xs">
                      Nam Mô Bổn Sư
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF3D1] border border-[#E6C77C] text-[11px] font-bold uppercase tracking-wider text-[#8C5500] mt-2 mb-3 whitespace-nowrap">
                    <Sparkles className="w-3.5 h-3.5 text-[#C68B19] shrink-0" />
                    <span>Không Gian Chánh Niệm Trực Tuyến</span>
                  </div>

                  <h2
                    id="dharma-onboarding-title"
                    className="font-serif text-2xl sm:text-4xl font-bold text-[#2C1E10] leading-tight"
                  >
                    Chào mừng bạn đến với <span className="text-[#9E6400]">DHARMA</span>
                  </h2>

                  <p className="text-sm sm:text-base text-[#5C442B] leading-relaxed mt-3.5 max-w-xl">
                    Một góc an nhiên giữa nhịp sống thường nhật — nơi bạn lắng tâm trở về với hơi thở tỉnh thức, tụng niệm kinh văn, hành thiền mỗi ngày và vun bồi công đức lành.
                  </p>

                  <div className="grid grid-cols-3 gap-2.5 sm:gap-4 w-full max-w-xl mt-6">
                    <div className="rounded-2xl bg-[#FFFDF9] border border-[#E9D7AC] px-3 py-3.5 shadow-2xs">
                      <p className="text-xs sm:text-sm font-bold text-[#8C5500]">Tâm Tịnh</p>
                      <p className="text-[11px] sm:text-xs text-[#6B533B] mt-0.5">Thiền & Chánh niệm</p>
                    </div>
                    <div className="rounded-2xl bg-[#FFFDF9] border border-[#E9D7AC] px-3 py-3.5 shadow-2xs">
                      <p className="text-xs sm:text-sm font-bold text-[#8C5500]">Pháp Âm</p>
                      <p className="text-[11px] sm:text-xs text-[#6B533B] mt-0.5">Kinh kệ & Thần chú</p>
                    </div>
                    <div className="rounded-2xl bg-[#FFFDF9] border border-[#E9D7AC] px-3 py-3.5 shadow-2xs">
                      <p className="text-xs sm:text-sm font-bold text-[#8C5500]">Hồi Hướng</p>
                      <p className="text-[11px] sm:text-xs text-[#6B533B] mt-0.5">Cầu An & Cầu Siêu</p>
                    </div>
                  </div>
                </div>
              </div>

              <footer className="shrink-0 bg-[#FFFDF8]/95 backdrop-blur-md border-t border-[#EAD7A7] px-4 sm:px-8 py-3.5 sm:py-4">
                <div className="max-w-2xl mx-auto w-full flex items-center gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={handleSkipAll}
                    className="py-3 px-3.5 sm:px-5 rounded-2xl bg-[#FFF8E6] hover:bg-[#FCEEC9] border border-[#DFC27D] text-xs sm:text-sm font-bold text-[#7A5000] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Mặc định Dharma
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-[#C68B19] to-[#A66E08] hover:from-[#B57C11] hover:to-[#936005] text-white text-xs sm:text-sm font-bold shadow-[0_6px_18px_rgba(166,110,8,0.28)] inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span>Tiếp tục</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </footer>
            </div>
          )}

          {/* CARD 2: THÔNG TIN VỀ DHARMA */}
          {step === 1 && (
            <div className="relative z-10 flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-10 flex flex-col">
                <div className="my-auto w-full max-w-2xl mx-auto">
                  <div className="text-center mb-5 sm:mb-6">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF3D1] border border-[#E6C77C] text-[11px] font-bold uppercase tracking-wider text-[#8C5500] mb-3 whitespace-nowrap">
                      <BookOpenCheck className="w-3.5 h-3.5 text-[#C68B19] shrink-0" />
                      <span>Thông Tin Về DHARMA</span>
                    </div>
                    <h2
                      id="dharma-onboarding-title"
                      className="font-serif text-xl sm:text-3xl font-bold text-[#2C1E10]"
                    >
                      Hệ sinh thái tu tập trọn vẹn trong tầm tay
                    </h2>
                    <p className="text-xs sm:text-sm text-[#6B533B] mt-2 leading-relaxed max-w-xl mx-auto">
                      DHARMA tổng hợp các nghi thức truyền thống theo giao diện trang nghiêm, nhẹ nhàng và dễ thực hành mỗi ngày.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {DHARMA_PILLARS.map((item) => {
                      const IconComp = item.icon;
                      return (
                        <div
                          key={item.title}
                          className="flex items-start gap-3 p-4 rounded-2xl bg-[#FFFDF9] border border-[#E8D5A7] shadow-2xs"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFF1C7] to-[#FCE29E] border border-[#DFC27D] flex items-center justify-center shrink-0">
                            <IconComp className="w-5 h-5 text-[#8C5500]" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-[#2C1E10]">
                              {item.title}
                            </h3>
                            <p className="text-xs text-[#6B533B] leading-relaxed mt-1">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 p-3.5 sm:p-4 rounded-2xl bg-[#FFF7E2] border border-[#E8CF93] flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#8C5500] shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-[#5C442B] leading-relaxed">
                      Hồ sơ <strong>Pháp Danh</strong>, <strong>Ảnh đại diện</strong> và công phu của bạn được lưu bằng cookie đăng nhập ngay trên thiết bị này, mở lại ứng dụng bất cứ lúc nào cũng giữ nguyên.
                    </p>
                  </div>
                </div>
              </div>

              <footer className="shrink-0 bg-[#FFFDF8]/95 backdrop-blur-md border-t border-[#EAD7A7] px-4 sm:px-8 py-3.5 sm:py-4">
                <div className="max-w-2xl mx-auto w-full flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="py-3 px-3 sm:px-4 rounded-2xl bg-[#FFFDF8] hover:bg-[#FFF5DC] border border-[#DFC27D] text-xs sm:text-sm font-bold text-[#6B533B] inline-flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4 shrink-0" />
                    <span>Quay lại</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSkipAll}
                    className="py-3 px-3 sm:px-4 rounded-2xl bg-[#FFF8E6] hover:bg-[#FCEEC9] border border-[#DFC27D] text-xs sm:text-sm font-bold text-[#7A5000] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Bỏ qua
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 px-3 sm:px-5 rounded-2xl bg-gradient-to-r from-[#C68B19] to-[#A66E08] hover:from-[#B57C11] hover:to-[#936005] text-white text-xs sm:text-sm font-bold shadow-[0_6px_18px_rgba(166,110,8,0.28)] inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span>Chọn Pháp Danh</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </footer>
            </div>
          )}

          {/* CARD 3: CHỌN PHÁP DANH & ẢNH ĐẠI DIỆN */}
          {step === 2 && (
            <form
              onSubmit={handleCompleteOnboarding}
              className="relative z-10 flex-1 flex flex-col min-h-0 overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 sm:py-8 flex flex-col">
                <div className="my-auto w-full max-w-2xl mx-auto">
                  <div className="text-center mb-5">
                    <h2
                      id="dharma-onboarding-title"
                      className="font-serif text-xl sm:text-3xl font-bold text-[#2C1E10]"
                    >
                      Chọn Pháp Danh & Ảnh Đại Diện
                    </h2>
                    <p className="text-xs sm:text-sm text-[#6B533B] mt-1.5">
                      Lưu cookie đăng nhập trên thiết bị này. Nếu để trống hoặc bỏ qua, tên mặc định sẽ là{' '}
                      <strong className="text-[#8C5500]">Dharma</strong>.
                    </p>
                  </div>

                  {/* Live Profile Preview */}
                  <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#E5C67E] shadow-xs mb-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[#C68B19] bg-[#FFF4D6] shrink-0 shadow-xs">
                      <img
                        src={selectedAvatar || DEFAULT_DHARMA_AVATAR}
                        alt={previewName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C5500]">
                        Hiển thị trên toàn ứng dụng
                      </p>
                      <p className="text-base sm:text-lg font-bold text-[#2C1E10] truncate">
                        An lạc, <span className="text-[#9E6400]">{previewName}</span>
                      </p>
                      <p className="text-[11px] sm:text-xs text-[#7A6146] truncate">
                        Cookie thiết bị sẽ ghi nhớ tên & ảnh này
                      </p>
                    </div>
                  </div>

                  {/* Dharma Name Input (locked at text-base sm:text-sm to avoid mobile zoom) */}
                  <div className="dharma-input-panel-lock space-y-2.5 mb-5">
                    <label
                      htmlFor="dharma-onboarding-name-input"
                      className="block text-xs sm:text-sm font-bold text-[#4A3219]"
                    >
                      Pháp Danh hoặc Tên gọi của bạn
                    </label>
                    <input
                      id="dharma-onboarding-name-input"
                      type="text"
                      value={dharmaNameInput}
                      onChange={(e) => setDharmaNameInput(e.target.value)}
                      maxLength={32}
                      autoComplete="off"
                      placeholder="Nhập Pháp Danh... (mặc định: Dharma)"
                      className="w-full px-4 py-3 rounded-2xl bg-[#FFFDF9] border border-[#DFC27D] focus:border-[#B67E16] focus:outline-none focus:ring-2 focus:ring-[#C68B19]/25 text-base sm:text-sm font-semibold text-[#2C1E10] placeholder:text-[#A38A6B]"
                    />

                    {/* Suggested Dharma Names */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {ONBOARDING_DHARMA_SUGGESTIONS.map((name) => {
                        const isPicked = dharmaNameInput.trim().toLowerCase() === name.toLowerCase();
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => setDharmaNameInput(name)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                              isPicked
                                ? 'bg-[#C68B19] text-white border-[#A66E08]'
                                : 'bg-[#FFF8E6] hover:bg-[#FCEEC9] text-[#7A5000] border-[#E5C67E]'
                            }`}
                          >
                            {name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Avatar Selector + Device Upload */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm font-bold text-[#4A3219]">
                        Chọn Ảnh Đại Diện
                      </span>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isProcessingAvatar}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF5DA] hover:bg-[#FCE7B2] border border-[#D9A73D] text-xs font-bold text-[#7A5000] transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5 shrink-0" />
                        <span>{isProcessingAvatar ? 'Đang xử lý...' : 'Tải ảnh từ máy'}</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleUploadAvatar}
                        className="hidden"
                      />
                    </div>

                    {avatarError && (
                      <p className="text-xs font-medium text-[#B91C1C] bg-[#FEE2E2] px-3 py-1.5 rounded-xl border border-[#FCA5A5]">
                        {avatarError}
                      </p>
                    )}

                    <div className="grid grid-cols-5 gap-2.5 sm:gap-3">
                      {DHARMA_PRESET_AVATARS.map((preset) => {
                        const isSelected = selectedAvatar === preset.src;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => {
                              setAvatarError(null);
                              setSelectedAvatar(preset.src);
                            }}
                            title={preset.label}
                            className={`group relative rounded-2xl p-1 border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#FFF4D1] border-[#C68B19] ring-2 ring-[#C68B19]/35 scale-[1.03]'
                                : 'bg-[#FFFDF8] border-[#E8D5A7] hover:border-[#C68B19]/70'
                            }`}
                          >
                            <div className="aspect-square w-full rounded-xl overflow-hidden bg-[#FAF3E0]">
                              <img
                                src={preset.src}
                                alt={preset.label}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {isSelected && (
                              <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-[#C68B19] text-white flex items-center justify-center shadow-xs">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3 Action Row */}
              <footer className="shrink-0 bg-[#FFFDF8]/95 backdrop-blur-md border-t border-[#EAD7A7] px-4 sm:px-8 py-3.5 sm:py-4">
                <div className="max-w-2xl mx-auto w-full flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-3 px-3 sm:px-4 rounded-2xl bg-[#FFFDF8] hover:bg-[#FFF5DC] border border-[#DFC27D] text-xs sm:text-sm font-bold text-[#6B533B] inline-flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4 shrink-0" />
                    <span>Quay lại</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSkipAll}
                    className="py-3 px-3 sm:px-4 rounded-2xl bg-[#FFF8E6] hover:bg-[#FCEEC9] border border-[#DFC27D] text-xs sm:text-sm font-bold text-[#7A5000] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Bỏ qua
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-3 sm:px-5 rounded-2xl bg-gradient-to-r from-[#C68B19] to-[#A66E08] hover:from-[#B57C11] hover:to-[#936005] text-white text-xs sm:text-sm font-bold shadow-[0_6px_18px_rgba(166,110,8,0.28)] inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Lưu &amp; Vào DHARMA</span>
                  </button>
                </div>
              </footer>
            </form>
          )}
        </div>
      )}
    </>
  );
}
