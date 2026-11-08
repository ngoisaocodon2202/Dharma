'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Bell,
  Calendar as CalendarIcon,
  X,
  Share2,
  Check,
  Clock,
  Sparkles,
  Heart,
  ExternalLink,
} from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { getLunarDate, LunarDateInfo, BUDDHIST_LUNAR_EVENTS } from '@/lib/lunar-calendar';
import { playBellSound, playWoodenFishSound, playPageTurnSound } from '@/lib/buddhistSounds';
import { OmManiDesktopCalendar } from '@/components/om-mani/desktop/OmManiDesktopCalendar';
import { cn } from '@/lib/utils';

// =============================================================================
// INTERFACES & TYPES
// =============================================================================
export interface BuddhistEventItem {
  id: string;
  solarDate: string; // '08-11', '09-11', etc.
  dayOfWeek: string; // 'Chủ nhật', 'Thứ 2', 'Thứ 6', etc.
  lunarDate: string; // '30-09', '01-10', etc.
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
  solarDate: string; // YYYY-MM-DD
  lunarDateStr?: string;
  type: 'gio' | 'quan_trong' | 'trai_gioi' | 'cau_an';
  createdAt: string;
}

const REMINDER_STORAGE_KEY = 'phatphap_personal_reminders_v2';

// Days of week header matching Om Mani AppStore UI (Sunday in red)
const WEEKDAYS = [
  { label: 'Hai', isSunday: false },
  { label: 'Ba', isSunday: false },
  { label: 'Tư', isSunday: false },
  { label: 'Năm', isSunday: false },
  { label: 'Sáu', isSunday: false },
  { label: 'Bảy', isSunday: false },
  { label: 'CN', isSunday: true },
];

