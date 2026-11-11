'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  X,
  Check,
  Clock,
} from 'lucide-react';
import {
  DharmaWheelIcon,
  AlmsBowlIcon,
  LotusMinimalIcon,
  TempleBellIcon,
  PagodaMinimalIcon,
  BodhiLeafIcon,
} from '@/components/icons/DharmaMinimalIcons';
import { getLunarDate, BUDDHIST_LUNAR_EVENTS } from '@/lib/lunar-calendar';
import { playBellSound, playWoodenFishSound, playPageTurnSound } from '@/lib/buddhistSounds';
import { OmManiDesktopCalendar } from '@/components/om-mani/desktop/OmManiDesktopCalendar';
import { recordDharmaMerit } from '@/components/om-mani/OmManiInteractiveTools';
import { cn } from '@/lib/utils';

// =============================================================================
// INTERFACES & TYPES
// =============================================================================
export type CalendarFilterMode = 'all' | 'trai_gioi' | 'via_phat';

export interface VegetarianMealPlan {
  traiMeaning: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  tea: string;
}

export interface BuddhistEventItem {
  id: string;
  solarDate: string;
  dayOfWeek: string;
  lunarDate: string;
  title: string;
  fullTitle: string;
  image: string;
  category: string;
  meaning: string;
  practiceAdvice: string;
}

export interface PersonalReminder {
  id: string;
  title: string;
  note: string;
  solarDate: string;
  lunarDateStr?: string;
  type: 'gio' | 'quan_trong' | 'trai_gioi' | 'cau_an';
  createdAt: string;
}

const REMINDER_STORAGE_KEY = 'phatphap_personal_reminders_v2';
const TRAI_VOW_STORAGE_KEY = 'phatphap_dharma_trai_vow_2026_11_08';

const WEEKDAYS = [
  { label: 'Hai', isSunday: false },
  { label: 'Ba', isSunday: false },
  { label: 'Tư', isSunday: false },
  { label: 'Năm', isSunday: false },
  { label: 'Sáu', isSunday: false },
  { label: 'Bảy', isSunday: false },
  { label: 'CN', isSunday: true },
];

// Curated Vegetarian Meal Plans & Trai Meanings by Lunar Day
const VEGETARIAN_MEAL_PLANS: VegetarianMealPlan[] = [
  {
    traiMeaning:
      'Ngày Thập Trai thanh tịnh: Giữ thân khẩu ý trong sạch, dùng thực phẩm thuần thực vật giúp nuôi dưỡng tâm từ bi bình đẳng với muôn loài chúng sinh.',
    breakfast: 'Bún riêu chay thanh đạm & sữa hạt sen',
    lunch: 'Cơm gạo lứt, đậu hũ kho nấm đông cô & canh rong biển',
    dinner: 'Cháo yến mạch hạt óc chó & rau củ hấp',
    tea: 'Trà tâm sen & kỷ tử ấm tỳ vị',
  },
  {
    traiMeaning:
      'Ngày Sóc / Vọng (Mùng 1 & Rằm): Năng lượng đất trời giao hòa. Thọ trì trai giới giúp làm nhẹ nghiệp lực, tăng trưởng phước báu và trí tuệ sáng suốt.',
    breakfast: 'Phở nấm hương rau củ & trà gừng ấm',
    lunch: 'Cơm trắng, nấm đùi gà kho tiêu xanh & canh bí đỏ đậu phộng',
    dinner: 'Súp bí đỏ hạt điều & salad rau mầm',
    tea: 'Trà hoa cúc vàng & táo đỏ',
  },
  {
    traiMeaning:
      'Ngày Chánh Niệm Thường Nhật: Thực hành Ngũ Quán Tưởng trước mỗi bữa ăn — trân quý công sức người gieo trồng và ăn trong chánh niệm biết đủ.',
    breakfast: 'Bánh cuốn chay nhân nấm mộc nhĩ & sữa đậu nành',
    lunch: 'Cơm độn hạt sen, mít non kho tộ & canh rau ngót chay',
    dinner: 'Miến trộn rau củ thập cẩm thanh nhẹ',
    tea: 'Trà ô long quế hoa thanh tâm',
  },
];

