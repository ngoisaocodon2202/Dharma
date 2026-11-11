'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Edit3,
  Camera,
  ChevronRight,
  Settings,
  Share2,
  X,
  Check,
  Globe,
  ShieldCheck,
  LogOut,
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
import { useAuth } from '@/components/auth/AuthContext';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import {
  playBellSound,
  playWoodenFishSound,
  playGrandTempleBellSound,
} from '@/lib/buddhistSounds';
import {
  recordDharmaMerit,
  getDharmaMeritLedger,
  DharmaMeritEntry,
} from '@/components/om-mani/OmManiInteractiveTools';
import {
  OmManiDesktopProfile,
  PreceptItem,
} from '@/components/om-mani/desktop/OmManiDesktopProfile';
import { cn } from '@/lib/utils';

const PRECEPTS_STORAGE_KEY = 'phatphap_dharma_precepts_checked_v1';

const FIVE_PRECEPTS_LIST: PreceptItem[] = [
  {
    id: 'precept-1',
    number: 'Giới thứ 1',
    title: 'Bảo Hộ Sự Sống & Nuôi Dưỡng Từ Bi',
    pali: 'Pāṇātipātā veramaṇī',
    desc: 'Nguyện không sát hại sinh mạng, thực tập ăn chay thanh tịnh và tôn trọng sự sống của muôn loài.',
  },
  {
    id: 'precept-2',
    number: 'Giới thứ 2',
    title: 'Tôn Trọng Tài Sản & Sống Biết Đủ',
    pali: 'Adinnādānā veramaṇī',
    desc: 'Nguyện không lấy của không cho, sống chánh mạng trung thực và rộng lòng sẻ chia bố thí.',
  },
  {
    id: 'precept-3',
    number: 'Giới thứ 3',
    title: 'Giữ Gìn Phạm Hạnh & Chung Thủy Gia Đạo',
    pali: 'Kāmesumicchācārā veramaṇī',
    desc: 'Nguyện sống chung thủy, tôn trọng nhân phẩm và bảo vệ hạnh phúc bền vững của gia đình.',
  },
  {
    id: 'precept-4',
    number: 'Giới thứ 4',
    title: 'Chánh Ngữ Chân Thật & Lắng Nghe Ái Ngữ',
    pali: 'Musāvādā veramaṇī',
    desc: 'Nguyện nói lời chân thật, hòa ái, đem lại niềm tin và sự hòa hợp, không nói lời chia rẽ.',
  },
  {
    id: 'precept-5',
    number: 'Giới thứ 5',
    title: 'Tỉnh Thức Sáng Suốt & Không Say Nghiện',
    pali: 'Surāmeraya veramaṇī',
    desc: 'Nguyện giữ tâm trí trong sáng, tiêu thụ chánh niệm cả thực phẩm lẫn thông tin hằng ngày.',
  },
];