// Events in November 2026 (Matching Screenshots 1 & 2)
const NOVEMBER_2026_EVENTS: BuddhistEventItem[] = [
  {
    id: 'via-duoc-su',
    solarDate: '08-11',
    dayOfWeek: 'Chủ nhật',
    lunarDate: '30-09',
    title: 'Vía Dược Sư Lưu Ly Quang Vương Như...',
    fullTitle: 'Vía Đức Phật Dược Sư Lưu Ly Quang Vương Như Lai Thành Đạo',
    image: '/images/buddha_temple.jpg',
    category: 'Vía Phật & Đại Nguyện',
    meaning:
      'Đức Phật Dược Sư là giáo chủ cõi Tịnh Lưu Ly ở phương Đông. Ngài phát 12 đại nguyện cứu độ chúng sinh khỏi khổ đau vì bệnh tật, nghèo túng và tà kiến, ban phát ánh sáng thanh tịnh lưu ly cho thân tâm an lạc.',
    practiceAdvice:
      'Vào ngày này, Phật tử nên ăn chay thanh tịnh, thắp đèn Dược Sư, trì tụng Kinh Dược Sư Bổn Nguyện Công Đức và niệm danh hiệu: “Nam Mô Dược Sư Lưu Ly Quang Vương Phật” để cầu bình an cho gia đạo.',
  },
  {
    id: 'mung-1-thang-10',
    solarDate: '09-11',
    dayOfWeek: 'Thứ 2',
    lunarDate: '01-10',
    title: 'Ngày mùng 1 tháng 10 Âm lịch',
    fullTitle: 'Ngày Sóc — Mùng 1 Tháng 10 Âm Lịch (Ngày Trai Giới)',
    image: '/images/buddha_meditation.jpg',
    category: 'Ngày Sóc • Trai Giới',
    meaning:
      'Ngày đầu tháng âm lịch (ngày Sóc), theo truyền thống thiền môn là ngày hội tụ linh khí thanh tịnh, thích hợp để sám hối, phát khởi thiện tâm và hướng về Tam Bảo.',
    practiceAdvice:
      'Ăn chay thanh tịnh, thắp hương lễ Phật, đọc tụng kinh sám hối, phóng sinh cứu vật và bao dung tha thứ lỗi lầm cho mọi người xung quanh.',
  },
  {
    id: 'via-dat-ma',
    solarDate: '13-11',
    dayOfWeek: 'Thứ 6',
    lunarDate: '05-10',
    title: 'Vía Bồ Đề Đạt Ma',
    fullTitle: 'Vía Sơ Tổ Thiền Tông Bồ Đề Đạt Ma',
    image: '/images/tran_nhan_tong_yentu.jpg',
    category: 'Lễ Tổ Thiền Tông',
    meaning:
      'Tổ sư Bồ Đề Đạt Ma là vị Tổ thứ 28 của Thiền tông Ấn Độ và là Sơ tổ của Thiền tông Trung Hoa. Ngài đã truyền pháp môn “Trực chỉ nhân tâm, kiến tính thành Phật”, đặt nền móng vĩ đại cho dòng thiền Đông Độ.',
    practiceAdvice:
      'Thực hành tọa thiền quán chiếu hơi thở, giữ tâm rỗng rang không vướng mắc trần cảnh, chiêm nghiệm tinh thần “Bất lập văn tự, giáo ngoại biệt truyền”.',
  },
  {
    id: 'tet-thuong-tan',
    solarDate: '18-11',
    dayOfWeek: 'Thứ 4',
    lunarDate: '10-10',
    title: 'Tết Thường Tân',
    fullTitle: 'Tết Thường Tân (Tết Cơm Mới Tháng Mười)',
    image: '/images/lotus_pond.jpg',
    category: 'Lễ Truyền Thống Dân Tộc & Phật Giáo',
    meaning:
      'Tết Thường Tân (mùng 10 tháng 10 âm lịch) là ngày lễ mừng mùa lúa mới thu hoạch. Người Việt và Phật tử dâng hạt gạo mới, hoa quả thanh khiết cúng dâng Tam Bảo và gia tiên để tạ ơn đất trời gia hộ mùa màng tốt tươi.',
    practiceAdvice:
      'Nấu cơm mới dâng cúng Tam Bảo, hồi hướng công đức cho tổ tiên và chia sẻ bữa ăn từ thiện ấm áp cho những người còn khó khăn nghèo khó.',
  },
  {
    id: 'le-ha-nguyen',
    solarDate: '23-11',
    dayOfWeek: 'Thứ 2',
    lunarDate: '15-10',
    title: 'Lễ Hạ Nguyên',
    fullTitle: 'Đại Lễ Hạ Nguyên (Tết Cơm Mới & Lễ Cầu Siêu)',
    image: '/images/chua_bai_dinh.jpg',
    category: 'Tam Nguyên Cát Khánh',
    meaning:
      'Lễ Hạ Nguyên (Rằm tháng 10) là một trong ba tiết lễ lớn nhất trong năm (Thượng Nguyên rằm tháng Giêng, Trung Nguyên rằm tháng Bảy, Hạ Nguyên rằm tháng Mười). Đây là dịp tạ ơn Tam Bảo, tạ ơn trời đất và cầu siêu cho cửu huyền thất tổ.',
    practiceAdvice:
      'Đi chùa lễ bái, cúng dường đèn sen thanh tịnh, phóng sinh chim cá và phát tâm ăn chay trọn ngày.',
  },
  {
    id: 'ram-thang-10',
    solarDate: '23-11',
    dayOfWeek: 'Thứ 2',
    lunarDate: '15-10',
    title: 'Ngày Rằm tháng 10 Âm lịch',
    fullTitle: 'Ngày Vọng — Rằm Tháng 10 Âm Lịch (Ngày Trai Giới)',
    image: '/images/golden_buddha.jpg',
    category: 'Ngày Vọng • Trai Giới Toàn Giới',
    meaning:
      'Ngày trăng tròn tháng 10 âm lịch. Năng lượng vũ trụ hài hòa, lòng người thanh tịnh, là thời khắc màu nhiệm để gieo trồng ruộng phước vô lượng cho bản thân và gia đạo.',
    practiceAdvice:
      'Giữ trọn vẹn thập thiện nghiệp: Không sát sinh, không trộm cắp, không tà dâm, không nói dối; giữ tâm thanh tịnh tụng kinh niệm Phật.',
  },
];