// Authentic Buddhist events in November 2026
const NOVEMBER_2026_EVENTS: BuddhistEventItem[] = [
  {
    id: 'via-duoc-su',
    solarDate: '08-11',
    dayOfWeek: 'Chủ nhật',
    lunarDate: '30-09',
    title: 'Vía Đức Phật Dược Sư Lưu Ly Quang',
    fullTitle: 'Vía Đức Phật Dược Sư Lưu Ly Quang Vương Như Lai Thành Đạo',
    image: '/images/golden_buddha_altar.jpg',
    category: 'Vía Phật & Đại Nguyện',
    meaning:
      'Đức Phật Dược Sư là giáo chủ cõi Tịnh Lưu Ly ở phương Đông. Ngài phát 12 đại nguyện cứu độ chúng sinh khỏi khổ đau bệnh tật, vô minh, ban phát ánh sáng thanh tịnh lưu ly cho thân tâm an lạc.',
    practiceAdvice:
      'Phật tử nên phát tâm ăn chay thanh tịnh, thắp đèn Dược Sư, trì tụng Kinh Dược Sư Bổn Nguyện Công Đức và niệm danh hiệu “Nam Mô Dược Sư Lưu Ly Quang Vương Phật” hồi hướng bình an cho gia đạo.',
  },
  {
    id: 'mung-1-thang-10',
    solarDate: '09-11',
    dayOfWeek: 'Thứ 2',
    lunarDate: '01-10',
    title: 'Ngày Sóc • Mùng 1 Tháng 10 Âm Lịch',
    fullTitle: 'Ngày Sóc — Mùng 1 Tháng 10 Âm Lịch (Ngày Trai Giới Đầu Tháng)',
    image: '/images/buddha_meditation.jpg',
    category: 'Ngày Sóc • Trai Giới',
    meaning:
      'Ngày đầu tháng âm lịch (ngày Sóc), theo truyền thống thiền môn là ngày hội tụ linh khí thanh tịnh, thích hợp để sám hối ba nghiệp, phát khởi thiện tâm và hướng về Tam Bảo.',
    practiceAdvice:
      'Ăn chay thanh tịnh, dâng hương lễ Phật, đọc tụng kinh sám hối, phóng sinh hộ vật và thực tập ái ngữ hòa ái với mọi người.',
  },
  {
    id: 'via-dat-ma',
    solarDate: '13-11',
    dayOfWeek: 'Thứ 6',
    lunarDate: '05-10',
    title: 'Khánh Tuế Tổ Sư Bồ Đề Đạt Ma',
    fullTitle: 'Vía Sơ Tổ Thiền Tông Bồ Đề Đạt Ma',
    image: '/images/tran_nhan_tong_yentu.jpg',
    category: 'Lễ Tổ Thiền Tông',
    meaning:
      'Tổ sư Bồ Đề Đạt Ma là vị Tổ thứ 28 của Thiền tông Ấn Độ và là Sơ tổ của Thiền tông Đông Độ. Ngài truyền trao pháp môn “Trực chỉ nhân tâm, kiến tính thành Phật”.',
    practiceAdvice:
      'Dành ít nhất 15 phút tọa thiền quán chiếu hơi thở, giữ tâm rỗng rang lặng lẽ trước mọi biến động của ngoại cảnh.',
  },
  {
    id: 'tet-thuong-tan',
    solarDate: '18-11',
    dayOfWeek: 'Thứ 4',
    lunarDate: '10-10',
    title: 'Lễ Thường Tân • Dâng Cơm Mới Tam Bảo',
    fullTitle: 'Tết Thường Tân (Lễ Cúng Cơm Mới Tháng Mười)',
    image: '/images/lotus_blooming.jpg',
    category: 'Truyền Thống Tri Ân',
    meaning:
      'Ngày mùng 10 tháng 10 âm lịch là dịp người con Phật dâng phẩm vật hạt gạo mới, hoa trái thanh khiết cúng dường Tam Bảo và cửu huyền thất tổ để tri ân đất trời mưa thuận gió hòa.',
    practiceAdvice:
      'Dâng cơm chay thanh tịnh cúng Phật và gia tiên, đồng thời san sẻ thực phẩm thiện nguyện cho người cơ nhỡ.',
  },
  {
    id: 'le-ha-nguyen',
    solarDate: '23-11',
    dayOfWeek: 'Thứ 2',
    lunarDate: '15-10',
    title: 'Đại Lễ Hạ Nguyên • Rằm Tháng Mười',
    fullTitle: 'Đại Lễ Hạ Nguyên (Rằm Tháng Mười Âm Lịch & Ngày Vọng Trai Giới)',
    image: '/images/chua_bai_dinh.jpg',
    category: 'Tam Nguyên Cát Khánh',
    meaning:
      'Lễ Hạ Nguyên (Rằm tháng 10) là một trong Tam Nguyên lớn nhất trong năm (Thượng Nguyên, Trung Nguyên, Hạ Nguyên). Đây là ngày chư thiên giám sát thiện ác và là dịp tạ ơn Tam Bảo, cầu siêu độ tổ tiên.',
    practiceAdvice:
      'Giữ trọn vẹn Ngũ Giới và ăn chay thanh tịnh, thắp đèn hoa đăng cầu nguyện quốc thái dân an, gia đạo cát tường.',
  },
];

