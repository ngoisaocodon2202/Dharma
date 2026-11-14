'use client';

import React, { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Bell,
  BellOff,
  Check,
  X,
  Trash2,
  Leaf,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CenterToast } from '@/components/ui/CenterToast';
import { getLunarDate, type LunarDateInfo } from '@/lib/lunar-calendar';
import { BUDDHA_ASSETS, PAGODA_ASSETS, ARTICLE_ASSETS, SACRED_MANDALA_FALLBACK } from '@/lib/assets';
import { useDharmaStore, getTodayDateKey } from '@/store/useDharmaStore';
import { playBellSound, playSoftTabBellSound } from '@/lib/buddhistSounds';

type CalendarFilterMode = 'all' | 'via_phat' | 'trai_gioi' | 'ca_nhan';
type TraiRegimen = 'LUC_TRAI' | 'THAP_TRAI';

interface BuddhistEventItem {
  id: string;
  solarDateKey: string;
  day: number;
  month: number;
  year: number;
  weekdayLabel: string;
  lunarLabel: string;
  title: string;
  category: 'via_phat' | 'trai_gioi' | 'ca_nhan';
  categoryLabel: string;
  description: string;
  suggestedSutraSlug?: string;
  image: string;
}

interface PersonalReminder {
  id: string;
  dateKey: string;
  title: string;
  note: string;
  type: 'gio' | 'quan_trong' | 'trai_gioi' | 'cau_an';
}

interface VegetarianMealPlan {
  traiMeaning: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  ingredients: string;
  healthBenefit: string;
  mindfulTip: string;
  tea: string;
}

