'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export type SupportedLang = 'vi' | 'en' | 'zh' | 'th' | 'ja' | 'ko' | 'hi';

export interface LanguageOption {
  code: SupportedLang;
  name: string;
  nativeName: string;
  flag: string;
  country: string;
}

export const BUDDHIST_LANGUAGES: LanguageOption[] = [
  { code: 'vi', name: 'Tiếng Việt', nativeName: 'Tiếng Việt', flag: '🇻🇳', country: 'Việt Nam' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', country: 'International' },
  { code: 'zh', name: 'Tiếng Trung', nativeName: '中文', flag: '🇨🇳', country: 'Trung Hoa / Đài Loan' },
  { code: 'th', name: 'Tiếng Thái', nativeName: 'ไทย', flag: '🇹🇭', country: 'Thái Lan' },
  { code: 'ja', name: 'Tiếng Nhật', nativeName: '日本語', flag: '🇯🇵', country: 'Nhật Bản' },
  { code: 'ko', name: 'Tiếng Hàn', nativeName: '한국어', flag: '🇰🇷', country: 'Hàn Quốc' },
  { code: 'hi', name: 'Tiếng Ấn', nativeName: 'हिन्दी', flag: '🇮🇳', country: 'Ấn Độ' },
];

// Core UI Dictionary for instant 0ms, concise, non-wrapping translation of buttons, tabs & nav items
export const UI_DICT: Record<SupportedLang, Record<string, string>> = {
  vi: {},
  en: {
    'Trang chủ': 'Home',
    'Học Phật': 'Dharma Study',
    'Lịch sử Phật giáo': 'Buddhist History',
    'Lịch Sử Phật Giáo': 'Buddhist History',
    'Lịch Sử Phật': 'History',
    'Bài viết': 'Articles',
    'Bài Giảng Sư Thầy': 'Monk Teachings',
    'Bài giảng Sư Thầy & Chùa': 'Monk & Temple Articles',
    'Pháp thoại': 'Dharma Talks',
    'Pháp Thoại': 'Dharma Talks',
    'Lộ trình học': 'Learning Path',
    'Tủ kinh sách': 'Sutras & Books',
    'Chùa & Tự viện': 'Temples',
    'Chùa & Địa danh': 'Temples & Sites',
    'Danh Lam Cổ Tự': 'Ancient Temples',
    'Sự kiện & Khóa tu': 'Retreats & Events',
    'Tự viện & Tổ chức': 'Organizations',
    'Tu tập': 'Practice',
    'Lịch & Tu tập': 'Calendar & Practice',
    'Phòng thiền': 'Meditation',
    'Phòng Thiền': 'Meditation',
    'Thực hành': 'Daily Practice',
    'Lịch Vạn Niên': 'Calendar',
    'Lịch Nhắc Nhở': 'Calendar',
    'Lịch Nhắc': 'Calendar',
    'Màu Hợp & Ngày Tốt': 'Lucky Colors & Days',
    'Màu & Ngày Tốt': 'Lucky Days',
    'Màu & Ngày': 'Lucky Days',
    'Ngày Tốt': 'Lucky Days',
    'Màu Chủ Đạo': 'Lucky Colors',
    'AI Phật Pháp': 'Dharma AI',
    'AI Pháp': 'Dharma AI',
    'Hỏi Đáp AI': 'Dharma AI',
    'Tìm kiếm...': 'Search...',
    '☸ Nhập Pháp Danh': '☸ Dharma Name',
    '☸ Nhập Pháp Danh & Giới Tính': '☸ Dharma Name & Gender',
    'Nhập Pháp Danh': 'Dharma Name',
    'Định danh': 'Dharma Profile',
    'Đăng xuất': 'Sign Out',
    'Xóa Pháp Danh': 'Clear Profile',
    'Đổi Pháp Danh': 'Edit Dharma Name',
    'Trang cá nhân': 'Profile',
    'Hồ sơ': 'Profile',
    'Pháp âm': 'Audio',
    'Tất cả': 'All',
    'Tụng Kinh': 'Chanting',
    'Đọc Kinh': 'Chant Sutras',
    'Niệm Phật': 'Recitation',
    'Lạy Phật': 'Prostration',
    'Tọa Thiền': 'Meditation',
    'Trì Chú': 'Mantra',
    'Thắp Hương': 'Incense',
    'Thắp hương': 'Incense',
    'Gõ Chuông': 'Ring Bell',
    'Nghe chuông': 'Ring Bell',
    'Trì Tụng (+1)': 'Chant (+1)',
    'Trì Tụng (+1 Biến)': 'Chant (+1)',
    'Chạm 1 Lần Niệm Phật (+1 Câu)': 'Tap to Chant Buddha (+1)',
    'Đổi qua Quán Âm': 'Switch to Guanyin',
    'Đổi qua A Di Đà': 'Switch to Amitabha',
    'Chuỗi Hạt': 'Mala Beads',
    'Chuỗi hạt': 'Mala Beads',
    'Công Phu': 'Daily Routine',
    'Chùa Cổ Tự': 'Temples',
    'Minh Chú': 'Mantras',
    'Bình an': 'Peace',
    'Trừ chướng ngại': 'Overcome Obstacles',
    'Sức khỏe': 'Health',
    'Cứu khổ': 'Compassion',
    'Đã trì': 'Chanted',
    'Thêm Nhắc Nhở': 'Add Reminder',
    'Mới': 'New',
    'Hôm nay': 'Today',
  },
  zh: {
    'Trang chủ': '首页',
    'Học Phật': '学佛',
    'Lịch sử Phật giáo': '佛教历史',
    'Lịch Sử Phật Giáo': '佛教历史',
    'Lịch Sử Phật': '佛教史',
    'Bài viết': '佛学文章',
    'Bài Giảng Sư Thầy': '高僧开示',
    'Pháp thoại': '法音',
    'Pháp Thoại': '法音',
    'Lộ trình học': '修学路径',
    'Tủ kinh sách': '藏经阁',
    'Chùa & Tự viện': '寺院',
    'Chùa & Địa danh': '古刹名胜',
    'Danh Lam Cổ Tự': '千年古刹',
    'Sự kiện & Khóa tu': '禅修法会',
    'Tự viện & Tổ chức': '佛教机构',
    'Tu tập': '修行',
    'Lịch & Tu tập': '佛历与修行',
    'Phòng thiền': '禅堂',
    'Phòng Thiền': '禅堂',
    'Thực hành': '每日功课',
    'Lịch Vạn Niên': '万年佛历',
    'Lịch Nhắc Nhở': '佛历提醒',
    'Lịch Nhắc': '佛历',
    'Màu Hợp & Ngày Tốt': '吉祥色与吉日',
    'Màu & Ngày Tốt': '吉日良辰',
    'Màu & Ngày': '吉日',
    'Ngày Tốt': '吉日',
    'Màu Chủ Đạo': '吉祥色',
    'AI Phật Pháp': '佛法AI',
    'AI Pháp': '佛法AI',
    'Hỏi Đáp AI': '佛法AI',
    'Tìm kiếm...': '搜索...',
    '☸ Nhập Pháp Danh': '☸ 输入法名',
    'Nhập Pháp Danh': '输入法名',
    'Định danh': '佛子法名',
    'Đăng xuất': '退出',
    'Trang cá nhân': '档案',
    'Hồ sơ': '档案',
    'Pháp âm': '法音',
    'Tất cả': '全部',
    'Tụng Kinh': '诵经',
    'Đọc Kinh': '诵经',
    'Niệm Phật': '念佛',
    'Lạy Phật': '礼佛',
    'Tọa Thiền': '坐禅',
    'Trì Chú': '持咒',
    'Thắp Hương': '敬香',
    'Thắp hương': '敬香',
    'Gõ Chuông': '鸣钟',
    'Nghe chuông': '听钟声',
    'Trì Tụng (+1)': '持诵 (+1)',
    'Trì Tụng (+1 Biến)': '持诵 (+1)',
    'Chạm 1 Lần Niệm Phật (+1 Câu)': '点击念佛 (+1句)',
    'Đổi qua Quán Âm': '切换观音菩萨',
    'Đổi qua A Di Đà': '切换阿弥陀佛',
    'Chuỗi Hạt': '念珠',
    'Chuỗi hạt': '念珠',
    'Công Phu': '功课',
    'Chùa Cổ Tự': '古刹',
    'Minh Chú': '真言',
    'Bình an': '平安',
    'Trừ chướng ngại': '除障',
    'Sức khỏe': '健康',
    'Cứu khổ': '救苦',
    'Đã trì': '已持',
    'Thêm Nhắc Nhở': '添加提醒',
    'Mới': '新',
    'Hôm nay': '今日',
  },
  th: {
    'Trang chủ': 'หน้าแรก',
    'Học Phật': 'ศึกษาธรรม',
    'Lịch sử Phật giáo': 'พุทธประวัติ',
    'Lịch Sử Phật Giáo': 'พุทธประวัติ',
    'Lịch Sử Phật': 'พุทธประวัติ',
    'Bài viết': 'บทความธรรม',
    'Bài Giảng Sư Thầy': 'ธรรมะพระอาจารย์',
    'Pháp thoại': 'ธรรมบรรยาย',
    'Pháp Thoại': 'ธรรมบรรยาย',
    'Lộ trình học': 'เส้นทางธรรม',
    'Tủ kinh sách': 'พระไตรปิฎก',
    'Chùa & Tự viện': 'วัด',
    'Chùa & Địa danh': 'วัดสำคัญ',
    'Danh Lam Cổ Tự': 'วัดโบราณ',
    'Phòng thiền': 'ห้องสมาธิ',
    'Phòng Thiền': 'ห้องสมาธิ',
    'Lịch Vạn Niên': 'ปฏิทินธรรม',
    'Lịch Nhắc Nhở': 'ปฏิทินเตือน',
    'Lịch Nhắc': 'ปฏิทิน',
    'Màu & Ngày Tốt': 'สีและวันมงคล',
    'Màu & Ngày': 'วันมงคล',
    'Ngày Tốt': 'วันมงคล',
    'AI Phật Pháp': 'AI ธรรมะ',
    'AI Pháp': 'AI ธรรมะ',
    'Hỏi Đáp AI': 'AI ธรรมะ',
    '☸ Nhập Pháp Danh': '☸ ระบุฉายาธรรม',
    'Hồ sơ': 'โปรไฟล์',
    'Tất cả': 'ทั้งหมด',
    'Tụng Kinh': 'สวดมนต์',
    'Đọc Kinh': 'สวดมนต์',
    'Niệm Phật': 'ภาวนา',
    'Lạy Phật': 'กราบพระ',
    'Tọa Thiền': 'นั่งสมาธิ',
    'Trì Chú': 'สวดมนตรา',
    'Thắp Hương': 'จุดธูป',
    'Gõ Chuông': 'ตีระฆัง',
    'Nghe chuông': 'ฟังเสียงระฆัง',
    'Trì Tụng (+1)': 'สวด (+1)',
    'Trì Tụng (+1 Biến)': 'สวด (+1)',
    'Chuỗi Hạt': 'ลูกประคำ',
    'Thêm Nhắc Nhở': 'เพิ่มบันทึก',
    'Mới': 'ใหม่',
    'Hôm nay': 'วันนี้',
  },
  ja: {
    'Trang chủ': 'ホーム',
    'Học Phật': '仏法学習',
    'Lịch sử Phật giáo': '仏教の歴史',
    'Lịch Sử Phật Giáo': '仏教の歴史',
    'Lịch Sử Phật': '仏教史',
    'Bài viết': '法話記事',
    'Bài Giảng Sư Thầy': '僧侶の法話',
    'Pháp thoại': '法音',
    'Pháp Thoại': '法音',
    'Tủ kinh sách': '経典',
    'Phòng thiền': '禅堂',
    'Phòng Thiền': '禅堂',
    'Lịch Vạn Niên': '仏教暦',
    'Lịch Nhắc Nhở': '仏教暦',
    'Lịch Nhắc': '仏教暦',
    'Màu & Ngày Tốt': '吉日・守護色',
    'Màu & Ngày': '吉日',
    'Ngày Tốt': '吉日',
    'AI Phật Pháp': '仏法AI',
    'AI Pháp': '仏法AI',
    'Hỏi Đáp AI': '仏法AI',
    '☸ Nhập Pháp Danh': '☸ 法名入力',
    'Hồ sơ': 'マイページ',
    'Tất cả': 'すべて',
    'Tụng Kinh': '読経',
    'Đọc Kinh': '読経',
    'Niệm Phật': '念仏',
    'Lạy Phật': '礼拝',
    'Tọa Thiền': '坐禅',
    'Trì Chú': '真言',
    'Thắp Hương': '焼香',
    'Gõ Chuông': '鐘を鳴らす',
    'Nghe chuông': '鐘を聴く',
    'Trì Tụng (+1)': '唱える (+1)',
    'Trì Tụng (+1 Biến)': '唱える (+1)',
    'Chuỗi Hạt': '数珠',
    'Thêm Nhắc Nhở': '予定追加',
    'Mới': '新着',
    'Hôm nay': '今日',
  },
  ko: {
    'Trang chủ': '홈',
    'Học Phật': '불법 배움',
    'Lịch sử Phật giáo': '불교 역사',
    'Lịch Sử Phật Giáo': '불교 역사',
    'Lịch Sử Phật': '불교사',
    'Bài viết': '법문 칼럼',
    'Bài Giảng Sư Thầy': '스님 법문',
    'Pháp thoại': '법음',
    'Pháp Thoại': '법음',
    'Tủ kinh sách': '경전',
    'Phòng thiền': '선방',
    'Phòng Thiền': '선방',
    'Lịch Vạn Niên': '불교 달력',
    'Lịch Nhắc Nhở': '불교 달력',
    'Lịch Nhắc': '달력',
    'Màu & Ngày Tốt': '길일·수호색',
    'Màu & Ngày': '길일',
    'Ngày Tốt': '길일',
    'AI Phật Pháp': '불법 AI',
    'AI Pháp': '불법 AI',
    'Hỏi Đáp AI': '불법 AI',
    '☸ Nhập Pháp Danh': '☸ 법명 입력',
    'Hồ sơ': '프로필',
    'Tất cả': '전체',
    'Tụng Kinh': '독경',
    'Đọc Kinh': '독경',
    'Niệm Phật': '염불',
    'Lạy Phật': '예불',
    'Tọa Thiền': '좌선',
    'Trì Chú': '진언',
    'Thắp Hương': '헌향',
    'Gõ Chuông': '타종',
    'Nghe chuông': '종소리 듣기',
    'Trì Tụng (+1)': '독송 (+1)',
    'Trì Tụng (+1 Biến)': '독송 (+1)',
    'Chuỗi Hạt': '염주',
    'Thêm Nhắc Nhở': '일정 추가',
    'Mới': '신규',
    'Hôm nay': '오늘',
  },
  hi: {
    'Trang chủ': 'होम',
    'Học Phật': 'धम्म शिक्षा',
    'Lịch sử Phật giáo': 'बौद्ध इतिहास',
    'Lịch Sử Phật Giáo': 'बौद्ध इतिहास',
    'Lịch Sử Phật': 'इतिहास',
    'Bài viết': 'धम्म लेख',
    'Bài Giảng Sư Thầy': 'भिक्षु प्रवचन',
    'Pháp thoại': 'प्रवचन',
    'Pháp Thoại': 'प्रवचन',
    'Tủ kinh sách': 'त्रिपिटक',
    'Phòng thiền': 'ध्यान कक्ष',
    'Phòng Thiền': 'ध्यान कक्ष',
    'Lịch Vạn Niên': 'पंचांग',
    'Lịch Nhắc Nhở': 'पंचांग',
    'Lịch Nhắc': 'पंचांग',
    'Màu & Ngày Tốt': 'शुभ दिन',
    'Màu & Ngày': 'शुभ दिन',
    'Ngày Tốt': 'शुभ दिन',
    'AI Phật Pháp': 'धम्म AI',
    'AI Pháp': 'धम्म AI',
    'Hỏi Đáp AI': 'धम्म AI',
    '☸ Nhập Pháp Danh': '☸ धम्म नाम',
    'Hồ sơ': 'प्रोफ़ाइल',
    'Tất cả': 'सभी',
    'Tụng Kinh': 'सूत्र पाठ',
    'Đọc Kinh': 'सूत्र पाठ',
    'Niệm Phật': 'बुद्ध स्मरण',
    'Lạy Phật': 'वंदना',
    'Tọa Thiền': 'ध्यान',
    'Trì Chú': 'मंत्र जप',
    'Thắp Hương': 'धूप',
    'Gõ Chuông': 'घंटी',
    'Nghe chuông': 'घंटी सुनें',
    'Trì Tụng (+1)': 'मंत्र (+1)',
    'Trì Tụng (+1 Biến)': 'मंत्र (+1)',
    'Chuỗi Hạt': 'माला',
    'Thêm Nhắc Nhở': 'स्मरण जोड़ें',
    'Mới': 'नया',
    'Hôm nay': 'आज',
  },
};

// Sacred Buddhist Proper Nouns & Mantras that must remain untouched or respected
const PROTECTED_PROPER_NOUNS = [
  'Om Mani Padme Hum',
  'Oṃ Maṇi Padme Hūṃ',
  'Oṃ Āḥ Hūṃ Vajra Guru Padma Siddhi Hūṃ',
  'Mahā Karuṇā Dhāraṇī',
  'Bhaiṣajyaguru Dhāraṇī',
  'Om Ah Hum Vajra Guru Padma Siddhi Hum',
  'Gate Gate Paragate Parasamgate Bodhi Svaha',
  'Nam Mô Bổn Sư Thích Ca Mâu Ni Phật',
  'Nam Mô A Di Đà Phật',
  'Nam Mô Đại Bi Quán Thế Âm Bồ Tát',
  'Thích Nhất Hạnh',
  'Thích Pháp Hòa',
  'Thích Minh Niệm',
  'Thích Minh Châu',
  'Thích Thanh Từ',
  'Thích Thiện Hoa',
  'Thích Trí Tịnh',
  'Thích Tâm Trường',
  'Thích Nhật Quang',
  'Trần Nhân Tông',
  'Trúc Lâm Yên Tử',
];

interface LanguageContextType {
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
  t: (text: string) => string;
  currentLanguage: LanguageOption;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'vi',
  setLang: () => {},
  t: (text) => text,
  currentLanguage: BUDDHIST_LANGUAGES[0],
  isTranslating: false,
});