// Year-round major Buddhist festivals across 12 lunar months
const YEAR_ROUND_FESTIVALS = [
  { month: 'Tháng Giêng', day: 'Mùng 1', title: 'Vía Đức Phật Di Lặc & Xuân Di Lặc', desc: 'Đón xuân chánh niệm, thực hành hỷ xả và nụ cười từ bi' },
  { month: 'Tháng Giêng', day: 'Mùng 8', title: 'Đàn Tràng Dược Sư Thất Châu Cầu An', desc: 'Khai kinh Dược Sư đầu năm cầu quốc thái dân an' },
  { month: 'Tháng Giêng', day: 'Rằm (15)', title: 'Đại Lễ Thượng Nguyên (Rằm Tháng Giêng)', desc: 'Lễ Phật quanh năm không bằng Rằm tháng Giêng' },
  { month: 'Tháng 2', day: 'Mùng 8', title: 'Kỷ Niệm Thái Tử Tất Đạt Đa Xuất Gia', desc: 'Bước chân vượt thành tầm đạo giải thoát cho muôn loài' },
  { month: 'Tháng 2', day: 'Rằm (15)', title: 'Đại Lễ Phật Thích Ca Nhập Niết Bàn', desc: 'Tưởng niệm lời di huấn tối hậu: Hãy tự mình thắp đuốc lên mà đi' },
  { month: 'Tháng 2', day: '19', title: 'Vía Bồ Tát Quán Thế Âm Đản Sinh', desc: 'Đảnh lễ hạnh nguyện lắng nghe sâu để xoa dịu khổ đau' },
  { month: 'Tháng 2', day: '21', title: 'Vía Bồ Tát Phổ Hiền Đại Hạnh', desc: 'Thực hành Mười Đại Nguyện Vương của Bồ Tát Phổ Hiền' },
  { month: 'Tháng 4', day: 'Mùng 4', title: 'Vía Bồ Tát Văn Thù Sư Lợi Đại Trí', desc: 'Thắp sáng gươm báu trí tuệ Bát Nhã đoạn trừ vô minh' },
  { month: 'Tháng 4', day: 'Rằm (15)', title: 'Đại Lễ Phật Đản Vesak Tam Hợp', desc: 'Kỷ niệm Đản Sinh, Thành Đạo và Nhập Niết Bàn của Đức Thế Tôn' },
  { month: 'Tháng 6', day: '19', title: 'Vía Bồ Tát Quán Thế Âm Thành Đạo', desc: 'Hạnh nguyện đại từ đại bi cứu khổ cứu nạn viên mãn' },
  { month: 'Tháng 7', day: '13', title: 'Vía Bồ Tát Đại Thế Chí', desc: 'Dùng ánh sáng trí tuệ nhiếp niệm thanh tịnh sáu căn' },
  { month: 'Tháng 7', day: 'Rằm (15)', title: 'Đại Lễ Vu Lan Báo Hiếu & Tự Tứ Tăng', desc: 'Mùa hiếu hạnh tri ân Tứ Trọng Ân và cứu độ cửu huyền thất tổ' },
  { month: 'Tháng 7', day: '30', title: 'Vía Bồ Tát Địa Tạng Vương', desc: 'Địa ngục vị không, thệ bất thành Phật; chúng sinh độ tận, phương chứng Bồ Đề' },
  { month: 'Tháng 9', day: '19', title: 'Vía Bồ Tát Quán Thế Âm Xuất Gia', desc: 'Phát tâm Bồ Đề rộng lớn vì lợi ích an lạc của chúng sinh' },
  { month: 'Tháng 9', day: '30', title: 'Vía Đức Phật Dược Sư Lưu Ly Quang', desc: 'Mười hai đại nguyện trị lành tâm bệnh và thân bệnh' },
  { month: 'Tháng 10', day: 'Mùng 5', title: 'Vía Sơ Tổ Bồ Đề Đạt Ma', desc: 'Khơi nguồn dòng thiền Trực chỉ nhân tâm, kiến tính thành Phật' },
  { month: 'Tháng 10', day: 'Rằm (15)', title: 'Đại Lễ Hạ Nguyên (Rằm Tháng Mười)', desc: 'Tam Nguyên cát khánh, tạ ơn Tam Bảo và hồi hướng công đức' },
  { month: 'Tháng 11', day: 'Mùng 1', title: 'Đại Lễ Tưởng Niệm Phật Hoàng Trần Nhân Tông', desc: 'Sơ tổ Thiền phái Trúc Lâm Yên Tử nhập Niết Bàn tại am Ngọa Vân' },
  { month: 'Tháng 11', day: '17', title: 'Khánh Đản Đức Phật A Di Đà', desc: 'Giáo chủ cõi Tây Phương Cực Lạc với 48 đại nguyện tiếp dẫn' },
  { month: 'Tháng Chạp', day: 'Mùng 8', title: 'Đại Lễ Đức Phật Thích Ca Thành Đạo', desc: 'Dưới cội Bồ Đề khi sao Mai vừa mọc, Đức Phật chứng quả Chánh Đẳng Giác' },
];