// Year-round major Buddhist festivals across 12 lunar months
const YEAR_ROUND_FESTIVALS = [
  { month: 'Tháng 1 (Giêng)', day: 'Mùng 1', title: 'Tết Nguyên Đán & Vía Phật Di Lặc', desc: 'Đón xuân an lạc, hoan hỷ đón nhận niềm vui từ bi' },
  { month: 'Tháng 1 (Giêng)', day: 'Mùng 8', title: 'Lễ Cầu An Dược Sư', desc: 'Tiêu trừ tai ách, cầu thọ mạng và sức khỏe cho gia đình' },
  { month: 'Tháng 1 (Giêng)', day: 'Rằm (15)', title: 'Đại Lễ Thượng Nguyên', desc: 'Rằm tháng Giêng, ánh sáng giác ngộ soi tỏ muôn nơi' },
  { month: 'Tháng 2', day: 'Mùng 8', title: 'Vía Phật Thích Ca Xuất Gia', desc: 'Kỷ niệm Thái tử Tất Đạt Đa từ bỏ hoàng cung đi tìm đạo cứu khổ' },
  { month: 'Tháng 2', day: 'Rằm (15)', title: 'Vía Phật Thích Ca Nhập Niết Bàn', desc: 'Tưởng nhớ bậc Đạo Sư nhập vô dư Niết Bàn dưới cây Sala' },
  { month: 'Tháng 2', day: '19', title: 'Vía Quán Thế Âm Đản Sinh', desc: 'Đảnh lễ mẹ hiền Quán Thế Âm Bồ Tát tầm thanh cứu khổ' },
  { month: 'Tháng 2', day: '21', title: 'Vía Bồ Tát Phổ Hiền', desc: 'Mười đại nguyện vĩ đại của Bồ Tát Đại Hạnh' },
  { month: 'Tháng 3', day: '16', title: 'Vía Phật Mẫu Chuẩn Đề', desc: 'Trì tụng thần chú Chuẩn Đề tiêu trừ nghiệp chướng' },
  { month: 'Tháng 4', day: 'Mùng 4', title: 'Vía Bồ Tát Văn Thù Sư Lợi', desc: 'Đảnh lễ Bồ Tát Đại Trí tuệ chém đứt lưới vô minh' },
  { month: 'Tháng 4', day: 'Mùng 8', title: 'Khánh Đản Đức Phật (Bắc Tông)', desc: 'Lễ Tắm Phật truyền thống thiêng liêng' },
  { month: 'Tháng 4', day: 'Rằm (15)', title: 'Đại Lễ Phật Đản Vesak Tam Hợp', desc: 'Kỷ niệm Đản Sinh, Thành Đạo & Nhập Niết Bàn của Đức Phật' },
  { month: 'Tháng 6', day: 'Mùng 3', title: 'Vía Hộ Pháp Vi Đà Tôn Thiên', desc: 'Bảo hộ chánh pháp trường tồn, ủng hộ hành giả tu học' },
  { month: 'Tháng 6', day: '19', title: 'Vía Quán Thế Âm Thành Đạo', desc: 'Kỷ niệm Bồ Tát chứng đạo đại từ đại bi cứu vớt muôn loài' },
  { month: 'Tháng 7', day: '13', title: 'Vía Bồ Tát Đại Thế Chí', desc: 'Ánh sáng trí tuệ soi chiếu muôn cõi lìa xa ba đường ác' },
  { month: 'Tháng 7', day: 'Rằm (15)', title: 'Đại Lễ Vu Lan Báo Hiếu', desc: 'Mùa báo hiếu tứ trọng ân, cầu siêu độ cửu huyền thất tổ' },
  { month: 'Tháng 7', day: '30', title: 'Vía Bồ Tát Địa Tạng Vương', desc: 'Đại nguyện cứu vớt chúng sinh cõi u minh địa ngục' },
  { month: 'Tháng 8', day: 'Rằm (15)', title: 'Tết Trung Thu • Nguyện Đoàn Viên', desc: 'Đêm trăng thanh tịnh, thắp sáng tâm Bồ Đề ấm áp' },
  { month: 'Tháng 9', day: '19', title: 'Vía Quán Thế Âm Xuất Gia', desc: 'Công đức từ bỏ vinh hoa để hiến trọn đời cứu độ chúng sinh' },
  { month: 'Tháng 9', day: '30', title: 'Vía Phật Dược Sư Lưu Ly Quang', desc: 'Diệt trừ tật bệnh thân tâm, ban phát ánh sáng an lạc' },
  { month: 'Tháng 10', day: 'Mùng 5', title: 'Vía Bồ Đề Đạt Ma Tổ Sư', desc: 'Kỷ niệm Sơ Tổ Thiền Tông truyền tâm ấn sang phương Đông' },
  { month: 'Tháng 10', day: 'Mùng 10', title: 'Tết Thường Tân (Cơm Mới)', desc: 'Tạ ơn Tam Bảo gia hộ mùa màng tốt tươi ấm no' },
  { month: 'Tháng 10', day: 'Rằm (15)', title: 'Lễ Hạ Nguyên (Rằm Tháng Mười)', desc: 'Tam Nguyên cát khánh, cầu an gia đạo và siêu tiến tiên linh' },
  { month: 'Tháng 11', day: 'Mùng 1', title: 'Tưởng Niệm Phật Hoàng Trần Nhân Tông', desc: 'Đệ nhất Tổ Thiền phái Trúc Lâm Yên Tử nhập diệt' },
  { month: 'Tháng 11', day: '17', title: 'Vía Đức Phật A Di Đà', desc: 'Tiếp dẫn đạo sư cõi Tây Phương Cực Lạc 48 đại nguyện' },
  { month: 'Tháng 12 (Chạp)', day: 'Mùng 8', title: 'Đại Lễ Phật Thành Đạo', desc: 'Sao mai mọc, Đức Phật chứng đắc Vô Thượng Chánh Đẳng Giác' },
];