// Global memory cache for translated segments
const translationCache: Record<string, Record<string, string>> = {};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<SupportedLang>('vi');
  const [isTranslating, setIsTranslating] = useState(false);
  const pathname = usePathname();
  const origTextMapRef = useRef<WeakMap<Text, string>>(new WeakMap());
  const translateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('phatphap_lang') as SupportedLang | null;
      if (saved && BUDDHIST_LANGUAGES.some((l) => l.code === saved)) {
        setLangState(saved);
      }
    } catch {}
  }, []);

  // Global Mouse-Drag & Wheel Horizontal Scroll Enhancer for all .overflow-x-auto containers
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let activeEl: HTMLElement | null = null;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let dragged = false;

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const scroller = target?.closest('.overflow-x-auto') as HTMLElement | null;
      if (!scroller) return;
      activeEl = scroller;
      isDown = true;
      dragged = false;
      startX = e.pageX - scroller.offsetLeft;
      scrollLeft = scroller.scrollLeft;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown || !activeEl) return;
      const x = e.pageX - activeEl.offsetLeft;
      const walk = (x - startX) * 1.35;
      if (Math.abs(walk) > 5) {
        dragged = true;
        activeEl.scrollLeft = scrollLeft - walk;
      }
    };

    const onMouseUp = () => {
      isDown = false;
      activeEl = null;
    };

    const onClickCapture = (e: MouseEvent) => {
      if (dragged) {
        e.preventDefault();
        e.stopPropagation();
        dragged = false;
      }
    };

    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    window.addEventListener('click', onClickCapture, true);

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('click', onClickCapture, true);
    };
  }, []);

  const setLang = useCallback((newLang: SupportedLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem('phatphap_lang', newLang);
      document.documentElement.lang = newLang;
    } catch {}
  }, []);

  const t = useCallback(
    (text: string): string => {
      if (lang === 'vi' || !text) return text;
      const trimmed = text.trim();
      if (UI_DICT[lang]?.[trimmed]) {
        return UI_DICT[lang][trimmed];
      }
      if (translationCache[lang]?.[trimmed]) {
        return translationCache[lang][trimmed];
      }
      return text;
    },
    [lang]
  );

  // Intelligent DOM Text-Node Translator that preserves images, React tree, and Buddhist proper nouns
  const translateDOM = useCallback(async (targetLang: SupportedLang) => {
    if (typeof window === 'undefined' || !document.body) return;

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName.toLowerCase();
        if (['script', 'style', 'noscript', 'code', 'kbd', 'textarea', 'svg'].includes(tag)) {
          return NodeFilter.FILTER_REJECT;
        }
        if (parent.closest('[data-no-translate="true"]')) {
          return NodeFilter.FILTER_REJECT;
        }
        const val = node.nodeValue?.trim();
        if (!val || val.length < 2 || /^[0-9\s\W]+$/.test(val)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const textNodes: Text[] = [];
    let currentNode = walker.nextNode();
    while (currentNode) {
      textNodes.push(currentNode as Text);
      currentNode = walker.nextNode();
    }

    // Save original Vietnamese text on first encounter
    for (const node of textNodes) {
      if (!origTextMapRef.current.has(node)) {
        origTextMapRef.current.set(node, node.nodeValue || '');
      }
    }

    // If switching back to Vietnamese, restore immediately in 0ms
    if (targetLang === 'vi') {
      for (const node of textNodes) {
        const orig = origTextMapRef.current.get(node);
        if (orig !== undefined && node.nodeValue !== orig) {
          node.nodeValue = orig;
        }
      }
      return;
    }

    if (!translationCache[targetLang]) {
      translationCache[targetLang] = {};
      try {
        const savedCache = sessionStorage.getItem(`phatphap_i18n_cache_v2_${targetLang}`);
        if (savedCache) {
          translationCache[targetLang] = JSON.parse(savedCache);
        }
      } catch {}
    }

    const toFetchNodes: { node: Text; origTrimmed: string; leading: string; trailing: string }[] = [];

    for (const node of textNodes) {
      const origFull = origTextMapRef.current.get(node) || node.nodeValue || '';
      const origTrimmed = origFull.trim();
      if (!origTrimmed) continue;

      // Preserve exact sacred proper nouns if the entire text is just the proper noun
      if (PROTECTED_PROPER_NOUNS.includes(origTrimmed)) {
        continue;
      }

      const leadingMatch = origFull.match(/^\s*/);
      const trailingMatch = origFull.match(/\s*$/);
      const leading = leadingMatch ? leadingMatch[0] : '';
      const trailing = trailingMatch ? trailingMatch[0] : '';

      // 1. Check UI dictionary first (0ms)
      if (UI_DICT[targetLang]?.[origTrimmed]) {
        const translated = UI_DICT[targetLang][origTrimmed];
        if (node.nodeValue !== leading + translated + trailing) {
          node.nodeValue = leading + translated + trailing;
        }
        continue;
      }

      // 2. Check session cache
      if (translationCache[targetLang]?.[origTrimmed]) {
        const translated = translationCache[targetLang][origTrimmed];
        if (node.nodeValue !== leading + translated + trailing) {
          node.nodeValue = leading + translated + trailing;
        }
        continue;
      }

      toFetchNodes.push({ node, origTrimmed, leading, trailing });
    }

    if (toFetchNodes.length === 0) return;

    // Deduplicate strings to translate
    const uniqueStrings = Array.from(new Set(toFetchNodes.map((item) => item.origTrimmed)));

    // Batch translate in chunks of 25 strings to keep URLs short and fast
    setIsTranslating(true);
    const CHUNK_SIZE = 25;

    try {
      for (let i = 0; i < uniqueStrings.length; i += CHUNK_SIZE) {
        const chunk = uniqueStrings.slice(i, i + CHUNK_SIZE);
        const joined = chunk.join('\n');

        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=${targetLang}&dt=t&q=${encodeURIComponent(joined)}`;
        const res = await fetch(url);
        if (!res.ok) continue;

        const data = await res.json();
        if (Array.isArray(data?.[0])) {
          const fullTranslatedText = data[0].map((part: any) => part?.[0] || '').join('');
          const translatedLines = fullTranslatedText.split('\n');

          chunk.forEach((origStr, idx) => {
            const transStr = (translatedLines[idx] || origStr).trim();
            if (transStr) {
              translationCache[targetLang][origStr] = transStr;
            }
          });
        }
      }

      // Apply translations to DOM nodes
      for (const item of toFetchNodes) {
        const trans = translationCache[targetLang][item.origTrimmed];
        if (trans) {
          item.node.nodeValue = item.leading + trans + item.trailing;
        }
      }

      // Save cache to sessionStorage
      try {
        sessionStorage.setItem(
          `phatphap_i18n_cache_v2_${targetLang}`,
          JSON.stringify(translationCache[targetLang])
        );
      } catch {}
    } catch (err) {
      console.warn('Translation notice:', err);
    } finally {
      setIsTranslating(false);
    }
  }, []);

  // Trigger translation on language change, route change, or DOM mutation
  useEffect(() => {
    translateDOM(lang);

    if (lang === 'vi') return;

    const observer = new MutationObserver(() => {
      if (translateTimeoutRef.current) clearTimeout(translateTimeoutRef.current);
      translateTimeoutRef.current = setTimeout(() => {
        translateDOM(lang);
      }, 250);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      if (translateTimeoutRef.current) clearTimeout(translateTimeoutRef.current);
    };
  }, [lang, pathname, translateDOM]);

  const currentLanguage =
    BUDDHIST_LANGUAGES.find((l) => l.code === lang) || BUDDHIST_LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, currentLanguage, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