export default function BuddhistCalendarPage() {
  const [viewYear, setViewYear] = useState<number>(2026);
  const [viewMonth, setViewMonth] = useState<number>(11);
  const [selectedDay, setSelectedDay] = useState<number>(8);
  const [filterMode, setFilterMode] = useState<CalendarFilterMode>('all');
  const [hasRecordedVowToday, setHasRecordedVowToday] = useState<boolean>(false);

  // Modals state
  const [isYearEventsOpen, setIsYearEventsOpen] = useState(false);
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<BuddhistEventItem | null>(null);
  const [isNotificationOn, setIsNotificationOn] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for new reminder
  const [reminders, setReminders] = useState<PersonalReminder[]>([]);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderNote, setReminderNote] = useState('');
  const [reminderType, setReminderType] = useState<'gio' | 'quan_trong' | 'trai_gioi' | 'cau_an'>('trai_gioi');
  const [reminderDate, setReminderDate] = useState('2026-11-08');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMINDER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setReminders(parsed);
      }
      const vowSaved = localStorage.getItem(TRAI_VOW_STORAGE_KEY);
      if (vowSaved === 'true') {
        setHasRecordedVowToday(true);
      }
    } catch {}
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleRecordTraiDayVow = () => {
    playBellSound(0.5);
    setHasRecordedVowToday(true);
    try {
      localStorage.setItem(TRAI_VOW_STORAGE_KEY, 'true');
    } catch {}
    recordDharmaMerit({
      type: 'precept',
      title: 'Phát Nguyện Thọ Trì Trai Giới (Ăn Chay Thanh Tịnh)',
      detail: 'Giữ tâm từ bi, ăn chay thanh tịnh ngày 30/09 Âm lịch (Vía Đức Phật Dược Sư)',
      meritPoints: 25,
    });
    showToast('Đã ghi nhận công đức Thọ Trai Hôm Nay vào Sổ Công Đức Dharma!');
  };

  const handleToggleNotification = () => {
    playBellSound(0.4);
    setIsNotificationOn((prev) => {
      const next = !prev;
      showToast(
        next
          ? 'Đã bật Chuông Báo Trai (nhắc lịch ăn chay & ngày Vía Phật)'
          : 'Đã tạm tắt Chuông Báo Trai'
      );
      return next;
    });
  };

  const handleGoToday = () => {
    playPageTurnSound(0.3);
    setViewYear(2026);
    setViewMonth(11);
    setSelectedDay(8);
    showToast('Đã trở về hôm nay: Chủ Nhật, 08/11/2026 (30/09 Âm lịch)');
  };

  const handlePrevMonth = () => {
    playPageTurnSound(0.25);
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    playPageTurnSound(0.25);
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
    setSelectedDay(1);
  };

  const handleSaveReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle.trim()) return;

    const [y, m, d] = reminderDate.split('-').map(Number);
    const lunar = getLunarDate(y || viewYear, m || viewMonth, d || selectedDay);

    const newItem: PersonalReminder = {
      id: `rem-${Date.now()}`,
      title: reminderTitle.trim(),
      note: reminderNote.trim(),
      solarDate: reminderDate,
      lunarDateStr: `${lunar.lunarDay}/${lunar.lunarMonth}`,
      type: reminderType,
      createdAt: new Date().toISOString(),
    };

    const next = [newItem, ...reminders];
    setReminders(next);
    try {
      localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(next));
    } catch {}

    playWoodenFishSound(0.5);
    showToast(`Đã lưu lịch nhắc: ${newItem.title}`);
    setReminderTitle('');
    setReminderNote('');
    setIsAddReminderOpen(false);
  };

  const calendarCells = useMemo(() => {
    const firstDayDate = new Date(viewYear, viewMonth - 1, 1);
    const totalDaysInMonth = new Date(viewYear, viewMonth, 0).getDate();
    const prevMonthTotalDays = new Date(viewYear, viewMonth - 1, 0).getDate();
    const startWeekdayOffset = (firstDayDate.getDay() + 6) % 7;

    const cells: {
      solarDay: number;
      isCurrentMonth: boolean;
      solarMonth: number;
      solarYear: number;
      isSunday: boolean;
      lunarDay: number;
      lunarMonth: number;
      lunarDisplay: string;
      hasGreenDot: boolean;
      hasAmberDot: boolean;
      isToday: boolean;
      isSelected: boolean;
    }[] = [];

    for (let i = startWeekdayOffset - 1; i >= 0; i--) {
      const prevSolarDay = prevMonthTotalDays - i;
      const prevMonth = viewMonth === 1 ? 12 : viewMonth - 1;
      const prevYear = viewMonth === 1 ? viewYear - 1 : viewYear;
      const lunar = getLunarDate(prevYear, prevMonth, prevSolarDay);
      const isSun = cells.length % 7 === 6;

      cells.push({
        solarDay: prevSolarDay,
        isCurrentMonth: false,
        solarMonth: prevMonth,
        solarYear: prevYear,
        isSunday: isSun,
        lunarDay: lunar.lunarDay,
        lunarMonth: lunar.lunarMonth,
        lunarDisplay: `${lunar.lunarDay}`,
        hasGreenDot: prevSolarDay === 26 || prevSolarDay === 28,
        hasAmberDot: prevSolarDay === 28,
        isToday: false,
        isSelected: false,
      });
    }

    for (let d = 1; d <= totalDaysInMonth; d++) {
      const lunar = getLunarDate(viewYear, viewMonth, d);
      const isSun = cells.length % 7 === 6;
      const isSelected = selectedDay === d;

      let hasGreen = false;
      let hasAmber = false;

      if (
        [2, 3, 7, 8, 9, 11, 16, 21, 22, 23, 28, 29].includes(d) ||
        lunar.isTraiDay ||
        [1, 8, 14, 15, 18, 23, 24, 28, 29, 30].includes(lunar.lunarDay)
      ) {
        hasGreen = true;
      }

      if ([8, 9, 13, 18, 23].includes(d)) {
        hasAmber = true;
      }

      let lunarDisplay = `${lunar.lunarDay}`;
      if (lunar.lunarDay === 1) {
        lunarDisplay = `1/${lunar.lunarMonth}`;
      }

      cells.push({
        solarDay: d,
        isCurrentMonth: true,
        solarMonth: viewMonth,
        solarYear: viewYear,
        isSunday: isSun,
        lunarDay: lunar.lunarDay,
        lunarMonth: lunar.lunarMonth,
        lunarDisplay,
        hasGreenDot: hasGreen,
        hasAmberDot: hasAmber,
        isToday: d === 8 && viewMonth === 11 && viewYear === 2026,
        isSelected,
      });
    }

    const remaining = 42 - cells.length;
    for (let nextDay = 1; nextDay <= remaining; nextDay++) {
      const nextMonth = viewMonth === 12 ? 1 : viewMonth + 1;
      const nextYear = viewMonth === 12 ? viewYear + 1 : viewYear;
      const lunar = getLunarDate(nextYear, nextMonth, nextDay);
      const isSun = cells.length % 7 === 6;

      cells.push({
        solarDay: nextDay,
        isCurrentMonth: false,
        solarMonth: nextMonth,
        solarYear: nextYear,
        isSunday: isSun,
        lunarDay: lunar.lunarDay,
        lunarMonth: lunar.lunarMonth,
        lunarDisplay: `${lunar.lunarDay}`,
        hasGreenDot: nextDay === 3,
        hasAmberDot: false,
        isToday: false,
        isSelected: false,
      });
    }

    return cells;
  }, [viewYear, viewMonth, selectedDay]);

  const currentMonthEvents = useMemo(() => {
    if (viewYear === 2026 && viewMonth === 11) {
      return NOVEMBER_2026_EVENTS;
    }

    const events: BuddhistEventItem[] = [];
    const totalDays = new Date(viewYear, viewMonth, 0).getDate();

    for (let d = 1; d <= totalDays; d++) {
      const lunar = getLunarDate(viewYear, viewMonth, d);
      const key = `${lunar.lunarMonth}-${lunar.lunarDay}`;
      const title = BUDDHIST_LUNAR_EVENTS[key];

      if (title || lunar.isMainTraiDay) {
        const dateObj = new Date(viewYear, viewMonth - 1, d);
        const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        const dayOfWeek = dayNames[dateObj.getDay()];

        const evTitle =
          title ||
          (lunar.lunarDay === 1
            ? `Ngày Sóc • Mùng 1 tháng ${lunar.lunarMonth} Âm lịch`
            : `Ngày Vọng • Rằm tháng ${lunar.lunarMonth} Âm lịch`);

        events.push({
          id: `dyn-${viewYear}-${viewMonth}-${d}`,
          solarDate: `${String(d).padStart(2, '0')}-${String(viewMonth).padStart(2, '0')}`,
          dayOfWeek,
          lunarDate: `${String(lunar.lunarDay).padStart(2, '0')}-${String(lunar.lunarMonth).padStart(2, '0')}`,
          title: evTitle,
          fullTitle: evTitle,
          image: lunar.lunarDay === 15 ? '/images/golden_buddha.jpg' : '/images/buddha_temple.jpg',
          category: lunar.isMainTraiDay ? 'Ngày Trai Giới' : 'Lễ Phật Giáo',
          meaning: `Ngày cát tường thanh tịnh trong tháng ${lunar.lunarMonth} Âm lịch (${lunar.dayCanChi}).`,
          practiceAdvice: 'Giữ tâm chánh niệm, phát tâm ăn chay, trì giới và tụng kinh niệm Phật.',
        });
      }
    }

    return events;
  }, [viewYear, viewMonth]);

  const selectedDateLunarInfo = useMemo(() => {
    return getLunarDate(viewYear, viewMonth, selectedDay);
  }, [viewYear, viewMonth, selectedDay]);

  const selectedMealPlan = useMemo(() => {
    if (selectedDateLunarInfo.lunarDay === 1 || selectedDateLunarInfo.lunarDay === 15) {
      return VEGETARIAN_MEAL_PLANS[1];
    }
    if (selectedDay % 2 === 0) {
      return VEGETARIAN_MEAL_PLANS[0];
    }
    return VEGETARIAN_MEAL_PLANS[2];
  }, [selectedDay, selectedDateLunarInfo]);

  return (
    <div className="min-h-screen bg-white text-[#2E1E0F] selection:bg-[#F5C542]/30 selection:text-[#8C5500]">
      {/* ========================================================================= */}
      {/* MOBILE VIEW (< lg) - DHARMA REACT NATIVE SUPER-APP CALENDAR               */}
      {/* ========================================================================= */}
      <div className="block lg:hidden">
        <div className="max-w-md sm:max-w-lg mx-auto px-3.5 sm:px-4 pt-3 pb-32 space-y-4">
          {/* 1. SAFE-AREA HEADER — Single-Line Guaranteed */}
          <header className="flex items-center justify-between gap-2 pt-2">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-2xl p-[1.5px] bg-gradient-to-tr from-[#E5A91C] via-[#FFD966] to-[#F5C542] shadow-[0_0_16px_rgba(245,197,66,0.3)] flex items-center justify-center shrink-0">
                <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center">
                  <DharmaWheelIcon className="w-5 h-5 text-[#8C5500]" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9.5px] font-bold uppercase tracking-normal text-[#8C5500] block whitespace-nowrap">
                  DHARMA • LỊCH VẠN NIÊN
                </span>
                <h1 className="font-heading font-serif text-base sm:text-xl font-bold text-[#2E1E0F] leading-tight whitespace-nowrap">
                  Lịch &amp; Trai Giới
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleGoToday}
                className="px-2.5 py-2 rounded-xl bg-white border border-[#EEDBBA] text-[#8C5500] text-[11px] font-bold active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                Hôm nay
              </button>
              <button
                type="button"
                onClick={handleToggleNotification}
                className={cn(
                  'w-8 h-8 rounded-xl border flex items-center justify-center active:scale-95 transition-all cursor-pointer shrink-0',
                  isNotificationOn
                    ? 'bg-[#FFF4D0] border-[#E5C158] text-[#8C5500]'
                    : 'bg-white border-white/10 text-[#7D6442]'
                )}
                aria-label="Chuông báo trai"
              >
                <TempleBellIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsAddReminderOpen(true)}
                className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FFE79A] to-[#FAD02C] text-[#3D2505] flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
                aria-label="Thêm lịch nhắc"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </header>

          {/* 2. TODAY TRAI GIỚI VOW BANNER */}
          <section className="p-3 rounded-2xl bg-gradient-to-r from-[#FFFDF2] via-[#FFF9E6] to-[#FFFDF2] border border-[#EEDBBA] flex items-center justify-between gap-2 shadow-md">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-xl bg-[#FFF4D0] border border-[#EEDBBA] flex items-center justify-center text-[#8C5500] shrink-0">
                <AlmsBowlIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9.5px] font-bold uppercase tracking-normal text-[#8C5500] block whitespace-nowrap">
                  30/09 Âm Lịch • Ngày Thập Trai
                </span>
                <p className="text-[11px] font-medium text-[#2E1E0F] whitespace-nowrap mt-0.5">
                  Vía Đức Phật Dược Sư Lưu Ly Quang
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRecordTraiDayVow}
              className={cn(
                'px-2.5 py-2 rounded-xl text-[11px] font-bold shrink-0 flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap',
                hasRecordedVowToday
                  ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-300'
                  : 'bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] shadow-sm'
              )}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{hasRecordedVowToday ? 'Đã Thọ Trai' : 'Thọ Trai'}</span>
            </button>
          </section>

          {/* 3. REACT NATIVE 3-MODE SEGMENTED CONTROL */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-white border border-[#EEDBBA]">
            {[
              { id: 'all', label: 'Tất Cả' },
              { id: 'trai_gioi', label: 'Lịch Ăn Chay' },
              { id: 'via_phat', label: 'Vía Phật' },
            ].map((tab) => {
              const active = filterMode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    playWoodenFishSound(0.2);
                    setFilterMode(tab.id as CalendarFilterMode);
                  }}
                  className={cn(
                    'py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
                    active
                      ? 'bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] shadow-sm'
                      : 'text-[#6A5234] hover:text-[#2E1E0F]'
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* 4. CALENDAR CARD — CRISP 1:1 SQUARE CELLS */}
          <section className="p-3.5 rounded-3xl bg-white border border-[#EEDBBA] shadow-xl space-y-2.5 select-none">
            {/* Month Navigator */}
            <div className="flex items-center justify-between pb-2 border-b border-[#F2E5C7]">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl bg-white border border-[#EEDBBA] text-[#8C5500] active:scale-90 transition-transform cursor-pointer"
                aria-label="Tháng trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h2 className="font-heading font-serif font-bold text-base text-[#8C5500] tracking-wide whitespace-nowrap">
                Tháng {viewMonth} • {viewYear}
              </h2>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl bg-white border border-[#EEDBBA] text-[#8C5500] active:scale-90 transition-transform cursor-pointer"
                aria-label="Tháng sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS.map((w) => (
                <div
                  key={w.label}
                  className={cn(
                    'text-[10px] font-bold uppercase py-0.5',
                    w.isSunday ? 'text-[#8C5500]' : 'text-[#7D6442]'
                  )}
                >
                  {w.label}
                </div>
              ))}
            </div>

            {/* Grid 7x6 — Strictly Square aspect-square Cells */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {calendarCells.map((cell, idx) => {
                const isDimmed =
                  cell.isCurrentMonth &&
                  ((filterMode === 'trai_gioi' && !cell.hasGreenDot) ||
                    (filterMode === 'via_phat' && !cell.hasAmberDot));

                return (
                  <button
                    key={`mcell-${idx}-${cell.solarDay}`}
                    type="button"
                    onClick={() => {
                      playWoodenFishSound(0.25);
                      if (cell.isCurrentMonth) {
                        setSelectedDay(cell.solarDay);
                      } else {
                        setViewMonth(cell.solarMonth);
                        setViewYear(cell.solarYear);
                        setSelectedDay(cell.solarDay);
                      }
                    }}
                    className={cn(
                      'aspect-square w-full flex flex-col items-center justify-center rounded-xl transition-all duration-150 cursor-pointer relative border p-0.5',
                      cell.isSelected
                        ? 'bg-gradient-to-b from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] border-[#FFF3B0] shadow-[0_3px_12px_rgba(245,197,66,0.35)]'
                        : cell.isCurrentMonth
                        ? isDimmed
                          ? 'bg-white/40 border-transparent opacity-35'
                          : 'bg-white border-[#F2E5C7] hover:border-[#ECD9A8]'
                        : 'bg-transparent border-transparent opacity-35'
                    )}
                  >
                    {/* Top-right indicator dots */}
                    {(cell.hasGreenDot || cell.hasAmberDot) && (
                      <div className="absolute top-1 right-1 flex items-center gap-0.5">
                        {cell.hasGreenDot && (
                          <span
                            className={cn(
                              'w-1 h-1 rounded-full',
                              cell.isSelected ? 'bg-white' : 'bg-emerald-400'
                            )}
                          />
                        )}
                        {cell.hasAmberDot && (
                          <span
                            className={cn(
                              'w-1 h-1 rounded-full',
                              cell.isSelected ? 'bg-white' : 'bg-[#FFD966]'
                            )}
                          />
                        )}
                      </div>
                    )}

                    <span
                      className={cn(
                        'text-xs font-bold font-mono leading-none',
                        cell.isSelected
                          ? 'text-[#3D2505] font-black'
                          : cell.isSunday
                          ? 'text-[#8C5500]'
                          : 'text-[#2E1E0F]'
                      )}
                    >
                      {String(cell.solarDay).padStart(2, '0')}
                    </span>

                    <span
                      className={cn(
                        'text-[8.5px] font-mono leading-none mt-1',
                        cell.isSelected
                          ? 'text-[#3D2505] font-bold'
                          : 'text-[#6A5234]'
                      )}
                    >
                      {cell.lunarDisplay}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Legend & Full Year Button */}
            <div className="pt-2 border-t border-[#F2E5C7] flex items-center justify-between text-[11px] text-[#6A5234]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  Ngày Trai
                </span>
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-[#FFD966] shrink-0" />
                  Vía Phật
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsYearEventsOpen(true)}
                className="text-[#8C5500] font-bold flex items-center gap-0.5 cursor-pointer whitespace-nowrap"
              >
                <span>Niên biểu cả năm</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </section>

          {/* 5. SELECTED DATE INSPECTOR & VEGETARIAN MEAL PLAN (MOBILE BENTO CARD) */}
          <section className="p-4 rounded-3xl bg-gradient-to-br from-[#FFFDF2] via-[#FFF9E6] to-[#FFF4D1] border border-[#EEDBBA] shadow-lg space-y-3">
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#EEDBBA]">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5500] block whitespace-nowrap">
                  Chi Tiết Ngày Đã Chọn
                </span>
                <h3 className="font-heading font-serif font-bold text-[13.5px] sm:text-base text-[#2E1E0F] whitespace-nowrap mt-0.5">
                  Dương {String(selectedDay).padStart(2, '0')}/{String(viewMonth).padStart(2, '0')} • Âm lịch {selectedDateLunarInfo.lunarDay}/{selectedDateLunarInfo.lunarMonth}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#FFF4D0] border border-[#EEDBBA] text-[10px] font-bold text-[#8C5500] whitespace-nowrap shrink-0">
                Ngày {selectedDateLunarInfo.dayCanChi}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-2xl bg-white border border-[#F2E5C7] min-w-0">
                <span className="text-[10px] text-[#7D6442] block">Cát Tinh Hộ Trì</span>
                <span className="font-bold text-[#2E1E0F] whitespace-nowrap block mt-0.5">
                  {selectedDateLunarInfo.hoangDaoStar}
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white border border-[#F2E5C7] min-w-0">
                <span className="text-[10px] text-[#7D6442] block">Giờ Hoàng Đạo</span>
                <span className="font-bold text-[#8C5500] whitespace-nowrap block mt-0.5">
                  {selectedDateLunarInfo.goodHours[0]} • {selectedDateLunarInfo.goodHours[1]?.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Vegetarian Meal Plan Box */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#EEDBBA] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8C5500]">
                <AlmsBowlIcon className="w-4 h-4 shrink-0" />
                <span>Thực Đơn Chay Dưỡng Sinh Gợi Ý:</span>
              </div>
              <div className="space-y-1 text-xs text-[#5A4329]">
                <p>• <strong className="text-[#2E1E0F]">Sáng:</strong> {selectedMealPlan.breakfast}</p>
                <p>• <strong className="text-[#2E1E0F]">Ngọ Trai:</strong> {selectedMealPlan.lunch}</p>
                <p>• <strong className="text-[#2E1E0F]">Chiều:</strong> {selectedMealPlan.dinner}</p>
              </div>
            </div>
          </section>

          {/* 6. MONTHLY EVENTS LIST */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-serif font-bold text-base text-[#8C5500] flex items-center gap-2">
                <PagodaMinimalIcon className="w-4 h-4 shrink-0" />
                <span>Sự Kiện Phật Sự Tháng {viewMonth}</span>
              </h3>
              <span className="text-xs text-[#7D6442] whitespace-nowrap">{currentMonthEvents.length} ngày lễ</span>
            </div>

            <div className="space-y-2.5">
              {currentMonthEvents.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => {
                    playWoodenFishSound(0.3);
                    setSelectedEvent(ev);
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#EEDBBA] hover:border-[#E5C158] cursor-pointer active:scale-[0.99] transition-all group shadow-md"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#EEDBBA] bg-white">
                      <img
                        src={ev.image}
                        alt={ev.fullTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5500] block truncate">
                        {ev.category}
                      </span>
                      <h4 className="font-heading font-serif font-bold text-sm text-[#2E1E0F] truncate whitespace-nowrap group-hover:text-[#8C5500]">
                        {ev.title}
                      </h4>
                      <p className="text-[#7D6442] text-xs mt-0.5 truncate whitespace-nowrap">
                        {ev.dayOfWeek}, {ev.solarDate} • Âm lịch {ev.lunarDate}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8C5500] shrink-0" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP VIEW (>= lg) - DHARMA RADIANT GOLD CALENDAR                       */}
      {/* ========================================================================= */}
      <div className="hidden lg:block">
        <OmManiDesktopCalendar
          viewYear={viewYear}
          viewMonth={viewMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onJumpToday={handleGoToday}
          calendarCells={calendarCells}
          selectedDay={selectedDay}
          onSelectDay={(c) => {
            if (c.isCurrentMonth) {
              setSelectedDay(c.solarDay);
              playWoodenFishSound(0.3);
            }
          }}
          selectedDateLunarInfo={selectedDateLunarInfo}
          currentMonthEvents={currentMonthEvents}
          reminders={reminders}
          onOpenAddReminder={() => setIsAddReminderOpen(true)}
          onOpenYearEvents={() => setIsYearEventsOpen(true)}
          onSelectEvent={(ev) => {
            setSelectedEvent(ev);
            playWoodenFishSound(0.3);
          }}
          onDeleteReminder={(id) => {
            const next = reminders.filter((r) => r.id !== id);
            setReminders(next);
            try {
              localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(next));
            } catch {}
            showToast('Đã xóa lịch nhắc');
          }}
          isReminderEnabled={isNotificationOn}
          onToggleReminder={handleToggleNotification}
          filterMode={filterMode}
          onChangeFilterMode={(m) => {
            playWoodenFishSound(0.25);
            setFilterMode(m);
          }}
          selectedMealPlan={selectedMealPlan}
          hasRecordedVowToday={hasRecordedVowToday}
          onRecordTraiDayVow={handleRecordTraiDayVow}
        />
      </div>

      {/* ========================================================================= */}
      {/* MODAL: NIÊN BIỂU PHẬT SỰ TRONG NĂM                                        */}
      {/* ========================================================================= */}
      {isYearEventsOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsYearEventsOpen(false);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-4 bg-black/50 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-lg max-h-[85vh] flex flex-col rounded-3xl bg-white border border-[#ECD9A8] p-5 text-[#2E1E0F] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEDBBA] shrink-0">
              <div>
                <h3 className="font-heading font-serif font-bold text-base sm:text-lg text-[#8C5500]">
                  Niên Biểu Phật Sự 12 Tháng Âm Lịch
                </h3>
                <p className="text-xs text-[#7D6442] mt-0.5">
                  Các ngày Vía Chư Phật, Bồ Tát &amp; Đại Lễ Truyền Thống
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsYearEventsOpen(false)}
                className="text-[#7D6442] hover:text-[#2E1E0F] p-1.5 rounded-full bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-2.5">
              {YEAR_ROUND_FESTIVALS.map((item, index) => (
                <div
                  key={`year-ev-${index}`}
                  className="p-3 rounded-2xl bg-white border border-[#EEDBBA] flex items-start gap-3"
                >
                  <div className="px-2.5 py-1.5 rounded-xl bg-[#FFF4D0] border border-[#EEDBBA] text-center shrink-0 min-w-[78px]">
                    <span className="text-[10px] text-[#8C5500] font-bold block uppercase leading-none">
                      {item.month}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#2E1E0F] block mt-1 leading-none">
                      {item.day}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="font-heading font-serif font-bold text-sm text-[#2E1E0F] leading-snug">
                      {item.title}
                    </h5>
                    <p className="text-xs text-[#6A5234] mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CHI TIẾT SỰ KIỆN PHẬT GIÁO                                         */}
      {/* ========================================================================= */}
      {selectedEvent && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedEvent(null);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-4 bg-black/50 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-md max-h-[86vh] flex flex-col rounded-3xl bg-white border border-[#ECD9A8] p-5 text-[#2E1E0F] shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 z-10 text-[#2E1E0F] p-1.5 rounded-full bg-white border border-[#EEDBBA]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[#EEDBBA] shadow-md">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.fullTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-white backdrop-blur-md text-[#8C5500] text-[10px] font-bold uppercase tracking-wider border border-[#ECD9A8]">
                  {selectedEvent.category}
                </div>
              </div>

              <div>
                <h3 className="font-heading font-serif text-base sm:text-xl font-bold text-[#8C5500] leading-snug">
                  {selectedEvent.fullTitle}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-[#5A4329]">
                  <span className="font-bold text-[#8C5500]">
                    {selectedEvent.dayOfWeek}, {selectedEvent.solarDate}/2026
                  </span>
                  <span>•</span>
                  <span>Âm lịch: {selectedEvent.lunarDate}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#EEDBBA] space-y-1.5 text-xs sm:text-sm leading-relaxed">
                <p className="font-bold text-[#8C5500] flex items-center gap-1.5">
                  <LotusMinimalIcon className="w-4 h-4" />
                  <span>Ý Nghĩa Phật Học:</span>
                </p>
                <p className="text-[#5A4329]">{selectedEvent.meaning}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFF9EA] border border-[#EEDBBA] space-y-1.5 text-xs sm:text-sm leading-relaxed">
                <p className="font-bold text-[#8C5500] flex items-center gap-1.5">
                  <BodhiLeafIcon className="w-4 h-4" />
                  <span>Hướng Dẫn Hành Trì:</span>
                </p>
                <p className="text-[#2E1E0F]">{selectedEvent.practiceAdvice}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EEDBBA] flex items-center justify-between shrink-0 mt-3">
              <button
                type="button"
                onClick={() => {
                  playBellSound(0.4);
                  showToast(`Đã đặt Chuông Báo Trai cho "${selectedEvent.title}"`);
                  setSelectedEvent(null);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#ECD9A8] text-[#8C5500] text-xs font-bold cursor-pointer"
              >
                <TempleBellIcon className="w-4 h-4" />
                <span>Đặt Nhắc Lễ</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] font-bold text-xs shadow-md cursor-pointer"
              >
                Hoàn Tất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TẠO LỊCH NHẮC TU TẬP                                               */}
      {/* ========================================================================= */}
      {isAddReminderOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddReminderOpen(false);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-4 bg-black/50 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm max-h-[86vh] overflow-y-auto no-scrollbar rounded-3xl bg-white border border-[#ECD9A8] p-5 text-[#2E1E0F] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEDBBA]">
              <h3 className="font-heading font-serif font-bold text-base text-[#8C5500]">
                Tạo Lịch Nhắc Hành Trì &amp; Trai Giới
              </h3>
              <button
                type="button"
                onClick={() => setIsAddReminderOpen(false)}
                className="text-[#7D6442] hover:text-[#2E1E0F] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReminder} className="space-y-3 text-xs">
              <div>
                <label className="text-[#5A4329] block mb-1 font-medium">Nội dung lời nhắc *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Thọ bát quan trai giới, Tụng kinh Dược Sư..."
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F] placeholder-[#C7B68B]/50 focus:outline-hidden focus:border-[#E5C158]"
                />
              </div>

              <div>
                <label className="text-[#5A4329] block mb-1 font-medium">Ngày Dương lịch</label>
                <input
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F] focus:outline-hidden focus:border-[#E5C158]"
                />
              </div>

              <div>
                <label className="text-[#5A4329] block mb-1 font-medium">Chuyên mục</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'trai_gioi', label: 'Trai Giới (Ăn Chay)' },
                    { id: 'cau_an', label: 'Kỳ Siêu / Cầu An' },
                    { id: 'gio', label: 'Tưởng Niệm Tiên Tổ' },
                    { id: 'quan_trong', label: 'Phật Sự Quan Trọng' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setReminderType(t.id as any)}
                      className={cn(
                        'py-2 px-2 rounded-xl border text-center transition-all cursor-pointer',
                        reminderType === t.id
                          ? 'bg-[#FFF4D0] border-[#E5C158] text-[#8C5500] font-bold'
                          : 'bg-white border-[#F2E5C7] text-[#7D6442]'
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[#5A4329] block mb-1 font-medium">Ghi chú hành trì</label>
                <textarea
                  rows={2}
                  placeholder="Chuẩn bị hương hoa, tụng 1 biến kinh..."
                  value={reminderNote}
                  onChange={(e) => setReminderNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F] placeholder-[#C7B68B]/50 focus:outline-hidden focus:border-[#E5C158]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddReminderOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white border border-[#EEDBBA] text-[#6A5234] font-bold cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold shadow-md cursor-pointer"
                >
                  Lưu Lịch Nhắc
                </button>
              </div>
            </form>
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