export default function BuddhistCalendarPage() {
  // Calendar state initialized to November 2026 (matching screenshot)
  const [viewYear, setViewYear] = useState<number>(2026);
  const [viewMonth, setViewMonth] = useState<number>(11);
  const [selectedDay, setSelectedDay] = useState<number>(8); // 08/11/2026 active

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
  const [reminderType, setReminderType] = useState<'gio' | 'quan_trong' | 'trai_gioi' | 'cau_an'>('gio');
  const [reminderDate, setReminderDate] = useState('2026-11-08');

  // Load saved reminders
  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMINDER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setReminders(parsed);
      }
    } catch {}
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleNotification = () => {
    playBellSound(0.4);
    setIsNotificationOn((prev) => {
      const next = !prev;
      showToast(next ? 'Đã bật chuông thông báo ngày rằm, mùng 1 & ngày lễ' : 'Đã tắt thông báo ngày lễ');
      return next;
    });
  };

  const handleGoToday = () => {
    playPageTurnSound(0.3);
    setViewYear(2026);
    setViewMonth(11);
    setSelectedDay(8);
    showToast('Đã về ngày hôm nay: Chủ nhật, 08/11/2026');
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
    showToast(`Đã lưu lời nhắc: ${newItem.title}`);
    setReminderTitle('');
    setReminderNote('');
    setIsAddReminderOpen(false);
  };

  // Build Perpetual Calendar Cells for the current month
  // Supporting full 6-row or 5-row view with trailing days of neighboring months
  const calendarCells = useMemo(() => {
    // Determine start day of week for 1st of month: Monday = 0 ... Sunday = 6
    const firstDayDate = new Date(viewYear, viewMonth - 1, 1);
    const totalDaysInMonth = new Date(viewYear, viewMonth, 0).getDate();
    const prevMonthTotalDays = new Date(viewYear, viewMonth - 1, 0).getDate();

    // In Vietnam: Monday is first day of week (index 0), Sunday is last (index 6)
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

    // 1. Previous month trailing days
    for (let i = startWeekdayOffset - 1; i >= 0; i--) {
      const prevSolarDay = prevMonthTotalDays - i;
      const prevMonth = viewMonth === 1 ? 12 : viewMonth - 1;
      const prevYear = viewMonth === 1 ? viewYear - 1 : viewYear;
      const lunar = getLunarDate(prevYear, prevMonth, prevSolarDay);
      const isSun = (cells.length % 7) === 6;

      // Special dot markers matching screenshot (e.g. 26/10 has green, 28/10 has green & amber)
      const hasGreen = prevSolarDay === 26 || prevSolarDay === 28;
      const hasAmber = prevSolarDay === 28;

      cells.push({
        solarDay: prevSolarDay,
        isCurrentMonth: false,
        solarMonth: prevMonth,
        solarYear: prevYear,
        isSunday: isSun,
        lunarDay: lunar.lunarDay,
        lunarMonth: lunar.lunarMonth,
        lunarDisplay: `${lunar.lunarDay}`,
        hasGreenDot: hasGreen,
        hasAmberDot: hasAmber,
        isToday: false,
        isSelected: false,
      });
    }

    // 2. Current month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const lunar = getLunarDate(viewYear, viewMonth, d);
      const isSun = (cells.length % 7) === 6;
      const isSelected = viewYear === 2026 && viewMonth === 11 && selectedDay === d;

      // Indicator dots calculation matching Screenshot 1 exactly for November 2026
      let hasGreen = false;
      let hasAmber = false;

      // Green dot (Trai days: ăn chay, niệm Phật)
      if (
        [2, 3, 7, 9, 11, 16, 21, 23, 28, 29].includes(d) ||
        lunar.isTraiDay ||
        [1, 8, 14, 15, 23, 29, 30].includes(lunar.lunarDay)
      ) {
        hasGreen = true;
      }

      // Amber dot (Buddhist Festivals & Vía days)
      if (
        d === 8 || // Vía Dược Sư
        d === 9 || // Mùng 1 tháng 10
        d === 13 || // Vía Đạt Ma
        d === 18 || // Tết Thường Tân
        d === 23 // Lễ Hạ Nguyên & Rằm
      ) {
        hasAmber = true;
      }

      // Lunar label format: if 1st day of lunar month, display "1/10" or "1/11"
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

    // 3. Next month leading days to complete full 6 rows (42 cells)
    const remaining = 42 - cells.length;
    for (let nextDay = 1; nextDay <= remaining; nextDay++) {
      const nextMonth = viewMonth === 12 ? 1 : viewMonth + 1;
      const nextYear = viewMonth === 12 ? viewYear + 1 : viewYear;
      const lunar = getLunarDate(nextYear, nextMonth, nextDay);
      const isSun = (cells.length % 7) === 6;

      const hasGreen = nextDay === 3;
      const hasAmber = false;

      cells.push({
        solarDay: nextDay,
        isCurrentMonth: false,
        solarMonth: nextMonth,
        solarYear: nextYear,
        isSunday: isSun,
        lunarDay: lunar.lunarDay,
        lunarMonth: lunar.lunarMonth,
        lunarDisplay: `${lunar.lunarDay}`,
        hasGreenDot: hasGreen,
        hasAmberDot: hasAmber,
        isToday: false,
        isSelected: false,
      });
    }

    return cells;
  }, [viewYear, viewMonth, selectedDay]);

  // Current month's event list
  const currentMonthEvents = useMemo(() => {
    if (viewYear === 2026 && viewMonth === 11) {
      return NOVEMBER_2026_EVENTS;
    }

    // Generate dynamic events for other months
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
            ? `Ngày mùng 1 tháng ${lunar.lunarMonth} Âm lịch`
            : `Ngày Rằm tháng ${lunar.lunarMonth} Âm lịch`);

        events.push({
          id: `dyn-${viewYear}-${viewMonth}-${d}`,
          solarDate: `${String(d).padStart(2, '0')}-${String(viewMonth).padStart(2, '0')}`,
          dayOfWeek,
          lunarDate: `${String(lunar.lunarDay).padStart(2, '0')}-${String(lunar.lunarMonth).padStart(2, '0')}`,
          title: evTitle.length > 32 ? evTitle.slice(0, 32) + '...' : evTitle,
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

  return (
    <div className="min-h-screen bg-[#110D0A] text-[#FDFBF7] selection:bg-amber-500/30 selection:text-amber-200">
      {/* ========================================================================= */}
      {/* MOBILE VIEW (< lg) - 100% Locked Apple iOS Om Mani Layout                 */}
      {/* ========================================================================= */}
      <div className="block lg:hidden">
        {/* Container centered with mobile app aspect ratio */}
        <div className="max-w-md sm:max-w-lg mx-auto px-4 sm:px-5 pt-3 pb-32 space-y-6">

        {/* ========================================================================= */}
        {/* 1. TOP HEADER BAR WITH RIGHT ACTION BUTTONS (MATCHING SCREENSHOT 1)       */}
        {/* ========================================================================= */}
        <header className="flex items-start justify-between gap-3 pt-2">
          {/* Left Heading */}
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              Lịch và Sự kiện
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Lịch âm dương và ngày lễ Phật giáo
            </p>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 shrink-0 pt-0.5">
            {/* Round (+) Button for Adding Reminder */}
            <button
              type="button"
              onClick={() => setIsAddReminderOpen(true)}
              className="w-10 h-10 rounded-full bg-[#1E1610] border border-white/10 hover:border-amber-400/40 text-stone-200 hover:text-white flex items-center justify-center transition-all active:scale-95 shadow-md cursor-pointer"
              title="Thêm nhắc nhở / Sự kiện cá nhân"
              aria-label="Thêm nhắc nhở"
            >
              <Plus className="w-5 h-5 text-stone-200" />
            </button>

            {/* Pill Container: [CalendarClock | Bell] */}
            <div className="flex items-center rounded-full bg-[#1E1610] border border-white/10 p-0.5 shadow-md">
              {/* Go to Today Button */}
              <button
                type="button"
                onClick={handleGoToday}
                className="w-9 h-9 rounded-full flex items-center justify-center text-stone-300 hover:text-amber-200 hover:bg-stone-800/60 active:scale-95 transition-all cursor-pointer"
                title="Về ngày hôm nay"
                aria-label="Về ngày hôm nay"
              >
                <div className="relative">
                  <CalendarIcon className="w-4 h-4" />
                  <Clock className="w-2.5 h-2.5 absolute -bottom-1 -right-1 text-amber-400" />
                </div>
              </button>

              {/* Notification Bell Button */}
              <button
                type="button"
                onClick={handleToggleNotification}
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition-all cursor-pointer',
                  isNotificationOn
                    ? 'text-amber-300 hover:text-amber-200'
                    : 'text-stone-500 hover:text-stone-300'
                )}
                title={isNotificationOn ? 'Đang bật thông báo ngày lễ' : 'Đã tắt thông báo'}
                aria-label="Bật tắt thông báo ngày lễ"
              >
                <Bell className="w-4 h-4 fill-current opacity-85" />
              </button>
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* 2. MONTH SELECTOR & NAVIGATOR (MATCHING SCREENSHOT 1)                     */}
        {/* ========================================================================= */}
        <section aria-label="Điều hướng tháng" className="pt-2">
          <div className="flex items-center justify-between px-1">
            {/* Prev Month Button */}
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 text-stone-400 hover:text-white active:scale-90 transition-transform cursor-pointer"
              aria-label="Tháng trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Month & Year Title */}
            <h2 className="font-heading font-bold text-base sm:text-lg text-white tracking-wide select-none">
              Tháng {viewMonth} - {viewYear}
            </h2>

            {/* Next Month Button */}
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 text-stone-400 hover:text-white active:scale-90 transition-transform cursor-pointer"
              aria-label="Tháng sau"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. PERPETUAL CALENDAR GRID (MATCHING SCREENSHOT 1)                        */}
        {/* ========================================================================= */}
        <section aria-label="Bảng lịch vạn niên" className="space-y-2 select-none">
          {/* Weekday Row: Hai Ba Tư Năm Sáu Bảy CN (CN in Red) */}
          <div className="grid grid-cols-7 text-center">
            {WEEKDAYS.map((w) => (
              <div
                key={w.label}
                className={cn(
                  'text-xs font-medium py-1.5',
                  w.isSunday ? 'text-rose-500 font-bold' : 'text-stone-400'
                )}
              >
                {w.label}
              </div>
            ))}
          </div>

          {/* Days Grid (7 columns x 6 rows) */}
          <div className="grid grid-cols-7 gap-y-2 gap-x-1 sm:gap-x-1.5 text-center">
            {calendarCells.map((cell, idx) => {
              const key = `cell-${idx}-${cell.solarDay}-${cell.solarMonth}`;

              return (
                <button
                  key={key}
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
                    'flex flex-col items-center justify-center py-2 px-0.5 rounded-2xl transition-all duration-150 cursor-pointer relative group active:scale-95 min-h-[58px]',
                    cell.isSelected
                      ? 'bg-gradient-to-b from-[#C4681E] to-[#99470B] text-white shadow-xl ring-1 ring-amber-300/40'
                      : 'hover:bg-stone-900/60'
                  )}
                >
                  {/* Top: Solar Date + Indicator Dots */}
                  <div className="flex items-center justify-center gap-1 leading-none">
                    <span
                      className={cn(
                        'text-sm sm:text-base font-bold font-mono leading-none',
                        cell.isSelected
                          ? 'text-white'
                          : cell.isCurrentMonth
                          ? cell.isSunday
                            ? 'text-rose-500 font-bold'
                            : 'text-stone-100'
                          : cell.isSunday
                          ? 'text-rose-900/60'
                          : 'text-stone-600'
                      )}
                    >
                      {String(cell.solarDay).padStart(2, '0')}
                    </span>

                    {/* Indicator Dots Container */}
                    <div className="flex items-center gap-0.5">
                      {/* Green dot (Trai day / Ăn chay) */}
                      {cell.hasGreenDot && (
                        <span
                          className={cn(
                            'w-1.5 h-1.5 rounded-full shrink-0',
                            cell.isSelected ? 'bg-amber-100' : 'bg-emerald-400'
                          )}
                          title="Ngày trai giới • Ăn chay"
                        />
                      )}
                      {/* Amber dot (Buddhist Festival) */}
                      {cell.hasAmberDot && (
                        <span
                          className={cn(
                            'w-1.5 h-1.5 rounded-full shrink-0',
                            cell.isSelected ? 'bg-amber-200' : 'bg-amber-400'
                          )}
                          title="Ngày lễ • Vía Phật"
                        />
                      )}
                    </div>
                  </div>

                  {/* Bottom: Lunar Date */}
                  <span
                    className={cn(
                      'text-[10px] font-mono leading-none mt-1.5',
                      cell.isSelected
                        ? 'text-amber-100 font-medium'
                        : cell.isCurrentMonth
                        ? 'text-stone-400'
                        : 'text-stone-600'
                    )}
                  >
                    {cell.lunarDisplay}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Button: [ Toàn bộ sự kiện trong năm › ] */}
          <div className="pt-3 text-center">
            <button
              type="button"
              onClick={() => {
                playPageTurnSound(0.3);
                setIsYearEventsOpen(true);
              }}
              className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-[#1C140E] hover:bg-[#2A1D14] border border-white/10 hover:border-amber-400/40 text-stone-200 hover:text-white text-xs sm:text-sm font-medium transition-all active:scale-95 shadow-md cursor-pointer"
            >
              <span>Toàn bộ sự kiện trong năm</span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. CÁC SỰ KIỆN TRONG THÁNG (MATCHING SCREENSHOT 1 & 2)                    */}
        {/* ========================================================================= */}
        <section aria-label="Các sự kiện trong tháng" className="space-y-3.5 pt-2">
          {/* Section Heading */}
          <h3 className="font-heading font-bold text-base sm:text-lg text-[#E5B869] tracking-wide">
            Các sự kiện trong tháng {viewMonth}
          </h3>

          {/* Events List */}
          <div className="space-y-3">
            {currentMonthEvents.map((ev) => (
              <div
                key={ev.id}
                onClick={() => {
                  playWoodenFishSound(0.3);
                  setSelectedEvent(ev);
                }}
                className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-[#1C140E] border border-stone-800/80 hover:border-amber-500/40 cursor-pointer active:scale-[0.99] transition-all group shadow-md"
              >
                {/* Left Thumbnail & Info */}
                <div className="flex items-center gap-3.5 min-w-0 pr-2">
                  {/* Thumbnail Image */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-white/5 bg-[#251A12] shadow-sm">
                    <img
                      src={ev.image}
                      alt={ev.fullTitle}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Text Details */}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-heading font-bold text-sm sm:text-[15px] text-white leading-snug truncate group-hover:text-amber-200 transition-colors">
                      {ev.title}
                    </h4>
                    <p className="text-stone-400 text-xs mt-1 truncate">
                      {ev.dayOfWeek}, {ev.solarDate} • Âm lịch {ev.lunarDate}
                    </p>
                  </div>
                </div>

                {/* Right Chevron Arrow */}
                <div className="shrink-0 text-stone-500 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. PERSONAL REMINDERS LIST (IF ANY SAVED)                                 */}
        {/* ========================================================================= */}
        {reminders.length > 0 && (
          <section aria-label="Lời nhắc cá nhân" className="space-y-3 pt-4 border-t border-stone-800">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-bold text-sm text-stone-300">
                Lời nhắc cá nhân ({reminders.length})
              </h4>
              <button
                type="button"
                onClick={() => setIsAddReminderOpen(true)}
                className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>

            <div className="space-y-2">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className="p-3 rounded-2xl bg-[#1C140E]/80 border border-stone-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{rem.title}</span>
                    <span className="text-stone-400 mt-0.5 block">
                      {rem.solarDate} {rem.lunarDateStr && `(Âm: ${rem.lunarDateStr})`}
                    </span>
                    {rem.note && <span className="text-stone-500 italic mt-0.5 block">{rem.note}</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = reminders.filter((r) => r.id !== rem.id);
                      setReminders(next);
                      localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(next));
                      showToast('Đã xóa lời nhắc');
                    }}
                    className="text-stone-500 hover:text-red-400 p-1"
                    title="Xóa lời nhắc"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP VIEW (>= lg) - Luxury Dark Gold Buddhist Sanctuary Layout         */}
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
            showToast('Đã xóa lời nhắc');
          }}
          isReminderEnabled={isNotificationOn}
          onToggleReminder={handleToggleNotification}
        />
      </div>

      {/* ========================================================================= */}
      {/* MODAL: TOÀN BỘ SỰ KIỆN TRONG NĂM                                          */}
      {/* ========================================================================= */}
      {isYearEventsOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsYearEventsOpen(false);
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-lg max-h-[85vh] flex flex-col rounded-3xl bg-[#201712] border border-amber-500/40 p-5 text-white shadow-2xl animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 shrink-0">
              <div>
                <h3 className="font-heading font-serif font-bold text-lg text-[#FFE082]">
                  Toàn Bộ Sự Kiện Phật Giáo Trong Năm
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  12 tháng âm lịch và các ngày vía chư Phật, Bồ Tát
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsYearEventsOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-2.5">
              {YEAR_ROUND_FESTIVALS.map((item, index) => (
                <div
                  key={`year-ev-${index}`}
                  className="p-3 rounded-2xl bg-black/40 border border-white/5 hover:border-amber-400/30 transition-all flex items-start gap-3"
                >
                  {/* Month & Day Badge */}
                  <div className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-center shrink-0 min-w-[70px]">
                    <span className="text-[10px] text-amber-300 font-bold block uppercase leading-none">
                      {item.month}
                    </span>
                    <span className="text-xs font-mono font-bold text-white block mt-1 leading-none">
                      {item.day}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="min-w-0 flex-1">
                    <h5 className="font-heading font-bold text-sm text-stone-100 leading-snug">
                      {item.title}
                    </h5>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-stone-800 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setIsYearEventsOpen(false)}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Đóng
              </button>
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
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-md max-h-[88vh] flex flex-col rounded-3xl bg-[#201712] border border-amber-500/40 p-5 text-white shadow-2xl animate-scale-in">
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 z-10 text-stone-400 hover:text-white p-1 rounded-full bg-black/50"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
              {/* Banner Image */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-md">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.fullTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
                  {selectedEvent.category}
                </div>
              </div>

              {/* Title & Date */}
              <div>
                <h3 className="font-heading font-serif text-lg sm:text-xl font-bold text-[#FFE082] leading-snug">
                  {selectedEvent.fullTitle}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-stone-300">
                  <span className="font-medium text-amber-300">
                    {selectedEvent.dayOfWeek}, {selectedEvent.solarDate}/2026
                  </span>
                  <span>•</span>
                  <span>Âm lịch: {selectedEvent.lunarDate}</span>
                </div>
              </div>

              {/* Meaning & Significance */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs sm:text-sm text-stone-200 leading-relaxed">
                <p className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ý Nghĩa &amp; Nguồn Gốc:</span>
                </p>
                <p className="text-stone-300">{selectedEvent.meaning}</p>
              </div>

              {/* Practice Guidance */}
              <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/20 space-y-1.5 text-xs sm:text-sm text-amber-100 leading-relaxed">
                <p className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" />
                  <span>Lời Khuyên Tu Tập:</span>
                </p>
                <p>{selectedEvent.practiceAdvice}</p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-stone-800 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => {
                  playBellSound(0.4);
                  showToast(`Đã đặt nhắc nhở cho "${selectedEvent.title}"`);
                  setSelectedEvent(null);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
              >
                <Bell className="w-3.5 h-3.5 text-amber-300" />
                <span>Đặt Nhắc Nhở</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: THÊM NHẮC NHỞ CÁ NHÂN / NGÀY GIỖ (NÚT +)                           */}
      {/* ========================================================================= */}
      {isAddReminderOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddReminderOpen(false);
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm rounded-3xl bg-[#201712] border border-amber-500/40 p-5 text-white shadow-2xl animate-scale-in space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <h3 className="font-heading font-bold text-base text-[#FFE082]">
                Thêm Nhắc Nhở Cá Nhân
              </h3>
              <button
                type="button"
                onClick={() => setIsAddReminderOpen(false)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReminder} className="space-y-3 text-xs">
              <div>
                <label className="text-stone-300 block mb-1 font-medium">Tiêu đề nhắc nhở *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Ngày giỗ Mẹ, Ngày phóng sinh, Lễ chùa..."
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-stone-700 text-white placeholder-stone-500 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-stone-300 block mb-1 font-medium">Ngày Dương lịch</label>
                <input
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-stone-700 text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-stone-300 block mb-1 font-medium">Phân loại</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'gio', label: 'Ngày Giỗ' },
                    { id: 'trai_gioi', label: 'Ăn Chay' },
                    { id: 'cau_an', label: 'Cầu An' },
                    { id: 'quan_trong', label: 'Quan Trọng' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setReminderType(t.id as any)}
                      className={cn(
                        'py-1.5 px-2 rounded-xl border text-center transition-all',
                        reminderType === t.id
                          ? 'bg-amber-600/30 border-amber-400 text-amber-200 font-bold'
                          : 'bg-black/30 border-stone-800 text-stone-400'
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-stone-300 block mb-1 font-medium">Ghi chú thêm</label>
                <textarea
                  rows={2}
                  placeholder="Chuẩn bị hoa quả, tụng kinh Dược Sư..."
                  value={reminderNote}
                  onChange={(e) => setReminderNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-stone-700 text-white placeholder-stone-500 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddReminderOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-stone-800 text-stone-300 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold shadow-md transition-all active:scale-95"
                >
                  Lưu Nhắc Nhở
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOATING TOAST                                                            */}
      {/* ========================================================================= */}
      {toastMessage && (
        <div className="fixed top-14 inset-x-3 z-50 flex justify-center pointer-events-none animate-fadeInDown">
          <div className="px-4 py-2 rounded-2xl bg-[#24130A]/95 border border-[#D4AF37] text-center shadow-xl backdrop-blur-md">
            <p className="font-heading text-xs sm:text-sm font-bold text-[#FFE082]">
              {toastMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