const REMINDER_STORAGE_KEY = 'phatphap_personal_reminders_v2';
const TRAI_VOW_PREFIX = 'phatphap_dharma_trai_vow_';
const WEEKDAY_HEADERS = ['Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'CN'];
const JS_WEEKDAY_VI = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

const VEGETARIAN_MEAL_PLANS: VegetarianMealPlan[] = [
  {
    traiMeaning:
      'Thọ Trì Trai Giới Thanh Tịnh: Ăn chay trong chánh niệm giúp giảm bớt tham dục, trưởng dưỡng lòng từ bi bình đẳng với muôn loài và giữ thân tâm nhẹ nhàng sáng suốt.',
    breakfast: 'Cháo nấm rơm đậu xanh hành boa-rô & trà gừng ấm',
    lunch: 'Cơm gạo lứt, đậu hũ non sốt nấm đông cô & canh cải xanh nấu gừng',
    dinner: 'Bún xào rau củ ngũ sắc thanh đạm không ngũ tân',
    ingredients: 'Đậu hũ non, nấm đông cô tươi, đậu xanh nguyên vỏ, cải bẹ xanh, hành boa-rô, gạo lứt.',
    healthBenefit: 'Giàu đạm thực vật dễ tiêu, thanh lọc huyết mạch, giảm hỏa vượng và an thần dịu tâm.',
    mindfulTip: 'Rửa rau chậm rãi với lòng tri ân đất trời; hạn chế gia vị cay nóng (ngũ tân) để tâm lắng dịu.',
    tea: 'Trà tâm sen & kỷ tử ấm tỳ vị',
  },
  {
    traiMeaning:
      'Ngày Sóc / Vọng (Mùng 1 & Rằm): Năng lượng đất trời giao hòa. Thọ trì trai giới giúp làm nhẹ nghiệp lực, tăng trưởng phước báu và trí tuệ sáng suốt.',
    breakfast: 'Phở nấm hương rau củ & trà gừng mật hoa',
    lunch: 'Cơm trắng dẻo, nấm đùi gà kho tiêu xanh & canh bí đỏ đậu phộng',
    dinner: 'Súp bí đỏ hạt điều & salad rau mầm mè rang',
    ingredients: 'Nấm đùi gà, nấm hương khô, bí đỏ hồ lô, đậu phộng tươi, hạt điều rang lạt, rau mầm.',
    healthBenefit: 'Bổ sung beta-carotene, chất xơ hòa tan và axit béo lành mạnh giúp tỉnh táo khi tụng niệm.',
    mindfulTip: 'Trước bữa Ngọ Trai, đọc thầm Ngũ Quán Tưởng để chuyển hóa năng lượng biết ơn thành phước lành.',
    tea: 'Trà hoa cúc vàng & táo đỏ',
  },
  {
    traiMeaning:
      'Ngày Lục Trai Tịnh Tâm: Trì giữ sáu ngày ăn chay trong tháng giúp nuôi dưỡng lòng từ ái, giảm sát nghiệp và khơi dậy sự nhẹ nhàng thanh thoát nơi thân tâm.',
    breakfast: 'Bánh cuốn chay nhân nấm mộc nhĩ & sữa đậu nành ấm',
    lunch: 'Cơm độn hạt sen, mít non kho tộ & canh rau ngót chay',
    dinner: 'Miến dong trộn rau củ thập cẩm thanh nhẹ',
    ingredients: 'Mít non luộc, nấm mộc nhĩ đen, hạt sen tươi, rau ngót vườn, miến dong củ, cà rốt.',
    healthBenefit: 'Ít dầu mỡ, giàu khoáng chất kali và sắt tự nhiên, hỗ trợ tiêu hóa nhẹ nhàng trước giờ tọa thiền.',
    mindfulTip: 'Nêm gia vị vừa phải bằng nước tương ủ tự nhiên; vừa nấu vừa giữ hơi thở an trú trong hiện tại.',
    tea: 'Trà ô long quế hoa thanh tâm',
  },
  {
    traiMeaning:
      'Ngày Huân Tu Dưỡng Khí: Ăn chay không chỉ là tránh sát sinh mà còn là nghệ thuật sống tối giản, nhường nhịn và bảo hộ sự sống xanh của hành tinh.',
    breakfast: 'Xôi đậu xanh hạt sen & muối vừng lạc rang',
    lunch: 'Cơm tấm bì chay, tàu hũ ky áp chảo & canh chua dọc mùng chay',
    dinner: 'Bánh canh nấm rơm rau củ ngọt nước dùng mía lau',
    ingredients: 'Đậu xanh cà vỏ, tàu hũ ky lá, nấm rơm búp, mía lau, cà rốt, bắp Mỹ, me chín.',
    healthBenefit: 'Cung cấp năng lượng bền vững từ tinh bột phức hợp và chất chống oxy hóa thực vật.',
    mindfulTip: 'Hầm nước dùng từ củ quả ngọt tự nhiên thay cho bột ngọt công nghiệp để giữ vị thanh khiết.',
    tea: 'Trà lá vối nụ thanh nhiệt',
  },
  {
    traiMeaning:
      'Ngày Hồi Hướng Gia Đạo: Dùng bữa cơm chay đầm ấm bên gia đình, giữ ái ngữ và tâm hoan hỷ để từng bữa ăn trở thành thời khóa tu tập bình an.',
    breakfast: 'Hủ tiếu chay nước dùng củ sắn & rau tần ô',
    lunch: 'Cơm thảo mộc, cà tím om đậu phụ & canh cải thảo cuộn nấm',
    dinner: 'Cháo nấm bào ngư đậu xanh gừng sợi ấm bụng',
    ingredients: 'Củ sắn nước, cà tím dài, nấm bào ngư xám, cải thảo Đà Lạt, gừng non, đậu xanh.',
    healthBenefit: 'Làm ấm trung tiêu, tăng cường sức đề kháng và cân bằng âm dương trong cơ thể.',
    mindfulTip: 'Ăn chậm, nhai kỹ 30 lần để thưởng thức trọn vẹn vị ngọt tự nhiên của hạt gạo và rau xanh.',
    tea: 'Trà xanh Thái Nguyên pha loãng & hoa nhài',
  },
  {
    traiMeaning:
      'Ngày Thiền Vị Tịch Tĩnh: Thực hành ăn chay thanh đạm vào buổi chiều tối giúp thân thể nhẹ nhõm, giấc ngủ an lành và dễ nhiếp tâm vào hơi thở.',
    breakfast: 'Cháo kê đậu đỏ & bánh mì nguyên cám bơ mè',
    lunch: 'Cơm đậu đen, khổ qua kho nấm & canh mướp hương mồng tơi',
    dinner: 'Súp bắp non nấm tuyết thanh đạm dễ tiêu',
    ingredients: 'Hạt kê vàng, đậu đỏ, khổ qua (mướp đắng), nấm tuyết nhĩ, bắp non, mướp hương.',
    healthBenefit: 'Giải độc gan tự nhiên, ổn định đường huyết và làm mát cơ thể trong những ngày nắng ấm.',
    mindfulTip: 'Dành phần cơm cúng dường Tam Bảo hoặc chia sẻ cho người hữu duyên để tăng trưởng tâm hỷ xả.',
    tea: 'Trà hoa bưởi & cam thảo thanh giọng',
  },
];

function resolveEventVisual(viaName?: string, lunarDay?: number): string {
  const lower = (viaName || '').toLowerCase();
  if (lower.includes('dược sư')) return '/images/buddhas/duc-phat-duoc-su.png';
  if (lower.includes('a di đà')) return '/images/buddhas/duc-phat-a-di-da.png';
  if (lower.includes('quán thế âm')) return '/images/buddhas/quan-the-am-bo-tat.png';
  if (lower.includes('địa tạng')) return '/images/buddhas/dia-tang-vuong-bo-tat.png';
  if (lower.includes('thích ca') || lower.includes('phật đản')) return '/images/buddhas/duc-phat-thich-ca.png';
  if (lower.includes('di lặc')) return '/images/buddhas/phat-di-lac.png';
  if (lower.includes('phổ hiền')) return '/images/buddhas/pho-hien-bo-tat.png';
  if (lower.includes('văn thù')) return '/images/buddhas/van-thu-su-loi-bo-tat.png';
  if (lower.includes('đạt ma')) return '/images/buddhas/to-su-bo-de-dat-ma.png';
  if (lunarDay === 15) return '/images/buddhas/dai-nhat-nhu-lai.png';
  if (lunarDay === 1) return '/images/buddhas/dai-the-chi-bo-tat.png';
  return SACRED_MANDALA_FALLBACK;
}

function resolveSuggestedSutraSlug(viaName?: string): string {
  const lower = (viaName || '').toLowerCase();
  if (lower.includes('dược sư')) return 'duoc-su';
  if (lower.includes('a di đà')) return 'a-di-da';
  if (lower.includes('quán thế âm')) return 'dai-bi';
  if (lower.includes('địa tạng')) return 'dia-tang';
  if (lower.includes('vu lan')) return 'vu-lan';
  return 'bat-nha';
}

const YEAR_ROUND_FESTIVALS = [
  { month: 'Tháng Giêng', day: 'Mùng 1', title: 'Vía Đức Phật Di Lặc & Xuân Di Lặc', desc: 'Đón xuân chánh niệm, thực hành hỷ xả và nụ cười từ bi', solarHintMonth: 2 },
  { month: 'Tháng Giêng', day: 'Mùng 8', title: 'Đàn Tràng Dược Sư Thất Châu Cầu An', desc: 'Khai kinh Dược Sư đầu năm cầu quốc thái dân an', solarHintMonth: 2 },
  { month: 'Tháng Giêng', day: 'Rằm (15)', title: 'Đại Lễ Thượng Nguyên (Rằm Tháng Giêng)', desc: 'Lễ Phật quanh năm không bằng Rằm tháng Giêng', solarHintMonth: 2 },
  { month: 'Tháng 2', day: 'Mùng 8', title: 'Kỷ Niệm Thái Tử Tất Đạt Đa Xuất Gia', desc: 'Bước chân vượt thành tầm đạo giải thoát cho muôn loài', solarHintMonth: 3 },
  { month: 'Tháng 2', day: 'Rằm (15)', title: 'Đại Lễ Phật Thích Ca Nhập Niết Bàn', desc: 'Tưởng niệm lời di huấn tối hậu: Hãy tự mình thắp đuốc lên mà đi', solarHintMonth: 3 },
  { month: 'Tháng 2', day: '19', title: 'Vía Bồ Tát Quán Thế Âm Đản Sinh', desc: 'Đảnh lễ hạnh nguyện lắng nghe sâu để xoa dịu khổ đau', solarHintMonth: 3 },
  { month: 'Tháng 2', day: '21', title: 'Vía Bồ Tát Phổ Hiền Đại Hạnh', desc: 'Thực hành Mười Đại Nguyện Vương của Bồ Tát Phổ Hiền', solarHintMonth: 3 },
  { month: 'Tháng 3', day: '16', title: 'Vía Phật Mẫu Chuẩn Đề', desc: 'Trì tụng Chuẩn Đề Thần Chú thanh tịnh thân khẩu ý', solarHintMonth: 4 },
  { month: 'Tháng 4', day: 'Mùng 4', title: 'Vía Bồ Tát Văn Thù Sư Lợi Đại Trí', desc: 'Thắp sáng gươm báu trí tuệ Bát Nhã đoạn trừ vô minh', solarHintMonth: 5 },
  { month: 'Tháng 4', day: 'Rằm (15)', title: 'Đại Lễ Phật Đản Vesak Tam Hợp', desc: 'Kỷ niệm Đản Sinh, Thành Đạo và Nhập Niết Bàn của Đức Thế Tôn', solarHintMonth: 5 },
  { month: 'Tháng 6', day: '19', title: 'Vía Bồ Tát Quán Thế Âm Thành Đạo', desc: 'Hạnh nguyện đại từ đại bi cứu khổ cứu nạn viên mãn', solarHintMonth: 7 },
  { month: 'Tháng 7', day: '13', title: 'Vía Bồ Tát Đại Thế Chí', desc: 'Dùng ánh sáng trí tuệ nhiếp niệm thanh tịnh sáu căn', solarHintMonth: 8 },
  { month: 'Tháng 7', day: 'Rằm (15)', title: 'Đại Lễ Vu Lan Báo Hiếu & Tự Tứ Tăng', desc: 'Mùa hiếu hạnh tri ân Tứ Trọng Ân và cứu độ cửu huyền thất tổ', solarHintMonth: 8 },
  { month: 'Tháng 7', day: '30 (29)', title: 'Vía Bồ Tát Địa Tạng Vương', desc: 'Địa ngục vị không, thệ bất thành Phật; chúng sinh độ tận, phương chứng Bồ Đề', solarHintMonth: 9 },
  { month: 'Tháng 9', day: '19', title: 'Vía Bồ Tát Quán Thế Âm Xuất Gia', desc: 'Phát tâm Bồ Đề rộng lớn vì lợi ích an lạc của chúng sinh', solarHintMonth: 10 },
  { month: 'Tháng 9', day: '30 (29)', title: 'Vía Đức Phật Dược Sư Lưu Ly Quang', desc: 'Mười hai đại nguyện trị lành tâm bệnh và thân bệnh', solarHintMonth: 11 },
  { month: 'Tháng 10', day: 'Mùng 5', title: 'Vía Sơ Tổ Bồ Đề Đạt Ma', desc: 'Khơi nguồn dòng thiền Trực chỉ nhân tâm, kiến tính thành Phật', solarHintMonth: 11 },
  { month: 'Tháng 10', day: 'Rằm (15)', title: 'Đại Lễ Hạ Nguyên (Rằm Tháng Mười)', desc: 'Tam Nguyên cát khánh, tạ ơn Tam Bảo và hồi hướng công đức', solarHintMonth: 11 },
  { month: 'Tháng 11', day: '17', title: 'Khánh Đản Đức Phật A Di Đà', desc: 'Giáo chủ cõi Tây Phương Cực Lạc với 48 đại nguyện tiếp dẫn', solarHintMonth: 12 },
  { month: 'Tháng Chạp', day: 'Mùng 8', title: 'Đại Lễ Đức Phật Thích Ca Thành Đạo', desc: 'Dưới cội Bồ Đề khi sao Mai vừa mọc, Đức Phật chứng quả Chánh Đẳng Giác', solarHintMonth: 1 },
];

interface CalendarCell {
  year: number;
  month: number;
  day: number;
  inCurrentMonth: boolean;
  dateKey: string;
  isSunday: boolean;
  lunar: LunarDateInfo;
}

function BuddhistCalendarInner() {
  const searchParams = useSearchParams();
  const mealSectionRef = useRef<HTMLDivElement | null>(null);

  const profile = useDharmaStore((s) => s.profile);
  const addMeritEntry = useDharmaStore((s) => s.addMeritEntry);
  const updateProfile = useDharmaStore((s) => s.updateProfile);

  const [todayDate, setTodayDate] = useState<Date>(() => new Date());
  const [viewYear, setViewYear] = useState<number>(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(() => new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number>(() => new Date().getDate());

  const [filterMode, setFilterMode] = useState<CalendarFilterMode>('all');
  const [traiRegimen, setTraiRegimen] = useState<TraiRegimen>('LUC_TRAI');
  const [highlightMeals, setHighlightMeals] = useState(false);
  const [hasRecordedVowToday, setHasRecordedVowToday] = useState(false);

  const [isYearEventsOpen, setIsYearEventsOpen] = useState(false);
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<BuddhistEventItem | null>(null);
  const [isNotificationOn, setIsNotificationOn] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [reminders, setReminders] = useState<PersonalReminder[]>([]);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderNote, setReminderNote] = useState('');
  const [reminderType, setReminderType] = useState<'gio' | 'quan_trong' | 'trai_gioi' | 'cau_an'>('trai_gioi');
  const [reminderDate, setReminderDate] = useState(() => getTodayDateKey(new Date()));

  const todayKey = getTodayDateKey(todayDate);
  const todayLunarInfo = useMemo(
    () => getLunarDate(todayDate.getFullYear(), todayDate.getMonth() + 1, todayDate.getDate()),
    [todayDate]
  );

  useEffect(() => {
    if (profile.vegetarianMode === 'THAP_TRAI') {
      setTraiRegimen('THAP_TRAI');
    } else if (profile.vegetarianMode === 'LUC_TRAI') {
      setTraiRegimen('LUC_TRAI');
    }
  }, [profile.vegetarianMode]);

  useEffect(() => {
    const mode = searchParams?.get('che-do');
    if (!mode) return;
    if (mode === 'luc-trai') {
      setFilterMode('trai_gioi');
      setTraiRegimen('LUC_TRAI');
      setHighlightMeals(false);
    } else if (mode === 'thuc-don-chay') {
      setFilterMode('trai_gioi');
      setHighlightMeals(true);
      const timer = setTimeout(() => {
        mealSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 280);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  useEffect(() => {
    const syncClock = () => {
      const now = new Date();
      setTodayDate(now);
      setViewYear(now.getFullYear());
      setViewMonth(now.getMonth() + 1);
      setSelectedDay(now.getDate());
      setReminderDate(getTodayDateKey(now));
    };
    syncClock();

    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 2);
    const msUntilMidnight = nextMidnight.getTime() - now.getTime();
    const timer = setTimeout(syncClock, Math.max(msUntilMidnight, 1000));
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMINDER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setReminders(parsed);
      }
      const vowSaved = localStorage.getItem(`${TRAI_VOW_PREFIX}${todayKey}`);
      setHasRecordedVowToday(vowSaved === 'true');
    } catch {}
  }, [todayKey]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleChangeTraiRegimen = (regimen: TraiRegimen) => {
    playSoftTabBellSound(0.2);
    setTraiRegimen(regimen);
    updateProfile({ vegetarianMode: regimen });
    showToast(
      regimen === 'LUC_TRAI'
        ? 'Đã chuyển sang Lịch Lục Trai (6 ngày/tháng: 8, 14, 15, 23, 29, 30)'
        : 'Đã chuyển sang Lịch Thập Trai (10 ngày/tháng)'
    );
  };

  const handleRecordTraiDayVow = () => {
    playBellSound(0.5);
    setHasRecordedVowToday(true);
    try {
      localStorage.setItem(`${TRAI_VOW_PREFIX}${todayKey}`, 'true');
    } catch {}
    const lunarStr = `${String(todayLunarInfo.lunarDay).padStart(2, '0')}/${String(
      todayLunarInfo.lunarMonth
    ).padStart(2, '0')} Âm lịch`;
    const eventNote = todayLunarInfo.viaChuPhat ? ` (${todayLunarInfo.viaChuPhat})` : '';
    addMeritEntry({
      category: 'HUONG_DANG',
      title: `Phát Nguyện Thọ Trì Trai Giới (${lunarStr})`,
      dedicationText: `Giữ tâm từ bi, ăn chay thanh tịnh ngày ${lunarStr}${eventNote}.`,
    });
    showToast('Đã ghi nhận công đức Thọ Trai vào Sổ Công Đức DHARMA!');
  };

  const handleToggleNotification = () => {
    playBellSound(0.4);
    setIsNotificationOn((prev) => {
      const next = !prev;
      showToast(
        next
          ? 'Đã bật Chuông Báo Trai (nhắc ngày Sóc Vọng & Vía Chư Phật)'
          : 'Đã tạm tắt Chuông Báo Trai'
      );
      return next;
    });
  };

  const handleGoToday = () => {
    playSoftTabBellSound(0.2);
    const now = new Date();
    setTodayDate(now);
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth() + 1);
    setSelectedDay(now.getDate());
    showToast('Đã trở về ngày hôm nay');
  };

  const handlePrevMonth = () => {
    playSoftTabBellSound(0.18);
    if (viewMonth === 1) {
      setViewYear((y) => y - 1);
      setViewMonth(12);
    } else {
      setViewMonth((m) => m - 1);
    }
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    playSoftTabBellSound(0.18);
    if (viewMonth === 12) {
      setViewYear((y) => y + 1);
      setViewMonth(1);
    } else {
      setViewMonth((m) => m + 1);
    }
    setSelectedDay(1);
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle.trim()) return;
    const item: PersonalReminder = {
      id: `rem-${Date.now()}`,
      dateKey: reminderDate,
      title: reminderTitle.trim(),
      note: reminderNote.trim() || 'Giữ tâm thanh tịnh, hồi hướng bình an.',
      type: reminderType,
    };
    const nextList = [item, ...reminders];
    setReminders(nextList);
    try {
      localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(nextList));
    } catch {}
    playBellSound(0.4);
    setReminderTitle('');
    setReminderNote('');
    setIsAddReminderOpen(false);
    showToast('Đã lưu nhắc nhở vào Lịch Tu Tập');
  };

  const handleDeleteReminder = (id: string) => {
    const nextList = reminders.filter((r) => r.id !== id);
    setReminders(nextList);
    try {
      localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(nextList));
    } catch {}
    showToast('Đã xóa sự kiện cá nhân');
  };

  // Build full 7-column calendar cells (Monday-first, including adjacent leading/trailing days)
  const calendarCells = useMemo<CalendarCell[]>(() => {
    const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
    const firstJsDay = new Date(viewYear, viewMonth - 1, 1).getDay(); // 0=Sun..6=Sat
    const leadingCount = (firstJsDay + 6) % 7; // Mon=0..Sun=6
    const totalCells = Math.ceil((leadingCount + daysInMonth) / 7) * 7;

    const prevMonthYear = viewMonth === 1 ? viewYear - 1 : viewYear;
    const prevMonthNum = viewMonth === 1 ? 12 : viewMonth - 1;
    const daysInPrevMonth = new Date(prevMonthYear, prevMonthNum, 0).getDate();

    const nextMonthYear = viewMonth === 12 ? viewYear + 1 : viewYear;
    const nextMonthNum = viewMonth === 12 ? 1 : viewMonth + 1;

    const cells: CalendarCell[] = [];
    for (let i = 0; i < totalCells; i++) {
      let y = viewYear;
      let m = viewMonth;
      let d = 1;
      let inCurrentMonth = true;

      if (i < leadingCount) {
        y = prevMonthYear;
        m = prevMonthNum;
        d = daysInPrevMonth - leadingCount + 1 + i;
        inCurrentMonth = false;
      } else if (i >= leadingCount + daysInMonth) {
        y = nextMonthYear;
        m = nextMonthNum;
        d = i - (leadingCount + daysInMonth) + 1;
        inCurrentMonth = false;
      } else {
        d = i - leadingCount + 1;
      }

      const dateKey = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isSunday = i % 7 === 6;
      const lunar = getLunarDate(y, m, d);
      cells.push({ year: y, month: m, day: d, inCurrentMonth, dateKey, isSunday, lunar });
    }
    return cells;
  }, [viewYear, viewMonth]);

  const selectedDayInfo = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
    const safeDay = Math.min(Math.max(selectedDay, 1), daysInMonth);
    const solarDate = new Date(viewYear, viewMonth - 1, safeDay);
    const dateKey = `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(safeDay).padStart(2, '0')}`;
    const lunar = getLunarDate(viewYear, viewMonth, safeDay);
    return {
      day: safeDay,
      dateKey,
      weekdayLabel: JS_WEEKDAY_VI[solarDate.getDay()],
      lunar,
    };
  }, [viewYear, viewMonth, selectedDay]);

  const remindersByDate = useMemo(() => {
    const map: Record<string, PersonalReminder[]> = {};
    for (const r of reminders) {
      if (!map[r.dateKey]) map[r.dateKey] = [];
      map[r.dateKey].push(r);
    }
    return map;
  }, [reminders]);

  // All events in current viewMonth (DHARMA "Các sự kiện trong tháng X")
  const monthEvents = useMemo<BuddhistEventItem[]>(() => {
    const list: BuddhistEventItem[] = [];
    for (const cell of calendarCells) {
      if (!cell.inCurrentMonth) continue;
      const dObj = new Date(cell.year, cell.month - 1, cell.day);
      const weekdayLabel = JS_WEEKDAY_VI[dObj.getDay()];
      const lunarLabel = `Âm lịch ${String(cell.lunar.lunarDay).padStart(2, '0')}-${String(
        cell.lunar.lunarMonth
      ).padStart(2, '0')}`;

      if (cell.lunar.viaChuPhat) {
        list.push({
          id: `via-${cell.dateKey}`,
          solarDateKey: cell.dateKey,
          day: cell.day,
          month: cell.month,
          year: cell.year,
          weekdayLabel,
          lunarLabel,
          title: cell.lunar.viaChuPhat,
          category: 'via_phat',
          categoryLabel: 'Ngày Vía Chư Phật / Bồ Tát',
          description: `Ngày lễ vía ${cell.lunar.viaChuPhat} nhằm ngày ${cell.lunar.lunarDay} tháng ${cell.lunar.lunarMonth} Âm lịch. Khuyên phát tâm ăn chay, tụng kinh niệm Phật và làm việc thiện lành hồi hướng.`,
          suggestedSutraSlug: resolveSuggestedSutraSlug(cell.lunar.viaChuPhat),
          image: resolveEventVisual(cell.lunar.viaChuPhat, cell.lunar.lunarDay),
        });
      }

      if (cell.lunar.lunarDay === 1 || cell.lunar.lunarDay === 15) {
        const isFirst = cell.lunar.lunarDay === 1;
        list.push({
          id: `socvong-${cell.dateKey}`,
          solarDateKey: cell.dateKey,
          day: cell.day,
          month: cell.month,
          year: cell.year,
          weekdayLabel,
          lunarLabel,
          title: isFirst
            ? `Ngày mùng 1 tháng ${cell.lunar.lunarMonth} Âm lịch`
            : `Ngày Rằm tháng ${cell.lunar.lunarMonth} Âm lịch`,
          category: 'trai_gioi',
          categoryLabel: isFirst ? 'Ngày Sóc • Ăn Chay' : 'Ngày Vọng • Ăn Chay',
          description: isFirst
            ? 'Ngày Sóc đầu tháng Âm lịch: thích hợp thắp hương Tam Bảo, đọc Văn khấn mùng Một, tụng kinh cầu bình an.'
            : 'Ngày Rằm Vọng giữa tháng: giữ ngũ giới thanh tịnh, dùng bữa cơm chay và niệm danh hiệu Phật.',
          suggestedSutraSlug: 'bat-nha',
          image: isFirst ? '/images/buddhas/dai-the-chi-bo-tat.png' : '/images/buddhas/dai-nhat-nhu-lai.png',
        });
      }

      const dayRem = remindersByDate[cell.dateKey] || [];
      for (const r of dayRem) {
        list.push({
          id: r.id,
          solarDateKey: cell.dateKey,
          day: cell.day,
          month: cell.month,
          year: cell.year,
          weekdayLabel,
          lunarLabel,
          title: r.title,
          category: 'ca_nhan',
          categoryLabel: 'Sự Kiện Cá Nhân',
          description: r.note,
          image: '/images/buddhas/chuan-de-bo-tat.png',
        });
      }
    }
    return list;
  }, [calendarCells, remindersByDate]);

  const filteredMonthEvents = useMemo(() => {
    if (filterMode === 'all') return monthEvents;
    return monthEvents.filter((ev) => ev.category === filterMode);
  }, [monthEvents, filterMode]);

  const selectedMealPlan =
    VEGETARIAN_MEAL_PLANS[(selectedDayInfo.lunar.lunarDay + selectedDayInfo.day) % VEGETARIAN_MEAL_PLANS.length];

  const isSelectedTraiDay =
    traiRegimen === 'THAP_TRAI'
      ? selectedDayInfo.lunar.isThapTrai
      : selectedDayInfo.lunar.isLucTrai;

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#2C1E10] selection:bg-[#FFE07D]/50 selection:text-[#2C1E10]">
      <div className="max-w-5xl mx-auto px-4 pt-3 lg:pt-6 pb-28 lg:pb-16 space-y-5">
        {/* =================================================================== */}
        {/* DHARMA TOP ACTION BAR & PAGE TITLE                                  */}
        {/* =================================================================== */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#2C1E10] tracking-tight">
              Lịch và Sự kiện
            </h1>
            <p className="text-xs sm:text-sm text-[#6B533B] mt-0.5">
              Lịch âm dương và ngày lễ Phật giáo
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setReminderDate(selectedDayInfo.dateKey);
                setIsAddReminderOpen(true);
              }}
              className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#EAD7A7] flex items-center justify-center text-[#2C1E10] hover:border-[#C68B19] transition-colors cursor-pointer shadow-2xs"
              title="Thêm nhắc nhở hoặc ngày giỗ cá nhân"
              aria-label="Thêm sự kiện"
            >
              <Plus className="w-4 h-4" />
            </button>

            <div className="flex items-center p-1 rounded-full bg-[#FFFFFF] border border-[#EAD7A7] gap-1 shadow-2xs">
              <button
                type="button"
                onClick={handleGoToday}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#2C1E10] hover:bg-[#FFF9EB] transition-colors cursor-pointer"
                title="Về ngày hôm nay"
                aria-label="Về ngày hôm nay"
              >
                <CalendarIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleToggleNotification}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer',
                  isNotificationOn
                    ? 'text-[#8C5500] hover:bg-[#FFF9EB]'
                    : 'text-[#6B533B] hover:bg-[#FFF9EB]'
                )}
                title={isNotificationOn ? 'Chuông báo Trai đang bật' : 'Chuông báo Trai đang tắt'}
                aria-label="Bật/Tắt Chuông Báo Trai"
              >
                {isNotificationOn ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* MAIN RESPONSIVE GRID: CALENDAR ON LEFT + DAY DETAILS/TRAI ON RIGHT */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN (7 cols): Month Switcher + Calendar + Events List */}
          <div className="lg:col-span-7 space-y-4">
            {/* Month Switcher */}
            <div className="flex items-center justify-between px-2 py-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#6B533B] hover:bg-[#FFF9EB] hover:text-[#2C1E10] transition-colors cursor-pointer"
                aria-label="Tháng trước"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-base sm:text-lg font-bold text-[#2C1E10] tracking-tight">
                Tháng {viewMonth} - {viewYear}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#6B533B] hover:bg-[#FFF9EB] hover:text-[#2C1E10] transition-colors cursor-pointer"
                aria-label="Tháng sau"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* 7-Column Calendar Grid */}
            <div className="p-3 sm:p-4 rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] shadow-xs">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 text-center mb-2">
                {WEEKDAY_HEADERS.map((wd, idx) => (
                  <div
                    key={wd}
                    className={cn(
                      'text-xs font-bold py-1',
                      idx === 6 ? 'text-[#B91C1C]' : 'text-[#6B533B]'
                    )}
                  >
                    {wd}
                  </div>
                ))}
              </div>

              {/* Day Cells */}
              <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                {calendarCells.map((cell) => {
                  const isSelected =
                    cell.inCurrentMonth && cell.day === selectedDayInfo.day;
                  const isToday = cell.dateKey === todayKey;
                  const isTrai =
                    traiRegimen === 'THAP_TRAI'
                      ? cell.lunar.isThapTrai
                      : cell.lunar.isLucTrai;
                  const hasOrangeDot =
                    Boolean(cell.lunar.viaChuPhat) ||
                    Boolean(remindersByDate[cell.dateKey]?.length);
                  const hasGreenDot = isTrai;

                  const lunarDisplay =
                    cell.lunar.lunarDay === 1
                      ? `${cell.lunar.lunarDay}/${cell.lunar.lunarMonth}`
                      : `${cell.lunar.lunarDay}`;

                  return (
                    <button
                      key={cell.dateKey}
                      type="button"
                      onClick={() => {
                        playSoftTabBellSound(0.18);
                        if (!cell.inCurrentMonth) {
                          setViewYear(cell.year);
                          setViewMonth(cell.month);
                        }
                        setSelectedDay(cell.day);
                      }}
                      className={cn(
                        'relative h-11 sm:h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer select-none',
                        isSelected
                          ? 'bg-gradient-to-br from-[#FFE07D] via-[#F5C542] to-[#E5A91C] text-[#2C1E10] border border-[#C68B19] shadow-xs'
                          : isToday && cell.inCurrentMonth
                          ? 'bg-[#FFF6DF] border border-[#C68B19] text-[#2C1E10]'
                          : 'hover:bg-[#FFF9EB]'
                      )}
                    >
                      {/* Top-right indicator dots */}
                      {(hasOrangeDot || hasGreenDot) && (
                        <div className="absolute top-1 right-1 flex flex-col gap-[2px]">
                          {hasOrangeDot && (
                            <span
                              className={cn(
                                'w-1 h-1 rounded-full',
                                isSelected ? 'bg-[#8C5500]' : 'bg-[#D97706]'
                              )}
                            />
                          )}
                          {hasGreenDot && (
                            <span
                              className={cn(
                                'w-1 h-1 rounded-full',
                                isSelected ? 'bg-emerald-700' : 'bg-emerald-600'
                              )}
                            />
                          )}
                        </div>
                      )}

                      <span
                        className={cn(
                          'text-xs sm:text-sm font-bold leading-none whitespace-nowrap',
                          isSelected
                            ? 'text-[#2C1E10]'
                            : !cell.inCurrentMonth
                            ? cell.isSunday
                              ? 'text-[#D4A09B]'
                              : 'text-[#B8A890]'
                            : cell.isSunday
                            ? 'text-[#B91C1C]'
                            : 'text-[#2C1E10]'
                        )}
                      >
                        {String(cell.day).padStart(2, '0')}
                      </span>

                      <span
                        className={cn(
                          'text-[9px] leading-none whitespace-nowrap',
                          isSelected
                            ? 'text-[#6B4200] font-bold'
                            : !cell.inCurrentMonth
                            ? 'text-[#C8B9A2]'
                            : cell.lunar.lunarDay === 1 || cell.lunar.lunarDay === 15
                            ? 'text-[#8C5500] font-bold'
                            : 'text-[#6B533B]'
                        )}
                      >
                        {lunarDisplay}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-5 text-[11px] text-[#6B533B] pt-3">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                  <span>Ngày Vía Phật / Sự kiện</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>Ngày Ăn Chay ({traiRegimen === 'LUC_TRAI' ? 'Lục Trai' : 'Thập Trai'})</span>
                </span>
              </div>
            </div>

            {/* "Toàn bộ sự kiện trong năm >" pill */}
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={() => setIsYearEventsOpen(true)}
                className="px-6 py-3 rounded-full bg-[#FFFFFF] border border-[#DFC27D] text-xs sm:text-sm font-bold text-[#8C5500] inline-flex items-center gap-1.5 hover:bg-[#FFF9EB] transition-colors cursor-pointer shadow-2xs"
              >
                <span>Toàn bộ sự kiện trong năm</span>
                <ChevronRight className="w-4 h-4 text-[#8C5500]" />
              </button>
            </div>

            {/* Month Events Section */}
            <section className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#8C5500]">
                  Các sự kiện trong tháng {viewMonth}
                </h2>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {(
                    [
                      { key: 'all', label: 'Tất cả' },
                      { key: 'via_phat', label: 'Vía Phật' },
                      { key: 'trai_gioi', label: 'Sóc Vọng' },
                      { key: 'ca_nhan', label: 'Cá nhân' },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => {
                        playSoftTabBellSound(0.18);
                        setFilterMode(f.key);
                      }}
                      className={cn(
                        'px-3 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer shrink-0',
                        filterMode === f.key
                          ? 'bg-[#FFF6DF] text-[#8C5500]'
                          : 'bg-[#FFFFFF] text-[#6B533B] hover:text-[#2C1E10]'
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredMonthEvents.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] text-center text-xs text-[#6B533B]">
                  Chưa có sự kiện nào trong mục này tháng {viewMonth}.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredMonthEvents.map((ev) => (
                    <div
                      key={ev.id}
                      onClick={() => {
                        setSelectedDay(ev.day);
                        setSelectedEvent(ev);
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedDay(ev.day);
                          setSelectedEvent(ev);
                        }
                      }}
                      className="group flex items-center gap-3.5 p-3 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] hover:border-[#C68B19] transition-colors cursor-pointer shadow-2xs"
                    >
                      <img
                        src={ev.image}
                        alt={ev.title}
                        className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl object-cover border border-[#EAD7A7] shrink-0 bg-[#FFF9EB]"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[14px] sm:text-[15px] font-bold text-[#2C1E10] truncate group-hover:text-[#8C5500] transition-colors">
                          {ev.title}
                        </h3>
                        <p className="text-xs text-[#6B533B] mt-0.5 truncate">
                          {ev.weekdayLabel}, {String(ev.day).padStart(2, '0')}-
                          {String(ev.month).padStart(2, '0')} • {ev.lunarLabel}
                        </p>
                      </div>
                      {ev.category === 'ca_nhan' ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteReminder(ev.id);
                          }}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B533B] hover:text-red-600 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                          aria-label="Xóa sự kiện cá nhân"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#8C5500] shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* RIGHT COLUMN (5 cols): Selected Day Detail + Trai Gioi & Meal Plan */}
          <div className="lg:col-span-5 space-y-4">
            {/* Selected Date Breakdown Card */}
            <section className="rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] p-5 space-y-4 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C5500]">
                    Ngày đang chọn
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-[#2C1E10] mt-0.5">
                    {selectedDayInfo.weekdayLabel}, {String(selectedDayInfo.day).padStart(2, '0')}/
                    {String(viewMonth).padStart(2, '0')}/{viewYear}
                  </h2>
                  <p className="text-xs font-semibold text-[#6B533B] mt-0.5">
                    Âm lịch: {selectedDayInfo.lunar.lunarDay} tháng{' '}
                    {selectedDayInfo.lunar.lunarMonth}{' '}
                    {selectedDayInfo.lunar.lunarLeap ? '(Nhuận) ' : ''}
                    • Năm {selectedDayInfo.lunar.yearCanChi}
                  </p>
                </div>

                {isSelectedTraiDay && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-[11px] font-bold text-emerald-700 shrink-0 inline-flex items-center gap-1">
                    <Leaf className="w-3 h-3" />
                    Ngày Chay
                  </span>
                )}
              </div>

              {selectedDayInfo.lunar.viaChuPhat && (
                <div className="p-3 rounded-2xl bg-[#FFF6DF] border border-[#DFC27D] flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#8C5500] shrink-0" />
                  <p className="text-xs font-bold text-[#8C5500]">
                    {selectedDayInfo.lunar.viaChuPhat}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B533B]">Can Chi Ngày</p>
                  <p className="font-bold text-[#2C1E10] mt-0.5">
                    {selectedDayInfo.lunar.dayCanChi}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B533B]">Tiết Khí</p>
                  <p className="font-bold text-[#2C1E10] mt-0.5">
                    {selectedDayInfo.lunar.tietKhi}
                  </p>
                </div>
                <div className="col-span-2 p-3 rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B533B]">
                    {selectedDayInfo.lunar.isHoangDao ? 'Hoàng Đạo' : 'Hắc Đạo'} • Giờ tốt
                  </p>
                  <p className="font-bold text-[#8C5500] mt-0.5">
                    {selectedDayInfo.lunar.hoangDaoStar}
                  </p>
                  <p className="text-[11px] text-[#2C1E10] mt-1">
                    {selectedDayInfo.lunar.gioHoangDao.slice(0, 4).join(' • ')}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs pt-1 border-t border-[#EAD7A7]">
                <p className="text-[#2C1E10]">
                  <span className="text-[#8C5500] font-bold">Hướng tốt:</span>{' '}
                  {selectedDayInfo.lunar.goodDirections}
                </p>
                <p className="text-[#2C1E10]">
                  <span className="text-emerald-700 font-bold">Nên làm:</span>{' '}
                  {selectedDayInfo.lunar.recommendedActions.slice(0, 2).join('; ')}.
                </p>
              </div>
            </section>

            {/* Trai Regimen + Vegetarian Menu Card */}
            <section
              ref={mealSectionRef}
              className={cn(
                'rounded-3xl bg-[#FFFFFF] border p-5 space-y-4 transition-all shadow-xs',
                highlightMeals ? 'border-[#C68B19]' : 'border-[#EAD7A7]'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-[#2C1E10]">
                    Lịch Trai Giới & Thực Đơn Chay
                  </h2>
                  <p className="text-[11px] text-[#6B533B]">
                    Thanh lọc thân tâm bằng bữa cơm chay thanh đạm
                  </p>
                </div>
              </div>

              {/* Regimen Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7]">
                <button
                  type="button"
                  onClick={() => handleChangeTraiRegimen('LUC_TRAI')}
                  className={cn(
                    'py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer',
                    traiRegimen === 'LUC_TRAI'
                      ? 'bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#2C1E10] shadow-2xs'
                      : 'text-[#6B533B] hover:text-[#2C1E10]'
                  )}
                >
                  Lục Trai (6 ngày)
                </button>
                <button
                  type="button"
                  onClick={() => handleChangeTraiRegimen('THAP_TRAI')}
                  className={cn(
                    'py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer',
                    traiRegimen === 'THAP_TRAI'
                      ? 'bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#2C1E10] shadow-2xs'
                      : 'text-[#6B533B] hover:text-[#2C1E10]'
                  )}
                >
                  Thập Trai (10 ngày)
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7] space-y-2.5 text-xs">
                <p className="text-[#8C5500] font-semibold italic leading-relaxed">
                  {selectedMealPlan.traiMeaning}
                </p>
                <div className="space-y-1.5 pt-2 border-t border-[#EAD7A7] text-[#2C1E10]">
                  <p>
                    <span className="text-[#8C5500] font-bold">Bữa Sáng:</span>{' '}
                    {selectedMealPlan.breakfast}
                  </p>
                  <p>
                    <span className="text-[#8C5500] font-bold">Bữa Trưa:</span>{' '}
                    {selectedMealPlan.lunch}
                  </p>
                  <p>
                    <span className="text-[#8C5500] font-bold">Bữa Tối:</span>{' '}
                    {selectedMealPlan.dinner}
                  </p>
                  <p>
                    <span className="text-[#8C5500] font-bold">Trà Tĩnh Tâm:</span>{' '}
                    {selectedMealPlan.tea}
                  </p>
                </div>
                <p className="text-[11px] text-[#6B533B] pt-1">
                  💡 {selectedMealPlan.mindfulTip}
                </p>
              </div>

              <button
                type="button"
                onClick={handleRecordTraiDayVow}
                disabled={hasRecordedVowToday}
                className={cn(
                  'w-full py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer',
                  hasRecordedVowToday
                    ? 'bg-emerald-50 border border-emerald-300 text-emerald-700'
                    : 'bg-gradient-to-r from-[#FFE07D] via-[#F5C542] to-[#E5A91C] text-[#2C1E10] border border-[#C68B19] shadow-xs active:scale-[0.98]'
                )}
              >
                <Check className="w-4 h-4" />
                <span>
                  {hasRecordedVowToday
                    ? 'Đã Phát Nguyện Thọ Trai Hôm Nay'
                    : 'Phát Nguyện Giữ Trai Giới Hôm Nay'}
                </span>
              </button>
            </section>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* FULL-SCREEN PAGE: TOÀN BỘ SỰ KIỆN TRONG NĂM                           */}
      {/* ===================================================================== */}
      {isYearEventsOpen && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden">
          <header className="px-4 py-3 bg-[#FAF7F0] flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsYearEventsOpen(false)}
              aria-label="Quay lại"
              className="w-9 h-9 rounded-full bg-[#EFECE5] hover:bg-[#E7E1D5] inline-flex items-center justify-center text-[#2C1E10] cursor-pointer shrink-0 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-[#2C1E10] truncate">
                Toàn Bộ Ngày Lễ &amp; Vía Phật Trong Năm
              </h2>
              <p className="text-[11px] text-[#6B533B]">Theo Ấn Lịch Âm Truyền Thống</p>
            </div>
            <div className="w-20" />
          </header>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-3xl mx-auto w-full space-y-2.5">
            {YEAR_ROUND_FESTIVALS.map((f, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setViewMonth(f.solarHintMonth);
                  setIsYearEventsOpen(false);
                }}
                className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] hover:border-[#C68B19] transition-colors cursor-pointer flex items-start justify-between gap-3 shadow-xs"
              >
                <div>
                  <span className="text-xs font-bold text-[#8C5500]">
                    {f.day} • {f.month} Âm lịch
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-[#2C1E10] mt-0.5">{f.title}</h3>
                  <p className="text-xs text-[#6B533B] mt-0.5">{f.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8C5500] shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* FULL-SCREEN PAGE: THÊM SỰ KIỆN CÁ NHÂN                                */}
      {/* ===================================================================== */}
      {isAddReminderOpen && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden">
          <header className="px-4 py-3 bg-[#FAF7F0] flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsAddReminderOpen(false)}
              aria-label="Quay lại"
              className="w-9 h-9 rounded-full bg-[#EFECE5] hover:bg-[#E7E1D5] inline-flex items-center justify-center text-[#2C1E10] cursor-pointer shrink-0 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-sm sm:text-base font-bold text-[#2C1E10] truncate">
              Thêm Sự Kiện &amp; Nhắc Nhở Tu Tập
            </h2>
            <div className="w-20" />
          </header>

          <form
            onSubmit={handleAddReminder}
            className="flex-1 overflow-y-auto p-5 max-w-xl mx-auto w-full space-y-4"
          >
            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] space-y-4 text-xs sm:text-sm shadow-xs">
              <div>
                <label className="block font-bold text-[#6B533B] mb-1">Ngày Dương lịch</label>
                <input
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-[#2C1E10]"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-[#6B533B] mb-1">Loại nhắc nhở</label>
                <select
                  value={reminderType}
                  onChange={(e) => setReminderType(e.target.value as PersonalReminder['type'])}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-[#2C1E10]"
                >
                  <option value="trai_gioi">Ăn chay / Thọ giới</option>
                  <option value="gio">Ngày Giỗ gia tiên</option>
                  <option value="cau_an">Lễ Cầu An / Phóng sinh</option>
                  <option value="quan_trong">Sự kiện Phật sự quan trọng</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#6B533B] mb-1">Tiêu đề sự kiện</label>
                <input
                  type="text"
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  placeholder="Ví dụ: Đi chùa lễ Rằm tháng 10..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-[#2C1E10] placeholder:text-[#8E7A63]"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-[#6B533B] mb-1">Ghi chú phát nguyện</label>
                <textarea
                  rows={3}
                  value={reminderNote}
                  onChange={(e) => setReminderNote(e.target.value)}
                  placeholder="Lời dặn dò hoặc tâm nguyện..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-[#2C1E10] placeholder:text-[#8E7A63]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#8C5500] text-white font-bold text-sm hover:bg-[#6E4200] transition-colors cursor-pointer shadow-sm"
            >
              Lưu Vào Ấn Lịch
            </button>
          </form>
        </div>
      )}

      {/* ===================================================================== */}
      {/* FULL-SCREEN PAGE: CHI TIẾT NGÀY LỄ                                    */}
      {/* ===================================================================== */}
      {selectedEvent && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden">
          <header className="px-4 py-3 bg-[#FAF7F0] flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              aria-label="Quay lại"
              className="w-9 h-9 rounded-full bg-[#EFECE5] hover:bg-[#E7E1D5] inline-flex items-center justify-center text-[#2C1E10] cursor-pointer shrink-0 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-sm sm:text-base font-bold text-[#2C1E10] truncate">
              Chi Tiết Sự Kiện Phật Giáo
            </h2>
            <div className="w-20" />
          </header>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-2xl mx-auto w-full space-y-5">
            <div className="rounded-3xl overflow-hidden border border-[#DFC27D] bg-[#FFFFFF] shadow-xs">
              <div className="h-56 bg-[#FFF9EB] overflow-hidden">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-[#FFF9EB] border border-[#DFC27D] text-xs font-bold text-[#8C5500]">
                  {selectedEvent.categoryLabel}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#2C1E10]">
                  {selectedEvent.title}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#6B533B]">
                  {selectedEvent.weekdayLabel}, {String(selectedEvent.day).padStart(2, '0')}-
                  {String(selectedEvent.month).padStart(2, '0')}-{selectedEvent.year} •{' '}
                  {selectedEvent.lunarLabel}
                </p>
                <p className="text-sm sm:text-base text-[#2C1E10] leading-relaxed">
                  {selectedEvent.description}
                </p>

                <div className="pt-3 flex flex-wrap gap-2.5">
                  {selectedEvent.suggestedSutraSlug && (
                    <Link
                      href={`/thu-vien?kinh=${selectedEvent.suggestedSutraSlug}`}
                      className="flex-1 py-3 px-4 rounded-2xl bg-[#8C5500] text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 hover:bg-[#6E4200]"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Mở kinh tụng tự cuộn tương ứng</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(null)}
                    aria-label="Quay lại"
                    className="w-10 h-10 rounded-full bg-[#EFECE5] hover:bg-[#E7E1D5] inline-flex items-center justify-center text-[#2C1E10] cursor-pointer shrink-0 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING TOAST */}
      <CenterToast message={toastMessage} icon="sparkles" />
    </div>
  );
}

export default function BuddhistCalendarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center text-sm font-bold text-[#8C5500]">
          Đang tính Lịch Âm Dương & Ngày Lễ Phật Giáo...
        </div>
      }
    >
      <BuddhistCalendarInner />
    </Suspense>
  );
}
