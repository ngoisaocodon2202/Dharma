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

// Core UI Dictionary for instant 0ms translation of navigation, buttons & headers
export const UI_DICT: Record<SupportedLang, Record<string, string>> = {
  vi: {},
  en: {
    'Trang chủ': 'Home',
    'Học Phật': 'Dharma Study',
    'Lịch sử Phật giáo': 'Buddhist History',
    'Bài viết': 'Articles',
    'Pháp thoại': 'Dharma Talks',
    'Lộ trình học': 'Learning Path',
    'Tủ kinh sách': 'Sutras & Books',
    'Chùa & Tự viện': 'Temples',
    'Chùa & Địa danh': 'Temples & Sites',
    'Sự kiện & Khóa tu': 'Retreats & Events',
    'Tự viện & Tổ chức': 'Organizations',
    'Tu tập': 'Practice',
    'Phòng thiền': 'Meditation Room',
    'Thực hành': 'Daily Practice',
    'Lịch Vạn Niên': 'Buddhist Calendar',
    'Màu Hợp & Ngày Tốt': 'Lucky Colors & Days',
    'Màu Chủ Đạo': 'Lucky Colors',
    'AI Phật Pháp': 'Dharma AI',
    'Hỏi Đáp AI': 'Ask Dharma AI',
    'Tìm kiếm...': 'Search...',
    'Nhập Pháp Danh': 'Enter Dharma Name',
    'Định danh': 'Dharma Profile',
    'Đăng xuất': 'Sign Out',
    'Trang cá nhân': 'My Profile',
    'Hồ sơ': 'Profile',
    'Pháp âm': 'Audio',
    'Tất cả': 'All',
    'Tụng Kinh': 'Chanting',
    'Niệm Phật': 'Mindfulness',
    'Thắp Hương': 'Offer Incense',
    'Thắp hương': 'Incense',
    'Gõ Chuông': 'Ring Bell',
    'Chuỗi Hạt': 'Mala Beads',
    'Công Phu': 'Daily Routine',
    'Chùa Cổ Tự': 'Ancient Temples',
    'Minh Chú': 'Sacred Mantras',
    'Mới': 'New',
    'Hôm nay': 'Today',
  },
  zh: {
    'Trang chủ': '首页',
    'Học Phật': '学佛修心',
    'Lịch sử Phật giáo': '佛教历史',
    'Bài viết': '佛学文章',
    'Pháp thoại': '法音开示',
    'Lộ trình học': '修学路径',
    'Tủ kinh sách': '藏经阁',
    'Chùa & Tự viện': '寺院圣地',
    'Chùa & Địa danh': '古刹名胜',
    'Sự kiện & Khóa tu': '禅修法会',
    'Tự viện & Tổ chức': '佛教机构',
    'Tu tập': '日常修行',
    'Phòng thiền': '在线禅堂',
    'Thực hành': '每日功课',
    'Lịch Vạn Niên': '佛历纪念',
    'Màu Hợp & Ngày Tốt': '本命色与吉日',
    'Màu Chủ Đạo': '吉祥色彩',
    'AI Phật Pháp': '佛法AI问答',
    'Hỏi Đáp AI': '佛法AI',
    'Tìm kiếm...': '搜索...',
    'Nhập Pháp Danh': '输入法名',
    'Định danh': '佛子法名',
    'Đăng xuất': '退出',
    'Trang cá nhân': '个人中心',
    'Hồ sơ': '档案',
    'Pháp âm': '法音',
    'Tất cả': '全部',
    'Tụng Kinh': '诵经',
    'Niệm Phật': '念佛',
    'Thắp Hương': '敬香',
    'Thắp hương': '敬香',
    'Gõ Chuông': '鸣钟',
    'Chuỗi Hạt': '念珠',
    'Công Phu': '早晚功课',
    'Chùa Cổ Tự': '千年古刹',
    'Minh Chú': '真言陀罗尼',
    'Mới': '新',
    'Hôm nay': '今日',
  },
  th: {
    'Trang chủ': 'หน้าแรก',
    'Học Phật': 'ศึกษาธรรมะ',
    'Lịch sử Phật giáo': 'พุทธประวัติ',
    'Bài viết': 'บทความธรรมะ',
    'Pháp thoại': 'ธรรมบรรยาย',
    'Lộ trình học': 'เส้นทางศึกษาธรรม',
    'Tủ kinh sách': 'พระไตรปิฎก',
    'Chùa & Tự viện': 'วัดและศาสนสถาน',
    'Chùa & Địa danh': 'วัดสำคัญ',
    'Sự kiện & Khóa tu': 'ปฏิบัติธรรม',
    'Tự viện & Tổ chức': 'องค์กรพุทธ',
    'Tu tập': 'การปฏิบัติธรรม',
    'Phòng thiền': 'ห้องสมาธิ',
    'Thực hành': 'ข้อวัตรประจำวัน',
    'Lịch Vạn Niên': 'ปฏิทินวันพระ',
    'Màu Hợp & Ngày Tốt': 'สีมงคลและวันดี',
    'Màu Chủ Đạo': 'สีมงคล',
    'AI Phật Pháp': 'AI ถาม-ตอบธรรมะ',
    'Hỏi Đáp AI': 'ถาม AI ธรรมะ',
    'Tìm kiếm...': 'ค้นหา...',
    'Nhập Pháp Danh': 'ระบุฉายาธรรม',
    'Định danh': 'ข้อมูลผู้ปฏิบัติ',
    'Đăng xuất': 'ออกจากระบบ',
    'Trang cá nhân': 'โปรไฟล์',
    'Hồ sơ': 'โปรไฟล์',
    'Pháp âm': 'เสียงธรรม',
    'Tất cả': 'ทั้งหมด',
    'Tụng Kinh': 'สวดมนต์',
    'Niệm Phật': 'เจริญสติ',
    'Thắp Hương': 'จุดธูปบูชา',
    'Thắp hương': 'จุดธูป',
    'Gõ Chuông': 'ตีระฆัง',
    'Chuỗi Hạt': 'ลูกประคำ',
    'Công Phu': 'วัตรปฏิบัติ',
    'Chùa Cổ Tự': 'วัดโบราณ',
    'Minh Chú': 'มนตรา',
    'Mới': 'ใหม่',
    'Hôm nay': 'วันนี้',
  },
  ja: {
    'Trang chủ': 'ホーム',
    'Học Phật': '仏法を学ぶ',
    'Lịch sử Phật giáo': '仏教の歴史',
    'Bài viết': '法話・記事',
    'Pháp thoại': '法音・講話',
    'Lộ trình học': '学習コース',
    'Tủ kinh sách': '経典・仏書',
    'Chùa & Tự viện': '寺院・聖地',
    'Chùa & Địa danh': '古刹・名所',
    'Sự kiện & Khóa tu': '法要・禅会',
    'Tự viện & Tổ chức': '仏教団体',
    'Tu tập': '修行・実践',
    'Phòng thiền': 'オンライン禅堂',
    'Thực hành': '日々の実践',
    'Lịch Vạn Niên': '仏教暦・命日帳',
    'Màu Hợp & Ngày Tốt': '守護色と吉日',
    'Màu Chủ Đạo': '守護色・吉日',
    'AI Phật Pháp': '仏法AI問答',
    'Hỏi Đáp AI': '仏法AI',
    'Tìm kiếm...': '検索...',
    'Nhập Pháp Danh': '法名を入力',
    'Định danh': '法名登録',
    'Đăng xuất': 'ログアウト',
    'Trang cá nhân': 'マイページ',
    'Hồ sơ': 'プロフィール',
    'Pháp âm': '法音',
    'Tất cả': 'すべて',
    'Tụng Kinh': '読経',
    'Niệm Phật': '念仏',
    'Thắp Hương': '焼香',
    'Thắp hương': '焼香',
    'Gõ Chuông': '鐘を鳴らす',
    'Chuỗi Hạt': '数珠',
    'Công Phu': '日課',
    'Chùa Cổ Tự': '古刹巡礼',
    'Minh Chú': '真言・マントラ',
    'Mới': '新着',
    'Hôm nay': '今日',
  },
  ko: {
    'Trang chủ': '홈',
    'Học Phật': '불법 배움',
    'Lịch sử Phật giáo': '불교 역사',
    'Bài viết': '불교 칼럼',
    'Pháp thoại': '법문 오디오',
    'Lộ trình học': '수행 과정',
    'Tủ kinh sách': '경전 도서관',
    'Chùa & Tự viện': '사찰 및 성지',
    'Chùa & Địa danh': '전통 사찰',
    'Sự kiện & Khóa tu': '법회 및 템플스테이',
    'Tự viện & Tổ chức': '불교 단체',
    'Tu tập': '수행과 명상',
    'Phòng thiền': '온라인 선방',
    'Thực hành': '매일 수행',
    'Lịch Vạn Niên': '불교 달력·기일',
    'Màu Hợp & Ngày Tốt': '수호색 및 길일',
    'Màu Chủ Đạo': '수호색·길일',
    'AI Phật Pháp': '불법 AI 문답',
    'Hỏi Đáp AI': '불법 AI',
    'Tìm kiếm...': '검색...',
    'Nhập Pháp Danh': '법명 입력',
    'Định danh': '법명 설정',
    'Đăng xuất': '로그아웃',
    'Trang cá nhân': '내 정보',
    'Hồ sơ': '프로필',
    'Pháp âm': '법음',
    'Tất cả': '전체',
    'Tụng Kinh': '독경',
    'Niệm Phật': '염불',
    'Thắp Hương': '헌향',
    'Thắp hương': '헌향',
    'Gõ Chuông': '타종',
    'Chuỗi Hạt': '염주',
    'Công Phu': '일과 수행',
    'Chùa Cổ Tự': '고찰 순례',
    'Minh Chú': '진언·만트라',
    'Mới': '신규',
    'Hôm nay': '오늘',
  },
  hi: {
    'Trang chủ': 'मुख्य पृष्ठ',
    'Học Phật': 'धम्म शिक्षा',
    'Lịch sử Phật giáo': 'बौद्ध इतिहास',
    'Bài viết': 'धम्म लेख',
    'Pháp thoại': 'धम्म प्रवचन',
    'Lộ trình học': 'अध्ययन मार्ग',
    'Tủ kinh sách': 'त्रिपिटक ग्रंथ',
    'Chùa & Tự viện': 'विहार और तीर्थ',
    'Chùa & Địa danh': 'पवित्र तीर्थ',
    'Sự kiện & Khóa tu': 'ध्यान शिविर',
    'Tự viện & Tổ chức': 'बौद्ध संघ',
    'Tu tập': 'साधना',
    'Phòng thiền': 'ध्यान कक्ष',
    'Thực hành': 'दैनिक साधना',
    'Lịch Vạn Niên': 'बौद्ध पंचांग',
    'Màu Hợp & Ngày Tốt': 'शुभ रंग और तिथि',
    'Màu Chủ Đạo': 'शुभ रंग',
    'AI Phật Pháp': 'धम्म AI सहायक',
    'Hỏi Đáp AI': 'धम्म AI',
    'Tìm kiếm...': 'खोजें...',
    'Nhập Pháp Danh': 'धम्म नाम दर्ज करें',
    'Định danh': 'धम्म परिचय',
    'Đăng xuất': 'लॉग आउट',
    'Trang cá nhân': 'प्रोफ़ाइल',
    'Hồ sơ': 'प्रोफ़ाइल',
    'Pháp âm': 'धम्म वाणी',
    'Tất cả': 'सभी',
    'Tụng Kinh': 'सूत्र पाठ',
    'Niệm Phật': 'बुद्ध स्मरण',
    'Thắp Hương': 'धूप अर्पण',
    'Thắp hương': 'धूप',
    'Gõ Chuông': 'घंटी बजाएं',
    'Chuỗi Hạt': 'जप माला',
    'Công Phu': 'नित्य साधना',
    'Chùa Cổ Tự': 'प्राचीन विहार',
    'Minh Chú': 'पवित्र मंत्र',
    'Mới': 'नया',
    'Hôm nay': 'आज',
  },
};

// Sacred Buddhist Proper Nouns & Mantras that must remain untouched or respected
const PROTECTED_PROPER_NOUNS = [
  'Om Mani Padme Hum',
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
        const savedCache = sessionStorage.getItem(`phatphap_i18n_cache_${targetLang}`);
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
          `phatphap_i18n_cache_${targetLang}`,
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