export default function AccountProfilePage() {
  const router = useRouter();
  const { user, setDharmaProfile, logout } = useAuth();

  // Profile fields state
  const [dharmaName, setDharmaName] = useState(
    user?.dharma_name || user?.full_name || 'Phật Tử Tâm An'
  );
  const [realName, setRealName] = useState(user?.full_name || 'Nguyễn Minh Tâm');
  const [refugeDate, setRefugeDate] = useState('2024-01-15');
  const [refugeTemple, setRefugeTemple] = useState('Chùa Giác Ngộ');
  const [masterName, setMasterName] = useState('Chư Tôn Đức');
  const [userMotto, setUserMotto] = useState(
    'Tâm bình thế giới bình, mỗi bước chân là một đóa sen nở.'
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 5 Precepts checklist state
  const [checkedPrecepts, setCheckedPrecepts] = useState<string[]>([
    'precept-1',
    'precept-2',
    'precept-3',
    'precept-4',
    'precept-5',
  ]);

  // Merit Ledger state
  const [meritLedger, setMeritLedger] = useState<DharmaMeritEntry[]>([]);

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAboutDharmaOpen, setIsAboutDharmaOpen] = useState(false);
  const [isMemorialBookOpen, setIsMemorialBookOpen] = useState(false);
  const [isMeditationScheduleOpen, setIsMeditationScheduleOpen] = useState(false);
  const [isSupportDharmaOpen, setIsSupportDharmaOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Memorials inside Profile
  const [memorials, setMemorials] = useState<
    { id: string; name: string; relation: string; lunarDate: string }[]
  >([
    { id: '1', name: 'Ông Nội Nguyễn Văn Phúc', relation: 'Tổ phụ', lunarDate: '15/07 Âm lịch' },
    { id: '2', name: 'Bà Ngoại Lê Thị Hiền', relation: 'Tổ mẫu', lunarDate: '10/10 Âm lịch' },
  ]);
  const [newMemName, setNewMemName] = useState('');
  const [newMemDate, setNewMemDate] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMotto = localStorage.getItem('phatphap_user_motto');
      const savedTemple = localStorage.getItem('phatphap_refuge_temple');
      const savedMaster = localStorage.getItem('phatphap_master_name');
      const savedPrecepts = localStorage.getItem(PRECEPTS_STORAGE_KEY);

      if (savedMotto) setUserMotto(savedMotto);
      if (savedTemple) setRefugeTemple(savedTemple);
      if (savedMaster) setMasterName(savedMaster);
      if (savedPrecepts) {
        try {
          setCheckedPrecepts(JSON.parse(savedPrecepts));
        } catch {}
      }
      if (user?.dharma_name) setDharmaName(user.dharma_name);

      setMeritLedger(getDharmaMeritLedger());
    }
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleTogglePrecept = (id: string) => {
    playWoodenFishSound(0.3);
    setCheckedPrecepts((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      try {
        localStorage.setItem(PRECEPTS_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleConfirmPreceptsToday = () => {
    playGrandTempleBellSound(0.55);
    const updated = recordDharmaMerit({
      type: 'precept',
      title: `Phát Nguyện Trì Giữ ${checkedPrecepts.length}/5 Ngũ Giới Tại Gia`,
      detail: 'Tự kiểm thân khẩu ý thanh tịnh, hộ trì gia đạo an hòa',
      meritPoints: 25,
    });
    setMeritLedger(updated);
    showToast(
      `Đã ghi nhận công đức trì giữ ${checkedPrecepts.length}/5 Ngũ Giới hôm nay (+25 Công Đức)!`
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dharmaName.trim()) return;

    setDharmaProfile(dharmaName.trim(), user?.gender === 'female' ? 'female' : 'male');
    if (typeof window !== 'undefined') {
      localStorage.setItem('phatphap_user_motto', userMotto.trim());
      localStorage.setItem('phatphap_refuge_date', refugeDate);
      localStorage.setItem('phatphap_refuge_temple', refugeTemple);
      localStorage.setItem('phatphap_master_name', masterName);
    }
    playWoodenFishSound(0.5);
    showToast('Đã cập nhật Thẻ Cư Sĩ Hoàng Kim Dharma!');
    setIsEditProfileOpen(false);
  };

  const totalMeritPoints =
    meritLedger.reduce((sum, item) => sum + (item.meritPoints || 10), 0) + 120;

  const bodhiStageTitle =
    totalMeritPoints >= 300
      ? 'Đại Thụ Bồ Đề Giác Ngộ'
      : totalMeritPoints >= 180
      ? 'Cây Bồ Đề Vững Chãi'
      : 'Chồi Non Tỉnh Thức';

  return (
    <div className="min-h-screen bg-white text-[#2E1E0F] selection:bg-[#F5C542]/30 selection:text-[#8C5500]">
      {/* ========================================================================= */}
      {/* MOBILE VIEW (< lg) - DHARMA REACT NATIVE SUPER-APP PROFILE                */}
      {/* ========================================================================= */}
      <div className="block lg:hidden">
        <div className="max-w-md sm:max-w-lg mx-auto px-4 sm:px-5 pt-2 pb-32 space-y-5">
          {/* 1. THẺ CƯ SĨ HOÀNG KIM (DIGITAL GOLDEN LAYPERSON ID CARD) */}
          <section aria-label="Thẻ Cư Sĩ Dharma" className="relative text-center pt-1">
            <div className="rounded-3xl bg-gradient-to-br from-[#FFFDF2] via-[#FFF9E6] to-[#FFF4D1] border border-[#ECD9A8] shadow-2xl overflow-hidden">
              {/* Header Banner Image */}
              <div
                className="w-full h-36 relative bg-cover bg-center"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, rgba(24, 18, 7, 0.25) 0%, rgba(36, 27, 11, 0.95) 100%), url('/images/golden_buddha_altar.jpg')",
                }}
              >
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white backdrop-blur-md border border-[#ECD9A8] text-[10px] font-bold uppercase tracking-widest text-[#8C5500]">
                  THẺ CƯ SĨ TAM BẢO • DHARMA
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(true)}
                    className="w-8 h-8 rounded-xl bg-white backdrop-blur-md border border-[#ECD9A8] text-[#8C5500] flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                    title="Chỉnh sửa Thẻ Cư Sĩ"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(true)}
                    className="w-8 h-8 rounded-xl bg-white backdrop-blur-md border border-[#ECD9A8] text-[#8C5500] flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                    title="Cài đặt"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Overlapping Dharma Wheel Seal Medallion */}
              <div className="px-5 pb-5 -mt-12 relative z-10 space-y-3">
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
                    onClick={() => setIsEditProfileOpen(true)}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-[#FFD966] text-[#3D2505] border border-[#ECD9A8] shadow-md flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C5500] block">
                    Pháp Danh Cư Sĩ
                  </span>
                  <h2 className="font-heading font-serif font-bold text-xl text-[#2E1E0F]">
                    {dharmaName}
                  </h2>
                  <p className="text-[11px] text-[#5A4329] italic font-serif mt-1 max-w-xs mx-auto leading-relaxed">
                    “{userMotto}”
                  </p>
                </div>

                {/* Refuge Details Mini Box — Full Text Without Clipping */}
                <div className="grid grid-cols-3 gap-1.5 pt-1 text-left">
                  <div className="p-2 rounded-xl bg-white border border-[#EEDBBA] min-w-0">
                    <span className="text-[9px] uppercase text-[#7D6442] block">Ngày Quy Y</span>
                    <span className="text-[10.5px] font-mono font-bold text-[#2E1E0F] whitespace-nowrap truncate block mt-0.5">
                      {refugeDate}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#EEDBBA] min-w-0">
                    <span className="text-[9px] uppercase text-[#7D6442] block">Đạo Tràng</span>
                    <span className="text-[10.5px] font-bold text-[#2E1E0F] whitespace-nowrap truncate block mt-0.5">
                      {refugeTemple}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#EEDBBA] min-w-0">
                    <span className="text-[9px] uppercase text-[#7D6442] block">Truyền Giới</span>
                    <span className="text-[10.5px] font-bold text-[#8C5500] whitespace-nowrap truncate block mt-0.5">
                      {masterName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. CÂY BỒ ĐỀ CÔNG ĐỨC & CHỈ SỐ HÀNH TRÌ */}
          <section
            aria-label="Cây Bồ Đề Công Đức"
            className="rounded-3xl bg-white border border-[#EEDBBA] p-4 sm:p-5 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#ECD9A8] flex items-center justify-center text-[#8C5500] shadow-md">
                  <BodhiLeafIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5500] block">
                    {bodhiStageTitle}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono text-2xl font-black text-[#2E1E0F]">
                      {totalMeritPoints}
                    </span>
                    <span className="text-xs text-[#6A5234]">điểm công đức</span>
                  </div>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-[#FFF4D0] border border-[#EEDBBA] text-[10px] font-mono font-bold text-[#8C5500]">
                {meritLedger.length} thời khóa
              </span>
            </div>

            {/* 4 Quick Practice Links */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#F2E5C7] text-xs">
              <button
                type="button"
                onClick={() => router.push('/thu-vien')}
                className="p-3 rounded-2xl bg-white border border-[#EEDBBA] flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <SutraScrollIcon className="w-4 h-4 text-[#8C5500]" />
                  <span className="font-bold text-[#2E1E0F]">Kinh Tạng</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#8C5500]" />
              </button>

              <button
                type="button"
                onClick={() => router.push('/thuc-hanh')}
                className="p-3 rounded-2xl bg-white border border-[#EEDBBA] flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <MeditatingMonkOutlineIcon className="w-4 h-4 text-[#8C5500]" />
                  <span className="font-bold text-[#2E1E0F]">Tọa Thiền</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#8C5500]" />
              </button>
            </div>
          </section>

          {/* 3. BẢNG TỰ KIỂM NGŨ GIỚI TẠI GIA (5 PRECEPTS CHECKLIST) */}
          <section
            aria-label="Bảng tự kiểm Ngũ Giới"
            className="rounded-3xl bg-white border border-[#EEDBBA] p-4 sm:p-5 space-y-3.5 shadow-xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#EEDBBA]">
              <div className="flex items-center gap-2">
                <LotusMinimalIcon className="w-4 h-4 text-[#8C5500]" />
                <h3 className="font-heading font-serif font-bold text-base text-[#8C5500]">
                  Tự Kiểm Ngũ Giới Hôm Nay
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#2E1E0F]">
                {checkedPrecepts.length}/5 giới
              </span>
            </div>

            <div className="space-y-2">
              {FIVE_PRECEPTS_LIST.map((p) => {
                const isChecked = checkedPrecepts.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => handleTogglePrecept(p.id)}
                    className={cn(
                      'p-3 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all',
                      isChecked
                        ? 'bg-[#FFF9EA] border-[#E5C158]'
                        : 'bg-white border-[#F2E5C7]'
                    )}
                  >
                    <div
                      className={cn(
                        'w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5',
                        isChecked
                          ? 'bg-[#F5C542] border-[#FFF3B0] text-[#3D2505]'
                          : 'bg-white border-[#EEDBBA] text-transparent'
                      )}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase text-[#8C5500] block truncate whitespace-nowrap">
                        {p.number} • {p.pali}
                      </span>
                      <h4 className="font-heading font-serif font-bold text-xs sm:text-sm text-[#2E1E0F] mt-0.5 truncate whitespace-nowrap">
                        {p.title}
                      </h4>
                      <p className="text-[11px] text-[#6A5234] mt-0.5 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleConfirmPreceptsToday}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Xác Nhận Trì Giới Hôm Nay (+25 Công Đức)</span>
            </button>
          </section>

          {/* 4. SỔ CÔNG ĐỨC HỒI HƯỚNG TRỰC TIẾP */}
          <section
            aria-label="Sổ Công Đức Hồi Hướng"
            className="rounded-3xl bg-white border border-[#EEDBBA] p-4 sm:p-5 space-y-3 shadow-xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#F2E5C7]">
              <h3 className="font-heading font-serif font-bold text-base text-[#8C5500]">
                Nhật Ký Sổ Công Đức Dharma
              </h3>
              <span className="text-xs text-[#7D6442]">{meritLedger.length} mục</span>
            </div>

            {meritLedger.length === 0 ? (
              <p className="text-xs text-[#6A5234] py-3 text-center">
                Các thời khóa Dâng Hương, Lần Chuỗi, Tọa Thiền, Tụng Kinh và Trì Giới sẽ tự động lưu tại đây.
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar">
                {meritLedger.slice(0, 6).map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 rounded-2xl bg-white border border-[#EEDBBA] flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <h5 className="font-heading font-serif font-bold text-xs text-[#2E1E0F] truncate">
                        {entry.title}
                      </h5>
                      <p className="text-[11px] text-[#7D6442] truncate mt-0.5">
                        {entry.detail}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#8C5500] shrink-0">
                      +{entry.meritPoints}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 5. SỔ TAY CÁ NHÂN & CÀI ĐẶT DHARMA */}
          <section
            aria-label="Tiện ích Cư Sĩ"
            className="rounded-3xl bg-white border border-[#EEDBBA] p-4 sm:p-5 space-y-2 shadow-xl"
          >
            <h3 className="font-heading font-serif font-bold text-base text-[#8C5500] pb-1">
              Sổ Tay Cư Sĩ &amp; Hệ Thống Dharma
            </h3>

            <div className="divide-y divide-[#F5C542]/15 text-xs sm:text-sm">
              <div
                onClick={() => setIsMemorialBookOpen(true)}
                className="flex items-center justify-between py-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <LotusMinimalIcon className="w-4 h-4 text-[#8C5500]" />
                  <div>
                    <h5 className="font-bold text-[#2E1E0F] group-hover:text-[#8C5500]">
                      Sổ Hiếu Hạnh Gia Tiên
                    </h5>
                    <p className="text-[11px] text-[#7D6442]">Ghi nhớ ngày húy kỵ thân quyến</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8C5500]" />
              </div>

              <div
                onClick={() => setIsMeditationScheduleOpen(true)}
                className="flex items-center justify-between py-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <TempleBellIcon className="w-4 h-4 text-[#8C5500]" />
                  <div>
                    <h5 className="font-bold text-[#2E1E0F] group-hover:text-[#8C5500]">
                      Chuông Nhắc Thời Khóa
                    </h5>
                    <p className="text-[11px] text-[#7D6442]">Hẹn giờ công phu sáng &amp; tĩnh tâm tối</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8C5500]" />
              </div>

              <div
                onClick={() => setIsAboutDharmaOpen(true)}
                className="flex items-center justify-between py-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <DharmaWheelIcon className="w-4 h-4 text-[#8C5500]" />
                  <div>
                    <h5 className="font-bold text-[#2E1E0F] group-hover:text-[#8C5500]">
                      Về Nền Tảng Phật Pháp Dharma
                    </h5>
                    <p className="text-[11px] text-[#7D6442]">Tầm nhìn số hóa Tam Tạng &amp; Chánh Niệm</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8C5500]" />
              </div>

              <div
                onClick={() => setIsSupportDharmaOpen(true)}
                className="flex items-center justify-between py-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <BodhiLeafIcon className="w-4 h-4 text-[#8C5500]" />
                  <div>
                    <h5 className="font-bold text-[#2E1E0F] group-hover:text-[#8C5500]">
                      Ấn Tống Kinh Điển &amp; Hộ Trì Dharma
                    </h5>
                    <p className="text-[11px] text-[#7D6442]">Chung tay lan tỏa ánh sáng Phật Pháp</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8C5500]" />
              </div>

              <div
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.share) {
                    navigator
                      .share({
                        title: 'Dharma — Không Gian Chánh Niệm & Tam Tạng Pháp Bảo',
                        text: 'Cùng hành trì chánh niệm, tụng kinh và dưỡng tâm mỗi ngày trên Dharma.',
                        url: window.location.origin,
                      })
                      .catch(() => {});
                  } else {
                    showToast('Đã sao chép liên kết nền tảng Phật Pháp Dharma');
                  }
                }}
                className="flex items-center justify-between py-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <Share2 className="w-4 h-4 text-[#8C5500]" />
                  <div>
                    <h5 className="font-bold text-[#2E1E0F] group-hover:text-[#8C5500]">
                      Chia Sẻ Pháp Bảo Dharma
                    </h5>
                    <p className="text-[11px] text-[#7D6442]">Gieo duyên lành đến đạo hữu &amp; người thân</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8C5500]" />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP VIEW (>= lg) - DHARMA RADIANT GOLD PROFILE                        */}
      {/* ========================================================================= */}
      <div className="hidden lg:block">
        <OmManiDesktopProfile
          dharmaName={dharmaName}
          fullName={realName}
          userMotto={userMotto}
          refugeDate={refugeDate}
          refugeTemple={refugeTemple}
          masterName={masterName}
          preceptsList={FIVE_PRECEPTS_LIST}
          checkedPrecepts={checkedPrecepts}
          onTogglePrecept={handleTogglePrecept}
          onConfirmPreceptsToday={handleConfirmPreceptsToday}
          meritLedger={meritLedger}
          totalMeritPoints={totalMeritPoints}
          bodhiStageTitle={bodhiStageTitle}
          onOpenEditProfile={() => setIsEditProfileOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenMemorial={() => setIsMemorialBookOpen(true)}
          onOpenPersonalEvents={() => router.push('/lich-phat-giao')}
          onOpenMeditationSchedule={() => setIsMeditationScheduleOpen(true)}
          onOpenSupport={() => setIsSupportDharmaOpen(true)}
          onLogout={() => {
            logout();
            showToast('Đã đăng xuất tài khoản Cư Sĩ');
          }}
          showToast={showToast}
        />
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: CẬP NHẬT THẺ CƯ SĨ HOÀNG KIM DHARMA                              */}
      {/* ========================================================================= */}
      {isEditProfileOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEditProfileOpen(false);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-4 bg-black/50 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm max-h-[86vh] overflow-y-auto no-scrollbar rounded-3xl bg-white border border-[#ECD9A8] p-5 text-[#2E1E0F] shadow-2xl space-y-4">
            <div className="w-12 h-1.5 rounded-full bg-[#F5C542]/40 mx-auto mb-1 sm:hidden" />
            <div className="flex items-center justify-between pb-2 border-b border-[#EEDBBA]">
              <h3 className="font-heading font-serif font-bold text-base text-[#8C5500]">
                Cập Nhật Thẻ Cư Sĩ Dharma
              </h3>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="text-[#7D6442] hover:text-[#2E1E0F] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="text-[#5A4329] block mb-1 font-medium">Pháp Danh *</label>
                <input
                  type="text"
                  required
                  value={dharmaName}
                  onChange={(e) => setDharmaName(e.target.value)}
                  placeholder="Ví dụ: Tâm An, Minh Giác, Diệu Hiền..."
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F] focus:border-[#E5C158] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[#5A4329] block mb-1 font-medium">Thế Danh (Họ tên)</label>
                <input
                  type="text"
                  value={realName}
                  onChange={(e) => setRealName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F] focus:border-[#E5C158] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#5A4329] block mb-1 font-medium">Chùa Quy Y</label>
                  <input
                    type="text"
                    value={refugeTemple}
                    onChange={(e) => setRefugeTemple(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F]"
                  />
                </div>
                <div>
                  <label className="text-[#5A4329] block mb-1 font-medium">Ngày Quy Y</label>
                  <input
                    type="date"
                    value={refugeDate}
                    onChange={(e) => setRefugeDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#5A4329] block mb-1 font-medium">Tâm Nguyện Hành Trì</label>
                <input
                  type="text"
                  value={userMotto}
                  onChange={(e) => setUserMotto(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F] focus:border-[#E5C158] focus:outline-hidden"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white border border-[#EEDBBA] text-[#6A5234] font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold shadow-md cursor-pointer"
                >
                  Lưu Thẻ Cư Sĩ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: VỀ NỀN TẢNG DHARMA                                               */}
      {/* ========================================================================= */}
      {isAboutDharmaOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAboutDharmaOpen(false);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-4 bg-black/50 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm max-h-[86vh] overflow-y-auto no-scrollbar rounded-3xl bg-white border border-[#ECD9A8] p-6 text-[#2E1E0F] shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl border border-[#ECD9A8]/60 overflow-hidden shadow-lg bg-white">
              <img
                src="/dharma-logo.png"
                alt="Dharma Logo"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="font-heading font-serif text-lg font-bold text-[#8C5500]">
                DHARMA — Không Gian Chánh Niệm
              </h3>
              <p className="text-xs text-[#6A5234] mt-1">
                Tam Tạng Pháp Bảo • Thiền Quán • Hồi Hướng Công Đức
              </p>
            </div>

            <p className="text-xs text-[#5A4329] leading-relaxed text-left p-3.5 rounded-2xl bg-white border border-[#EEDBBA]">
              Dharma được kiến tạo độc lập với sứ mệnh kết hợp tinh hoa giáo lý Phật Đà nguyên bản cùng công nghệ hiện đại: từ Thời Khóa 4 Thời Tỉnh Thức, Bộ Hòa Âm Thiền Tự Đa Tầng, Trình Tụng Kinh Cuộn Chữ Tự Động cho đến Bảng Tự Kiểm Ngũ Giới và Sổ Công Đức Hồi Hướng.
            </p>

            <button
              type="button"
              onClick={() => setIsAboutDharmaOpen(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] font-bold text-xs cursor-pointer"
            >
              Hoan Hỷ Đóng
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ẤN TỐNG KINH ĐIỂN & HỘ TRÌ DHARMA                                */}
      {/* ========================================================================= */}
      {isSupportDharmaOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsSupportDharmaOpen(false);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-4 bg-black/50 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm max-h-[86vh] overflow-y-auto no-scrollbar rounded-3xl bg-white border border-[#ECD9A8] p-6 text-[#2E1E0F] shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFF4D0] border border-[#ECD9A8] flex items-center justify-center text-[#8C5500]">
              <LotusMinimalIcon className="w-6 h-6" />
            </div>

            <h3 className="font-heading font-serif text-lg font-bold text-[#8C5500]">
              Ấn Tống Kinh Điển Số &amp; Hộ Trì Dharma
            </h3>

            <p className="text-xs text-[#5A4329] leading-relaxed text-left p-3.5 rounded-2xl bg-white border border-[#EEDBBA] space-y-2">
              <span>
                “Trong các sự cúng dường, cúng dường Pháp là tối thượng.” Mọi sự phát tâm của quý Cư sĩ đều dành trọn cho việc duy trì máy chủ và số hóa Tam Tạng Kinh Điển miễn phí.
              </span>
              <span className="block font-bold text-[#8C5500] pt-1 font-mono">
                Quỹ Ấn Tống Kinh Điển Số DHARMA<br />
                Nội dung: Hoan hy ho tri Phat Phap Dharma
              </span>
            </p>

            <button
              type="button"
              onClick={() => {
                playBellSound(0.4);
                showToast('Nam Mô Công Đức Lâm Bồ Tát Ma Ha Tát!');
                setIsSupportDharmaOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] font-bold text-xs cursor-pointer"
            >
              Tuỳ Hỷ Công Đức
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: SỔ HIẾU HẠNH GIA TIÊN                                            */}
      {/* ========================================================================= */}
      {isMemorialBookOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMemorialBookOpen(false);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-4 bg-black/50 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm max-h-[86vh] overflow-y-auto no-scrollbar rounded-3xl bg-white border border-[#ECD9A8] p-5 text-[#2E1E0F] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEDBBA]">
              <h3 className="font-heading font-serif font-bold text-base text-[#8C5500]">
                Sổ Hiếu Hạnh Gia Tiên
              </h3>
              <button
                type="button"
                onClick={() => setIsMemorialBookOpen(false)}
                className="text-[#7D6442] hover:text-[#2E1E0F] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
              {memorials.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-2xl bg-white border border-[#EEDBBA] flex items-center justify-between text-xs"
                >
                  <div>
                    <h5 className="font-bold text-[#2E1E0F]">
                      {m.name} ({m.relation})
                    </h5>
                    <p className="text-[#8C5500] font-mono mt-0.5">{m.lunarDate}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-[#EEDBBA] text-xs">
              <input
                type="text"
                placeholder="Họ tên & Pháp danh tiên linh"
                value={newMemName}
                onChange={(e) => setNewMemName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F]"
              />
              <input
                type="text"
                placeholder="Ngày húy kỵ Âm lịch (VD: 15/07 Âm lịch)"
                value={newMemDate}
                onChange={(e) => setNewMemDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F]"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newMemName.trim()) return;
                  setMemorials((prev) => [
                    ...prev,
                    {
                      id: Date.now().toString(),
                      name: newMemName.trim(),
                      relation: 'Gia tiên',
                      lunarDate: newMemDate.trim() || '15/07 Âm lịch',
                    },
                  ]);
                  setNewMemName('');
                  setNewMemDate('');
                  playWoodenFishSound(0.5);
                  showToast('Đã lưu ngày tưởng niệm vào Sổ Hiếu Hạnh');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] font-bold cursor-pointer"
              >
                + Thêm Ngày Tưởng Niệm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: CHUÔNG NHẮC THỜI KHÓA                                            */}
      {/* ========================================================================= */}
      {isMeditationScheduleOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMeditationScheduleOpen(false);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-4 bg-black/50 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm max-h-[86vh] overflow-y-auto no-scrollbar rounded-3xl bg-white border border-[#ECD9A8] p-5 text-[#2E1E0F] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEDBBA]">
              <h3 className="font-heading font-serif font-bold text-base text-[#8C5500]">
                Chuông Nhắc Thời Khóa Hằng Ngày
              </h3>
              <button
                type="button"
                onClick={() => setIsMeditationScheduleOpen(false)}
                className="text-[#7D6442] hover:text-[#2E1E0F] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-[#EEDBBA] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#2E1E0F] block">05:30 • Tĩnh Tâm Sớm Mai</span>
                  <span className="text-[#7D6442]">Thỉnh 3 tiếng chuông &amp; quán hơi thở</span>
                </div>
                <span className="text-emerald-400 font-bold">Đang bật</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-[#EEDBBA] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#2E1E0F] block">21:00 • Tịnh Độ Đêm Khuya</span>
                  <span className="text-[#7D6442]">Tự kiểm Ngũ Giới &amp; Hồi hướng công đức</span>
                </div>
                <span className="text-emerald-400 font-bold">Đang bật</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                playBellSound(0.4);
                showToast('Đã lưu lịch Chuông Nhắc Thời Khóa Dharma');
                setIsMeditationScheduleOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] font-bold text-xs cursor-pointer"
            >
              Hoàn Tất
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: CÀI ĐẶT ỨNG DỤNG DHARMA                                          */}
      {/* ========================================================================= */}
      {isSettingsOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsSettingsOpen(false);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-4 bg-black/50 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm max-h-[86vh] overflow-y-auto no-scrollbar rounded-3xl bg-white border border-[#ECD9A8] p-5 text-[#2E1E0F] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEDBBA]">
              <h3 className="font-heading font-serif font-bold text-base text-[#8C5500]">
                Cài Đặt Hệ Thống Dharma
              </h3>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="text-[#7D6442] hover:text-[#2E1E0F] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#EEDBBA]">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#8C5500]" />
                  <span>Ngôn ngữ hiển thị</span>
                </div>
                <LanguageSwitcher compact variant="sanctuary" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#EEDBBA]">
                <div className="flex items-center gap-2">
                  <TempleBellIcon className="w-4 h-4 text-[#8C5500]" />
                  <span>Âm thanh pháp khí WebAudio</span>
                </div>
                <span className="text-emerald-400 font-bold">Độ trễ 0ms</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#EEDBBA]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#8C5500]" />
                  <span>Sổ Công Đức &amp; Hồ Sơ</span>
                </div>
                <span className="text-[#8C5500] font-semibold">Đã đồng bộ</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] font-bold text-xs cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* FLOATING TOAST */}
      {toastMessage && (
        <div className="fixed top-16 inset-x-3 z-50 flex justify-center pointer-events-none animate-fadeInDown">
          <div className="px-4 py-2.5 rounded-2xl bg-white/95 border border-[#ECD9A8] text-center shadow-xl backdrop-blur-md">
            <p className="font-heading text-xs sm:text-sm font-bold text-[#8C5500]">
              {toastMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
