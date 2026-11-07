'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export type SupportedLang = string;
export type BuddhistLanguageCode = SupportedLang;

export type LanguageRegion =
  | 'Phật giáo & Châu Á'
  | 'Châu Âu'
  | 'Trung Đông & Trung Á'
  | 'Châu Mỹ & Đại Dương'
  | 'Châu Phi';

export interface LanguageOption {
  code: SupportedLang;
  name: string;
  nativeName: string;
  flag: string;
  country: string;
  countryCode: string; // ISO 3166-1 alpha-2 lowercase for crisp flag rendering
  region: LanguageRegion;
}

export const WORLD_LANGUAGES: LanguageOption[] = [
  // ================= 1. PHẬT GIÁO & CHÂU Á - THÁI BÌNH DƯƠNG =================
  { code: 'vi', name: 'Tiếng Việt', nativeName: 'Tiếng Việt', flag: '🇻🇳', country: 'Việt Nam', countryCode: 'vn', region: 'Phật giáo & Châu Á' },
  { code: 'en', name: 'Tiếng Anh', nativeName: 'English', flag: '🇬🇧', country: 'Quốc tế / Anh - Mỹ', countryCode: 'gb', region: 'Phật giáo & Châu Á' },
  { code: 'zh-CN', name: 'Tiếng Trung (Giản thể)', nativeName: '简体中文', flag: '🇨🇳', country: 'Trung Quốc / Singapore', countryCode: 'cn', region: 'Phật giáo & Châu Á' },
  { code: 'zh-TW', name: 'Tiếng Trung (Phồn thể)', nativeName: '繁體中文', flag: '🇹🇼', country: 'Đài Loan / Hồng Kông', countryCode: 'tw', region: 'Phật giáo & Châu Á' },
  { code: 'th', name: 'Tiếng Thái', nativeName: 'ไทย', flag: '🇹🇭', country: 'Thái Lan', countryCode: 'th', region: 'Phật giáo & Châu Á' },
  { code: 'ja', name: 'Tiếng Nhật', nativeName: '日本語', flag: '🇯🇵', country: 'Nhật Bản', countryCode: 'jp', region: 'Phật giáo & Châu Á' },
  { code: 'ko', name: 'Tiếng Hàn', nativeName: '한국어', flag: '🇰🇷', country: 'Hàn Quốc', countryCode: 'kr', region: 'Phật giáo & Châu Á' },
  { code: 'hi', name: 'Tiếng Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', country: 'Ấn Độ', countryCode: 'in', region: 'Phật giáo & Châu Á' },
  { code: 'sa', name: 'Tiếng Phạn (Sanskrit)', nativeName: 'संस्कृतम्', flag: '🇮🇳', country: 'Kinh điển Phật giáo Ấn Độ', countryCode: 'in', region: 'Phật giáo & Châu Á' },
  { code: 'bo', name: 'Tiếng Tây Tạng', nativeName: 'བོད་ཡིག', flag: '🇧🇹', country: 'Tây Tạng / Bhutan / Himalaya', countryCode: 'bt', region: 'Phật giáo & Châu Á' },
  { code: 'km', name: 'Tiếng Khmer', nativeName: 'ភាសាខ្មែរ', flag: '🇰🇭', country: 'Campuchia', countryCode: 'kh', region: 'Phật giáo & Châu Á' },
  { code: 'lo', name: 'Tiếng Lào', nativeName: 'ພາສາລາວ', flag: '🇱🇦', country: 'Lào', countryCode: 'la', region: 'Phật giáo & Châu Á' },
  { code: 'my', name: 'Tiếng Myanmar (Miến Điện)', nativeName: 'မြန်မာစာ', flag: '🇲🇲', country: 'Myanmar', countryCode: 'mm', region: 'Phật giáo & Châu Á' },
  { code: 'si', name: 'Tiếng Sinhala', nativeName: 'සිංහල', flag: '🇱🇰', country: 'Sri Lanka (Tích Lan)', countryCode: 'lk', region: 'Phật giáo & Châu Á' },
  { code: 'ne', name: 'Tiếng Nepal', nativeName: 'नेपाली', flag: '🇳🇵', country: 'Nepal (Lâm Tỳ Ni)', countryCode: 'np', region: 'Phật giáo & Châu Á' },
  { code: 'mn', name: 'Tiếng Mông Cổ', nativeName: 'Монгол', flag: '🇲🇳', country: 'Mông Cổ', countryCode: 'mn', region: 'Phật giáo & Châu Á' },
  { code: 'id', name: 'Tiếng Indonesia', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', country: 'Indonesia', countryCode: 'id', region: 'Phật giáo & Châu Á' },
  { code: 'ms', name: 'Tiếng Mã Lai', nativeName: 'Bahasa Melayu', flag: '🇲🇾', country: 'Malaysia / Brunei', countryCode: 'my', region: 'Phật giáo & Châu Á' },
  { code: 'tl', name: 'Tiếng Filipino (Tagalog)', nativeName: 'Filipino', flag: '🇵🇭', country: 'Philippines', countryCode: 'ph', region: 'Phật giáo & Châu Á' },
  { code: 'bn', name: 'Tiếng Bengal', nativeName: 'বাংলা', flag: '🇧🇩', country: 'Bangladesh / Ấn Độ', countryCode: 'bd', region: 'Phật giáo & Châu Á' },
  { code: 'ta', name: 'Tiếng Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', country: 'Ấn Độ / Sri Lanka / Singapore', countryCode: 'in', region: 'Phật giáo & Châu Á' },
  { code: 'te', name: 'Tiếng Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', country: 'Ấn Độ', countryCode: 'in', region: 'Phật giáo & Châu Á' },
  { code: 'mr', name: 'Tiếng Marathi', nativeName: 'मराठी', flag: '🇮🇳', country: 'Ấn Độ (Maharashtra)', countryCode: 'in', region: 'Phật giáo & Châu Á' },
  { code: 'gu', name: 'Tiếng Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', country: 'Ấn Độ (Gujarat)', countryCode: 'in', region: 'Phật giáo & Châu Á' },
  { code: 'kn', name: 'Tiếng Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', country: 'Ấn Độ (Karnataka)', countryCode: 'in', region: 'Phật giáo & Châu Á' },
  { code: 'ml', name: 'Tiếng Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', country: 'Ấn Độ (Kerala)', countryCode: 'in', region: 'Phật giáo & Châu Á' },
  { code: 'pa', name: 'Tiếng Punjab', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', country: 'Ấn Độ / Pakistan', countryCode: 'in', region: 'Phật giáo & Châu Á' },
  { code: 'or', name: 'Tiếng Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', country: 'Ấn Độ (Odisha)', countryCode: 'in', region: 'Phật giáo & Châu Á' },
  { code: 'as', name: 'Tiếng Assam', nativeName: 'অসমীয়া', flag: '🇮🇳', country: 'Ấn Độ (Assam)', countryCode: 'in', region: 'Phật giáo & Châu Á' },
  { code: 'mai', name: 'Tiếng Maithili', nativeName: 'मैथिली', flag: '🇮🇳', country: 'Ấn Độ / Nepal', countryCode: 'in', region: 'Phật giáo & Châu Á' },
  { code: 'bho', name: 'Tiếng Bhojpuri', nativeName: 'भोजपुरी', flag: '🇮🇳', country: 'Ấn Độ (Bihar / UP)', countryCode: 'in', region: 'Phật giáo & Châu Á' },
  { code: 'gom', name: 'Tiếng Konkani', nativeName: 'कोंकणी', flag: '🇮🇳', country: 'Ấn Độ (Goa)', countryCode: 'in', region: 'Phật giáo & Châu Á' },
  { code: 'doi', name: 'Tiếng Dogri', nativeName: 'डोगरी', flag: '🇮🇳', country: 'Ấn Độ (Jammu & Kashmir)', countryCode: 'in', region: 'Phật giáo & Châu Á' },
  { code: 'mni-Mtei', name: 'Tiếng Manipuri (Meitei)', nativeName: 'মৈতৈলোন্', flag: '🇮🇳', country: 'Ấn Độ (Manipur)', countryCode: 'in', region: 'Phật giáo & Châu Á' },
  { code: 'lus', name: 'Tiếng Mizo', nativeName: 'Mizo ṭawng', flag: '🇮🇳', country: 'Ấn Độ (Mizoram)', countryCode: 'in', region: 'Phật giáo & Châu Á' },
  { code: 'ur', name: 'Tiếng Urdu', nativeName: 'اردو', flag: '🇵🇰', country: 'Pakistan / Ấn Độ', countryCode: 'pk', region: 'Phật giáo & Châu Á' },
  { code: 'sd', name: 'Tiếng Sindhi', nativeName: 'سنڌي', flag: '🇵🇰', country: 'Pakistan / Ấn Độ', countryCode: 'pk', region: 'Phật giáo & Châu Á' },
  { code: 'dv', name: 'Tiếng Dhivehi', nativeName: 'ދިވެހި', flag: '🇲🇻', country: 'Maldives', countryCode: 'mv', region: 'Phật giáo & Châu Á' },
  { code: 'jv', name: 'Tiếng Java', nativeName: 'Basa Jawa', flag: '🇮🇩', country: 'Indonesia (Java)', countryCode: 'id', region: 'Phật giáo & Châu Á' },
  { code: 'su', name: 'Tiếng Sunda', nativeName: 'Basa Sunda', flag: '🇮🇩', country: 'Indonesia', countryCode: 'id', region: 'Phật giáo & Châu Á' },
  { code: 'ceb', name: 'Tiếng Cebuano', nativeName: 'Cebuano', flag: '🇵🇭', country: 'Philippines', countryCode: 'ph', region: 'Phật giáo & Châu Á' },
  { code: 'ilo', name: 'Tiếng Ilocano', nativeName: 'Iloko', flag: '🇵🇭', country: 'Philippines', countryCode: 'ph', region: 'Phật giáo & Châu Á' },
  { code: 'hmn', name: 'Tiếng H’Mông', nativeName: 'Hmoob', flag: '🇻🇳', country: 'Đông Nam Á / Quốc tế', countryCode: 'vn', region: 'Phật giáo & Châu Á' },

  // ================= 2. CHÂU ÂU =================
  { code: 'fr', name: 'Tiếng Pháp', nativeName: 'Français', flag: '🇫🇷', country: 'Pháp / Canada / Bỉ / Thụy Sĩ', countryCode: 'fr', region: 'Châu Âu' },
  { code: 'de', name: 'Tiếng Đức', nativeName: 'Deutsch', flag: '🇩🇪', country: 'Đức / Áo / Thụy Sĩ', countryCode: 'de', region: 'Châu Âu' },
  { code: 'es', name: 'Tiếng Tây Ban Nha', nativeName: 'Español', flag: '🇪🇸', country: 'Tây Ban Nha / Mỹ Latinh', countryCode: 'es', region: 'Châu Âu' },
  { code: 'pt', name: 'Tiếng Bồ Đào Nha', nativeName: 'Português', flag: '🇵🇹', country: 'Bồ Đào Nha / Brazil', countryCode: 'pt', region: 'Châu Âu' },
  { code: 'ru', name: 'Tiếng Nga', nativeName: 'Русский', flag: '🇷🇺', country: 'Liên bang Nga', countryCode: 'ru', region: 'Châu Âu' },
  { code: 'it', name: 'Tiếng Ý', nativeName: 'Italiano', flag: '🇮🇹', country: 'Ý / Thụy Sĩ', countryCode: 'it', region: 'Châu Âu' },
  { code: 'nl', name: 'Tiếng Hà Lan', nativeName: 'Nederlands', flag: '🇳🇱', country: 'Hà Lan / Bỉ', countryCode: 'nl', region: 'Châu Âu' },
  { code: 'pl', name: 'Tiếng Ba Lan', nativeName: 'Polski', flag: '🇵🇱', country: 'Ba Lan', countryCode: 'pl', region: 'Châu Âu' },
  { code: 'uk', name: 'Tiếng Ukraina', nativeName: 'Українська', flag: '🇺🇦', country: 'Ukraina', countryCode: 'ua', region: 'Châu Âu' },
  { code: 'cs', name: 'Tiếng Séc', nativeName: 'Čeština', flag: '🇨🇿', country: 'Cộng hòa Séc', countryCode: 'cz', region: 'Châu Âu' },
  { code: 'sv', name: 'Tiếng Thụy Điển', nativeName: 'Svenska', flag: '🇸🇪', country: 'Thụy Điển', countryCode: 'se', region: 'Châu Âu' },
  { code: 'no', name: 'Tiếng Na Uy', nativeName: 'Norsk', flag: '🇳🇴', country: 'Na Uy', countryCode: 'no', region: 'Châu Âu' },
  { code: 'da', name: 'Tiếng Đan Mạch', nativeName: 'Dansk', flag: '🇩🇰', country: 'Đan Mạch', countryCode: 'dk', region: 'Châu Âu' },
  { code: 'fi', name: 'Tiếng Phần Lan', nativeName: 'Suomi', flag: '🇫🇮', country: 'Phần Lan', countryCode: 'fi', region: 'Châu Âu' },
  { code: 'el', name: 'Tiếng Hy Lạp', nativeName: 'Ελληνικά', flag: '🇬🇷', country: 'Hy Lạp / Síp', countryCode: 'gr', region: 'Châu Âu' },
  { code: 'ro', name: 'Tiếng Romania', nativeName: 'Română', flag: '🇷🇴', country: 'Romania / Moldova', countryCode: 'ro', region: 'Châu Âu' },
  { code: 'hu', name: 'Tiếng Hungary', nativeName: 'Magyar', flag: '🇭🇺', country: 'Hungary', countryCode: 'hu', region: 'Châu Âu' },
  { code: 'bg', name: 'Tiếng Bulgaria', nativeName: 'Български', flag: '🇧🇬', country: 'Bulgaria', countryCode: 'bg', region: 'Châu Âu' },
  { code: 'sr', name: 'Tiếng Serbia', nativeName: 'Српски', flag: '🇷🇸', country: 'Serbia', countryCode: 'rs', region: 'Châu Âu' },
  { code: 'hr', name: 'Tiếng Croatia', nativeName: 'Hrvatski', flag: '🇭🇷', country: 'Croatia', countryCode: 'hr', region: 'Châu Âu' },
  { code: 'sk', name: 'Tiếng Slovakia', nativeName: 'Slovenčina', flag: '🇸🇰', country: 'Slovakia', countryCode: 'sk', region: 'Châu Âu' },
  { code: 'sl', name: 'Tiếng Slovenia', nativeName: 'Slovenščina', flag: '🇸🇮', country: 'Slovenia', countryCode: 'si', region: 'Châu Âu' },
  { code: 'lt', name: 'Tiếng Litva', nativeName: 'Lietuvių', flag: '🇱🇹', country: 'Litva', countryCode: 'lt', region: 'Châu Âu' },
  { code: 'lv', name: 'Tiếng Latvia', nativeName: 'Latviešu', flag: '🇱🇻', country: 'Latvia', countryCode: 'lv', region: 'Châu Âu' },
  { code: 'et', name: 'Tiếng Estonia', nativeName: 'Eesti', flag: '🇪🇪', country: 'Estonia', countryCode: 'ee', region: 'Châu Âu' },
  { code: 'be', name: 'Tiếng Belarus', nativeName: 'Беларуская', flag: '🇧🇾', country: 'Belarus', countryCode: 'by', region: 'Châu Âu' },
  { code: 'is', name: 'Tiếng Iceland', nativeName: 'Íslenska', flag: '🇮🇸', country: 'Iceland', countryCode: 'is', region: 'Châu Âu' },
  { code: 'ga', name: 'Tiếng Ireland', nativeName: 'Gaeilge', flag: '🇮🇪', country: 'Ireland', countryCode: 'ie', region: 'Châu Âu' },
  { code: 'cy', name: 'Tiếng Xứ Wales', nativeName: 'Cymraeg', flag: '🇬🇧', country: 'Xứ Wales (Vương quốc Anh)', countryCode: 'gb', region: 'Châu Âu' },
  { code: 'gd', name: 'Tiếng Gael Scotland', nativeName: 'Gàidhlig', flag: '🇬🇧', country: 'Scotland (Vương quốc Anh)', countryCode: 'gb', region: 'Châu Âu' },
  { code: 'mt', name: 'Tiếng Malta', nativeName: 'Malti', flag: '🇲🇹', country: 'Malta', countryCode: 'mt', region: 'Châu Âu' },
  { code: 'sq', name: 'Tiếng Albania', nativeName: 'Shqip', flag: '🇦🇱', country: 'Albania / Kosovo', countryCode: 'al', region: 'Châu Âu' },
  { code: 'mk', name: 'Tiếng Bắc Macedonia', nativeName: 'Македонски', flag: '🇲🇰', country: 'Bắc Macedonia', countryCode: 'mk', region: 'Châu Âu' },
  { code: 'bs', name: 'Tiếng Bosnia', nativeName: 'Bosanski', flag: '🇧🇦', country: 'Bosnia & Herzegovina', countryCode: 'ba', region: 'Châu Âu' },
  { code: 'lb', name: 'Tiếng Luxembourg', nativeName: 'Lëtzebuergesch', flag: '🇱🇺', country: 'Luxembourg', countryCode: 'lu', region: 'Châu Âu' },
  { code: 'ca', name: 'Tiếng Catalunya', nativeName: 'Català', flag: '🇦🇩', country: 'Andorra / Tây Ban Nha', countryCode: 'ad', region: 'Châu Âu' },
  { code: 'eu', name: 'Tiếng Basque', nativeName: 'Euskara', flag: '🇪🇸', country: 'Xứ Basque (Tây Ban Nha / Pháp)', countryCode: 'es', region: 'Châu Âu' },
  { code: 'gl', name: 'Tiếng Galicia', nativeName: 'Galego', flag: '🇪🇸', country: 'Galicia (Tây Ban Nha)', countryCode: 'es', region: 'Châu Âu' },
  { code: 'fy', name: 'Tiếng Frisia', nativeName: 'Frysk', flag: '🇳🇱', country: 'Hà Lan / Đức', countryCode: 'nl', region: 'Châu Âu' },
  { code: 'co', name: 'Tiếng Corsica', nativeName: 'Corsu', flag: '🇫🇷', country: 'Đảo Corsica (Pháp)', countryCode: 'fr', region: 'Châu Âu' },
  { code: 'la', name: 'Tiếng Latinh', nativeName: 'Latina', flag: '🇻🇦', country: 'Vatican / Cổ điển', countryCode: 'va', region: 'Châu Âu' },
  { code: 'eo', name: 'Quốc tế ngữ (Esperanto)', nativeName: 'Esperanto', flag: '🌍', country: 'Ngôn ngữ Quốc tế', countryCode: 'un', region: 'Châu Âu' },

  // ================= 3. TRUNG ĐÔNG, KAVKAZ & TRUNG Á =================
  { code: 'ar', name: 'Tiếng Ả Rập', nativeName: 'العربية', flag: '🇸🇦', country: 'Trung Đông / Bắc Phi', countryCode: 'sa', region: 'Trung Đông & Trung Á' },
  { code: 'tr', name: 'Tiếng Thổ Nhĩ Kỳ', nativeName: 'Türkçe', flag: '🇹🇷', country: 'Thổ Nhĩ Kỳ', countryCode: 'tr', region: 'Trung Đông & Trung Á' },
  { code: 'fa', name: 'Tiếng Ba Tư (Persian)', nativeName: 'فارسی', flag: '🇮🇷', country: 'Iran', countryCode: 'ir', region: 'Trung Đông & Trung Á' },
  { code: 'he', name: 'Tiếng Do Thái (Hebrew)', nativeName: 'עברית', flag: '🇮🇱', country: 'Israel', countryCode: 'il', region: 'Trung Đông & Trung Á' },
  { code: 'ps', name: 'Tiếng Pashto', nativeName: 'پښتو', flag: '🇦🇫', country: 'Afghanistan', countryCode: 'af', region: 'Trung Đông & Trung Á' },
  { code: 'ku', name: 'Tiếng Kurd (Kurmanji)', nativeName: 'Kurdî', flag: '🇮🇶', country: 'Trung Đông', countryCode: 'iq', region: 'Trung Đông & Trung Á' },
  { code: 'ckb', name: 'Tiếng Kurd (Sorani)', nativeName: 'کوردیی ناوەندی', flag: '🇮🇶', country: 'Iraq / Iran', countryCode: 'iq', region: 'Trung Đông & Trung Á' },
  { code: 'ka', name: 'Tiếng Gruzia (Georgia)', nativeName: 'ქართული', flag: '🇬🇪', country: 'Gruzia', countryCode: 'ge', region: 'Trung Đông & Trung Á' },
  { code: 'hy', name: 'Tiếng Armenia', nativeName: 'Հայերեն', flag: '🇦🇲', country: 'Armenia', countryCode: 'am', region: 'Trung Đông & Trung Á' },
  { code: 'az', name: 'Tiếng Azerbaijan', nativeName: 'Azərbaycan', flag: '🇦🇿', country: 'Azerbaijan', countryCode: 'az', region: 'Trung Đông & Trung Á' },
  { code: 'kk', name: 'Tiếng Kazakh', nativeName: 'Қазақ тілі', flag: '🇰🇿', country: 'Kazakhstan', countryCode: 'kz', region: 'Trung Đông & Trung Á' },
  { code: 'uz', name: 'Tiếng Uzbek', nativeName: 'Oʻzbekcha', flag: '🇺🇿', country: 'Uzbekistan', countryCode: 'uz', region: 'Trung Đông & Trung Á' },
  { code: 'ky', name: 'Tiếng Kyrgyz', nativeName: 'Кыргызча', flag: '🇰🇬', country: 'Kyrgyzstan', countryCode: 'kg', region: 'Trung Đông & Trung Á' },
  { code: 'tg', name: 'Tiếng Tajik', nativeName: 'Тоҷикӣ', flag: '🇹🇯', country: 'Tajikistan', countryCode: 'tj', region: 'Trung Đông & Trung Á' },
  { code: 'tk', name: 'Tiếng Turkmen', nativeName: 'Türkmençe', flag: '🇹🇲', country: 'Turkmenistan', countryCode: 'tm', region: 'Trung Đông & Trung Á' },
  { code: 'ug', name: 'Tiếng Duy Ngô Nhĩ', nativeName: 'ئۇيغۇرچە', flag: '🇨🇳', country: 'Trung Á', countryCode: 'cn', region: 'Trung Đông & Trung Á' },
  { code: 'yi', name: 'Tiếng Yiddish', nativeName: 'ייִדיש', flag: '🇮🇱', country: 'Quốc tế', countryCode: 'il', region: 'Trung Đông & Trung Á' },

  // ================= 4. CHÂU MỸ & CHÂU ĐẠI DƯƠNG =================
  { code: 'mi', name: 'Tiếng Maori', nativeName: 'Te Reo Māori', flag: '🇳🇿', country: 'New Zealand', countryCode: 'nz', region: 'Châu Mỹ & Đại Dương' },
  { code: 'haw', name: 'Tiếng Hawaii', nativeName: 'ʻŌlelo Hawaiʻi', flag: '🇺🇸', country: 'Hawaii (Hoa Kỳ)', countryCode: 'us', region: 'Châu Mỹ & Đại Dương' },
  { code: 'sm', name: 'Tiếng Samoa', nativeName: 'Gagana Sāmoa', flag: '🇼🇸', country: 'Samoa', countryCode: 'ws', region: 'Châu Mỹ & Đại Dương' },
  { code: 'ht', name: 'Tiếng Creole Haiti', nativeName: 'Kreyòl Ayisyen', flag: '🇭🇹', country: 'Haiti', countryCode: 'ht', region: 'Châu Mỹ & Đại Dương' },
  { code: 'qu', name: 'Tiếng Quechua', nativeName: 'Runasimi', flag: '🇵🇪', country: 'Peru / Bolivia / Ecuador', countryCode: 'pe', region: 'Châu Mỹ & Đại Dương' },
  { code: 'ay', name: 'Tiếng Aymara', nativeName: 'Aymar aru', flag: '🇧🇴', country: 'Bolivia / Peru', countryCode: 'bo', region: 'Châu Mỹ & Đại Dương' },
  { code: 'gn', name: 'Tiếng Guarani', nativeName: 'Avañeʼẽ', flag: '🇵🇾', country: 'Paraguay', countryCode: 'py', region: 'Châu Mỹ & Đại Dương' },

  // ================= 5. CHÂU PHI =================
  { code: 'sw', name: 'Tiếng Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', country: 'Kenya / Tanzania / Đông Phi', countryCode: 'ke', region: 'Châu Phi' },
  { code: 'af', name: 'Tiếng Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦', country: 'Nam Phi / Namibia', countryCode: 'za', region: 'Châu Phi' },
  { code: 'am', name: 'Tiếng Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', country: 'Ethiopia', countryCode: 'et', region: 'Châu Phi' },
  { code: 'ha', name: 'Tiếng Hausa', nativeName: 'Hausa', flag: '🇳🇬', country: 'Nigeria / Tây Phi', countryCode: 'ng', region: 'Châu Phi' },
  { code: 'yo', name: 'Tiếng Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬', country: 'Nigeria / Tây Phi', countryCode: 'ng', region: 'Châu Phi' },
  { code: 'ig', name: 'Tiếng Igbo', nativeName: 'Ásụ̀sụ́ Ìgbò', flag: '🇳🇬', country: 'Nigeria', countryCode: 'ng', region: 'Châu Phi' },
  { code: 'zu', name: 'Tiếng Zulu', nativeName: 'isiZulu', flag: '🇿🇦', country: 'Nam Phi', countryCode: 'za', region: 'Châu Phi' },
  { code: 'xh', name: 'Tiếng Xhosa', nativeName: 'isiXhosa', flag: '🇿🇦', country: 'Nam Phi', countryCode: 'za', region: 'Châu Phi' },
  { code: 'so', name: 'Tiếng Somali', nativeName: 'Soomaali', flag: '🇸🇴', country: 'Somalia', countryCode: 'so', region: 'Châu Phi' },
  { code: 'mg', name: 'Tiếng Malagasy', nativeName: 'Malagasy', flag: '🇲🇬', country: 'Madagascar', countryCode: 'mg', region: 'Châu Phi' },
  { code: 'rw', name: 'Tiếng Kinyarwanda', nativeName: 'Ikinyarwanda', flag: '🇷🇼', country: 'Rwanda', countryCode: 'rw', region: 'Châu Phi' },
  { code: 'sn', name: 'Tiếng Shona', nativeName: 'chiShona', flag: '🇿🇼', country: 'Zimbabwe', countryCode: 'zw', region: 'Châu Phi' },
  { code: 'ny', name: 'Tiếng Chichewa', nativeName: 'Chichewa', flag: '🇲🇼', country: 'Malawi / Zambia', countryCode: 'mw', region: 'Châu Phi' },
  { code: 'st', name: 'Tiếng Sesotho', nativeName: 'Sesotho', flag: '🇱🇸', country: 'Lesotho / Nam Phi', countryCode: 'ls', region: 'Châu Phi' },
  { code: 'nso', name: 'Tiếng Sepedi', nativeName: 'Sepedi', flag: '🇿🇦', country: 'Nam Phi', countryCode: 'za', region: 'Châu Phi' },
  { code: 'ts', name: 'Tiếng Tsonga', nativeName: 'Xitsonga', flag: '🇿🇦', country: 'Nam Phi / Mozambique', countryCode: 'za', region: 'Châu Phi' },
  { code: 'ak', name: 'Tiếng Twi (Akan)', nativeName: 'Twi', flag: '🇬🇭', country: 'Ghana', countryCode: 'gh', region: 'Châu Phi' },
  { code: 'ee', name: 'Tiếng Ewe', nativeName: 'Eʋegbe', flag: '🇬🇭', country: 'Ghana / Togo', countryCode: 'gh', region: 'Châu Phi' },
  { code: 'bm', name: 'Tiếng Bambara', nativeName: 'Bamanankan', flag: '🇲🇱', country: 'Mali', countryCode: 'ml', region: 'Châu Phi' },
  { code: 'ln', name: 'Tiếng Lingala', nativeName: 'Lingála', flag: '🇨🇩', country: 'CHDC Congo / Congo', countryCode: 'cd', region: 'Châu Phi' },
  { code: 'lg', name: 'Tiếng Luganda', nativeName: 'Luganda', flag: '🇺🇬', country: 'Uganda', countryCode: 'ug', region: 'Châu Phi' },
  { code: 'om', name: 'Tiếng Oromo', nativeName: 'Afaan Oromoo', flag: '🇪🇹', country: 'Ethiopia / Kenya', countryCode: 'et', region: 'Châu Phi' },
  { code: 'ti', name: 'Tiếng Tigrinya', nativeName: 'ትግርኛ', flag: '🇪🇷', country: 'Eritrea / Ethiopia', countryCode: 'er', region: 'Châu Phi' },
  { code: 'kri', name: 'Tiếng Krio', nativeName: 'Krio', flag: '🇸🇱', country: 'Sierra Leone', countryCode: 'sl', region: 'Châu Phi' },
];

export const BUDDHIST_LANGUAGES = WORLD_LANGUAGES;

// Core UI Dictionary for instant 0ms concise translation on popular languages
export const UI_DICT: Record<string, Record<string, string>> = {
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
    'Cầu Nguyện': 'Prayers',
    'Cầu Nguyện Online': 'Online Sanctuary',
    'Đi Chùa Online': 'Online Temple',
    'Món Chay': 'Vegan Recipes',
    'Sớ Cầu An': 'Prayer Scroll',
    'Từ Điển Phật': 'Dictionary',
    'Vườn Sen': 'Lotus Garden',
    'AI Phật Pháp': 'Dharma AI',
    'AI Pháp': 'Dharma AI',
    'Hỏi Đáp AI': 'Dharma AI',
    'Tìm kiếm...': 'Search...',
    '☸ Nhập Pháp Danh': '☸ Dharma Name',
    'Nhập Pháp Danh': 'Dharma Name',
    'Định danh': 'Dharma Profile',
    'Đăng xuất': 'Sign Out',
    'Tất cả': 'All',
    'Tụng Kinh': 'Chanting',
    'Đọc Kinh': 'Read Sutra',
    'Niệm Phật': 'Recitation',
    'Lạy Phật': 'Prostration',
    'Tọa Thiền': 'Meditation',
    'Trì Chú': 'Mantra',
    'Thắp Hương': 'Incense',
    'Thắp Nhang': 'Light Incense',
    'Thỉnh Chuông': 'Ring Bell',
    'Gõ Chuông': 'Ring Bell',
    'Chùa Cổ Tự': 'Temples',
    'Mới': 'New',
    'Hôm nay': 'Today',
  },
};

// Sacred Mantras & Proper Nouns that must ALWAYS remain untouched (never translated literally)
const PROTECTED_EXACT_PROPER_NOUNS: string[] = [
  'Bồ Đề Tâm',
  'PhatPhap.vn',
  '@phatphap.ai',
  'Om Mani Padme Hum',
  'Oṃ Maṇi Padme Hūṃ',
  'Oṃ Āḥ Hūṃ Vajra Guru Padma Siddhi Hūṃ',
  'Om Ah Hum Vajra Guru Padma Siddhi Hum',
  'Mahā Karuṇā Dhāraṇī',
  'Bhaiṣajyaguru Dhāraṇī',
  'Gate Gate Paragate Parasamgate Bodhi Svaha',
  'Namo Tassa Bhagavato Arahato Sammāsambuddhassa',
  'Thích Nhất Hạnh',
  'Thích Pháp Hòa',
  'Thích Minh Niệm',
  'Thích Minh Châu',
  'Thích Thanh Từ',
  'Thích Thiện Hoa',
  'Thích Trí Tịnh',
  'Thích Tâm Trường',
  'Thích Nhật Quang',
  'Thích Thiện Thuận',
  'Thích Trí Quảng',
  'Thích Chân Tính',
  'Thích Giác Khang',
  'Thích Tuệ Hải',
  'Thích Pháp Đăng',
  'Trần Nhân Tông',
  'Lý Thái Tổ',
  'Lý Thánh Tông',
  'Trần Thái Tông',
  'Tuệ Trung Thượng Sĩ',
  'Pháp Loa',
  'Huyền Quang',
  'Trúc Lâm Yên Tử',
  'Siddhartha Gautama',
  'Ajahn Chah',
  'Dalai Lama',
  'Ashoka',
  'Ananda',
  'Sariputta',
  'Moggallana',
  'Nagarjuna',
  'Bodhidharma',
  'Kumarajiva',
  'Xuanzang',
  'Thiên Mụ',
  'Bái Đính',
  'Tam Chúc',
  'Vĩnh Nghiêm',
  'Hoằng Pháp',
  'Từ Đàm',
  'Ấn Quang',
  'Xá Lợi',
  'Quán Sứ',
  'Trấn Quốc',
  'Tây Phương',
  'Bút Tháp',
  'Linh Ứng',
  'Huệ Nghiêm',
  'Phổ Quang',
  'Luy Lâu',
];

// Regex matching any Vietnamese monastic proper name: "Thích + Capitalized Name" (excluding "Thích Ca" which is Shakyamuni Buddha)
const MONASTIC_NAME_REGEX =
  /\bThích\s+(?!Ca\b)[A-ZĐÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ][a-zđàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]+(?:\s+[A-ZĐÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ][a-zđàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]+){0,2}\b/g;

function getDynamicProperNouns(): string[] {
  const list = [...PROTECTED_EXACT_PROPER_NOUNS];
  if (typeof window !== 'undefined') {
    try {
      const rawUser = localStorage.getItem('phatphap_local_user_v1');
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        if (parsed?.full_name && parsed.full_name.trim().length >= 2) {
          list.push(parsed.full_name.trim());
        }
        if (parsed?.dharma_name && parsed.dharma_name.trim().length >= 2) {
          list.push(parsed.dharma_name.trim());
        }
      }
    } catch {}
  }
  // Sort longest first so longer phrases match before shorter substrings
  return list.sort((a, b) => b.length - a.length);
}

/**
 * Masks proper nouns in a text string with {{0}}, {{1}} placeholders before machine translation,
 * and returns a restore function so proper nouns remain 100% intact in all languages.
 */
function maskProperNouns(text: string): {
  maskedText: string;
  isPureProperNoun: boolean;
  restore: (translated: string) => string;
} {
  const properNouns = getDynamicProperNouns();
  const tokens: string[] = [];

  // Check if entire text is an exact proper noun
  if (properNouns.some((pn) => pn.toLowerCase() === text.toLowerCase())) {
    return {
      maskedText: text,
      isPureProperNoun: true,
      restore: () => text,
    };
  }

  let working = text;

  // 1. Mask any monastic name "Thích [Name]"
  working = working.replace(MONASTIC_NAME_REGEX, (match) => {
    const idx = tokens.length;
    tokens.push(match);
    return `{{${idx}}}`;
  });

  // 2. Mask known proper nouns
  for (const pn of properNouns) {
    if (!pn || !working.includes(pn)) continue;
    const escaped = pn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'g');
    working = working.replace(regex, (match) => {
      const idx = tokens.length;
      tokens.push(match);
      return `{{${idx}}}`;
    });
  }

  // If the entire string became just a single placeholder like "{{0}}", it's a pure proper noun
  if (/^\{\{\d+\}\}$/.test(working.trim())) {
    return {
      maskedText: text,
      isPureProperNoun: true,
      restore: () => text,
    };
  }

  return {
    maskedText: working,
    isPureProperNoun: false,
    restore: (translated: string) => {
      if (tokens.length === 0) return translated;
      return translated.replace(/\{\{\s*(\d+)\s*\}\}/g, (full, numStr) => {
        const idx = parseInt(numStr, 10);
        return tokens[idx] !== undefined ? tokens[idx] : full;
      });
    },
  };
}

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
  currentLanguage: WORLD_LANGUAGES[0],
  isTranslating: false,
});

// Global memory cache for translated segments: translationCache[targetLang][normalizedViText] = translatedText
const translationCache: Record<string, Record<string, string>> = {};

function normalizeKey(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<SupportedLang>('vi');
  const [isTranslating, setIsTranslating] = useState(false);
  const pathname = usePathname();

  // WeakMaps to track original Vietnamese text and the last text applied by our translator
  const origTextMapRef = useRef<WeakMap<Text, string>>(new WeakMap());
  const lastAppliedTextRef = useRef<WeakMap<Text, string>>(new WeakMap());
  const origAttrMapRef = useRef<WeakMap<Element, { placeholder?: string; title?: string }>>(new WeakMap());
  const origDocTitleRef = useRef<string>('');
  const translateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeRunIdRef = useRef<number>(0);

  useEffect(() => {
    try {
      let saved = localStorage.getItem('phatphap_lang');
      if (saved === 'zh') saved = 'zh-CN'; // Migrate legacy 'zh' code to 'zh-CN'
      if (saved && WORLD_LANGUAGES.some((l) => l.code === saved)) {
        setLangState(saved);
        document.documentElement.lang = saved;
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
    const normalizedLang = newLang === 'zh' ? 'zh-CN' : newLang;
    setLangState(normalizedLang);
    try {
      localStorage.setItem('phatphap_lang', normalizedLang);
      document.documentElement.lang = normalizedLang;
    } catch {}
  }, []);

  const t = useCallback(
    (text: string): string => {
      if (lang === 'vi' || !text) return text;
      const key = normalizeKey(text);
      if (UI_DICT[lang]?.[key]) {
        return UI_DICT[lang][key];
      }
      if (translationCache[lang]?.[key]) {
        return translationCache[lang][key];
      }
      return text;
    },
    [lang]
  );

  // Translate a batch of masked strings using fast client-side GTX endpoint with server API & single-item fallbacks
  const fetchBatchTranslations = useCallback(
    async (maskedStrings: string[], targetLang: SupportedLang): Promise<string[]> => {
      if (maskedStrings.length === 0) return [];

      const joined = maskedStrings.join('\n');
      const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=${encodeURIComponent(
        targetLang
      )}&dt=t&q=${encodeURIComponent(joined)}`;

      try {
        const res = await fetch(gtxUrl);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data?.[0])) {
            const fullText = data[0].map((part: any) => part?.[0] || '').join('');
            const lines = fullText.split('\n');
            if (lines.length === maskedStrings.length) {
              return lines.map((line: string, idx: number) => line.trim() || maskedStrings[idx]);
            }
          }
        }
      } catch {
        // Fallback to server API below
      }

      // Fallback 1: Server-side /api/translate POST route (no URL length limit)
      try {
        const apiRes = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            texts: maskedStrings,
            targetLang,
            sourceLang: 'vi',
          }),
        });
        if (apiRes.ok) {
          const apiData = await apiRes.json();
          if (Array.isArray(apiData?.translations) && apiData.translations.length === maskedStrings.length) {
            return apiData.translations;
          }
        }
      } catch {
        // Fallback to individual client fetches below
      }

      // Fallback 2: Translate each string individually so line breaks never mismatch
      return Promise.all(
        maskedStrings.map(async (singleStr) => {
          try {
            const singleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=${encodeURIComponent(
              targetLang
            )}&dt=t&q=${encodeURIComponent(singleStr)}`;
            const r = await fetch(singleUrl);
            if (!r.ok) return singleStr;
            const d = await r.json();
            if (Array.isArray(d?.[0])) {
              return d[0].map((p: any) => p?.[0] || '').join('').trim() || singleStr;
            }
            return singleStr;
          } catch {
            return singleStr;
          }
        })
      );
    },
    []
  );

  // Intelligent Full-Website DOM & Attribute Translator
  const translateDOM = useCallback(
    async (targetLang: SupportedLang) => {
      if (typeof window === 'undefined' || !document.body) return;

      const currentRunId = ++activeRunIdRef.current;

      // 1. Collect all translatable Text nodes in document.body
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          const textNode = node as Text;
          const parent = textNode.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;

          const tag = parent.tagName.toLowerCase();
          if (['script', 'style', 'noscript', 'code', 'kbd', 'svg', 'math'].includes(tag)) {
            return NodeFilter.FILTER_REJECT;
          }
          if (parent.closest('[data-no-translate="true"], [translate="no"]')) {
            return NodeFilter.FILTER_REJECT;
          }

          // Always accept nodes we have already tracked so we can restore or re-translate them
          if (origTextMapRef.current.has(textNode)) {
            return NodeFilter.FILTER_ACCEPT;
          }

          const val = textNode.nodeValue?.trim();
          if (!val) return NodeFilter.FILTER_REJECT;

          // Ignore font-size control labels like "A+", "A-" or strings without any Unicode letters
          if (/^A[+-]?$/.test(val) || !/\p{L}/u.test(val)) {
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

      // 2. Collect all elements with placeholder or title attributes
      const attrElements = Array.from(
        document.body.querySelectorAll('input[placeholder], textarea[placeholder], [title]')
      ).filter((el) => !el.closest('[data-no-translate="true"], [translate="no"]'));

      // Save original document.title once
      if (!origDocTitleRef.current && document.title) {
        origDocTitleRef.current = document.title;
      }

      // 3. Synchronize original Vietnamese text (detecting any fresh updates made by React)
      for (const node of textNodes) {
        const currentVal = node.nodeValue || '';
        const lastApplied = lastAppliedTextRef.current.get(node);
        if (!origTextMapRef.current.has(node) || (lastApplied !== undefined && currentVal !== lastApplied)) {
          origTextMapRef.current.set(node, currentVal);
        }
      }

      for (const el of attrElements) {
        if (!origAttrMapRef.current.has(el)) {
          origAttrMapRef.current.set(el, {
            placeholder: el.getAttribute('placeholder') || undefined,
            title: el.getAttribute('title') || undefined,
          });
        }
      }

      // 4. If switching back to Vietnamese ('vi'), restore everything in 0ms
      if (targetLang === 'vi') {
        for (const node of textNodes) {
          const orig = origTextMapRef.current.get(node);
          if (orig !== undefined && node.nodeValue !== orig) {
            node.nodeValue = orig;
            lastAppliedTextRef.current.set(node, orig);
          }
        }
        for (const el of attrElements) {
          const origAttr = origAttrMapRef.current.get(el);
          if (origAttr?.placeholder) el.setAttribute('placeholder', origAttr.placeholder);
          if (origAttr?.title) el.setAttribute('title', origAttr.title);
        }
        if (origDocTitleRef.current) {
          document.title = origDocTitleRef.current;
        }
        setIsTranslating(false);
        return;
      }

      // 5. Initialize cache for targetLang from sessionStorage
      if (!translationCache[targetLang]) {
        translationCache[targetLang] = {};
        try {
          const savedCache = sessionStorage.getItem(`phatphap_i18n_cache_v3_${targetLang}`);
          if (savedCache) {
            translationCache[targetLang] = JSON.parse(savedCache);
          }
        } catch {}
      }

      interface PendingNodeItem {
        node: Text;
        key: string;
        leading: string;
        trailing: string;
      }

      interface PendingAttrItem {
        el: Element;
        attrName: 'placeholder' | 'title';
        key: string;
      }

      const toFetchNodes: PendingNodeItem[] = [];
      const toFetchAttrs: PendingAttrItem[] = [];

      // Apply cached / dictionary translations immediately & queue uncached strings
      for (const node of textNodes) {
        const origFull = origTextMapRef.current.get(node) || node.nodeValue || '';
        const key = normalizeKey(origFull);
        if (!key || !/\p{L}/u.test(key)) continue;

        const leadingMatch = origFull.match(/^\s*/);
        const trailingMatch = origFull.match(/\s*$/);
        const leading = leadingMatch ? leadingMatch[0] : '';
        const trailing = trailingMatch ? trailingMatch[0] : '';

        // Check UI dictionary (0ms)
        if (UI_DICT[targetLang]?.[key]) {
          const applied = leading + UI_DICT[targetLang][key] + trailing;
          if (node.nodeValue !== applied) node.nodeValue = applied;
          lastAppliedTextRef.current.set(node, applied);
          continue;
        }

        // Check memory/session cache (0ms)
        if (translationCache[targetLang]?.[key]) {
          const applied = leading + translationCache[targetLang][key] + trailing;
          if (node.nodeValue !== applied) node.nodeValue = applied;
          lastAppliedTextRef.current.set(node, applied);
          continue;
        }

        toFetchNodes.push({ node, key, leading, trailing });
      }

      for (const el of attrElements) {
        const origAttr = origAttrMapRef.current.get(el);
        if (origAttr?.placeholder) {
          const key = normalizeKey(origAttr.placeholder);
          if (key && /\p{L}/u.test(key)) {
            const cached = UI_DICT[targetLang]?.[key] || translationCache[targetLang]?.[key];
            if (cached) {
              el.setAttribute('placeholder', cached);
            } else {
              toFetchAttrs.push({ el, attrName: 'placeholder', key });
            }
          }
        }
        if (origAttr?.title) {
          const key = normalizeKey(origAttr.title);
          if (key && /\p{L}/u.test(key)) {
            const cached = UI_DICT[targetLang]?.[key] || translationCache[targetLang]?.[key];
            if (cached) {
              el.setAttribute('title', cached);
            } else {
              toFetchAttrs.push({ el, attrName: 'title', key });
            }
          }
        }
      }

      // Check document.title
      const docTitleKey = origDocTitleRef.current ? normalizeKey(origDocTitleRef.current) : '';
      let needDocTitleFetch = false;
      if (docTitleKey) {
        const cachedTitle = UI_DICT[targetLang]?.[docTitleKey] || translationCache[targetLang]?.[docTitleKey];
        if (cachedTitle) {
          document.title = cachedTitle;
        } else {
          needDocTitleFetch = true;
        }
      }

      // Collect unique keys to translate
      const uniqueKeysSet = new Set<string>();
      toFetchNodes.forEach((item) => uniqueKeysSet.add(item.key));
      toFetchAttrs.forEach((item) => uniqueKeysSet.add(item.key));
      if (needDocTitleFetch && docTitleKey) uniqueKeysSet.add(docTitleKey);

      const allUniqueKeys = Array.from(uniqueKeysSet);
      if (allUniqueKeys.length === 0) return;

      // Filter out pure proper nouns immediately (preserve them 100% intact)
      const maskRegistry = new Map<
        string,
        { maskedText: string; restore: (translated: string) => string }
      >();
      const keysRequiringNetwork: string[] = [];

      for (const key of allUniqueKeys) {
        const masked = maskProperNouns(key);
        if (masked.isPureProperNoun) {
          translationCache[targetLang][key] = key;
        } else {
          maskRegistry.set(key, { maskedText: masked.maskedText, restore: masked.restore });
          keysRequiringNetwork.push(key);
        }
      }

      // Apply any pure proper nouns right away
      if (keysRequiringNetwork.length === 0) return;

      // Build character-aware batches (max 12 strings or 850 characters per batch so GET URLs never overflow)
      const batches: string[][] = [];
      let currentBatch: string[] = [];
      let currentChars = 0;

      for (const key of keysRequiringNetwork) {
        const len = key.length;
        if (currentBatch.length >= 12 || (currentBatch.length > 0 && currentChars + len > 850)) {
          batches.push(currentBatch);
          currentBatch = [key];
          currentChars = len;
        } else {
          currentBatch.push(key);
          currentChars += len;
        }
      }
      if (currentBatch.length > 0) {
        batches.push(currentBatch);
      }

      setIsTranslating(true);

      const applyKeyTranslationsToDOM = (translatedKeysSet: Set<string>) => {
        if (activeRunIdRef.current !== currentRunId) return;

        for (const item of toFetchNodes) {
          if (!translatedKeysSet.has(item.key)) continue;
          const trans = translationCache[targetLang]?.[item.key];
          if (trans) {
            const applied = item.leading + trans + item.trailing;
            if (item.node.nodeValue !== applied) {
              item.node.nodeValue = applied;
            }
            lastAppliedTextRef.current.set(item.node, applied);
          }
        }

        for (const attrItem of toFetchAttrs) {
          if (!translatedKeysSet.has(attrItem.key)) continue;
          const trans = translationCache[targetLang]?.[attrItem.key];
          if (trans) {
            attrItem.el.setAttribute(attrItem.attrName, trans);
          }
        }

        if (needDocTitleFetch && docTitleKey && translatedKeysSet.has(docTitleKey)) {
          const transTitle = translationCache[targetLang]?.[docTitleKey];
          if (transTitle) {
            document.title = transTitle;
          }
        }
      };

      try {
        // Process up to 3 batches concurrently for fast progressive rendering
        const CONCURRENCY = 3;
        for (let i = 0; i < batches.length; i += CONCURRENCY) {
          if (activeRunIdRef.current !== currentRunId) break;

          const slice = batches.slice(i, i + CONCURRENCY);
          await Promise.all(
            slice.map(async (batchKeys) => {
              const maskedList = batchKeys.map((k) => maskRegistry.get(k)?.maskedText || k);
              const rawTranslatedList = await fetchBatchTranslations(maskedList, targetLang);

              if (activeRunIdRef.current !== currentRunId) return;

              const completedKeys = new Set<string>();
              batchKeys.forEach((origKey, idx) => {
                const rawTrans = rawTranslatedList[idx] || origKey;
                const maskInfo = maskRegistry.get(origKey);
                const finalTrans = maskInfo ? maskInfo.restore(rawTrans) : rawTrans;
                translationCache[targetLang][origKey] = finalTrans;
                completedKeys.add(origKey);
              });

              applyKeyTranslationsToDOM(completedKeys);
            })
          );
        }

        // Persist updated cache for targetLang
        try {
          sessionStorage.setItem(
            `phatphap_i18n_cache_v3_${targetLang}`,
            JSON.stringify(translationCache[targetLang])
          );
        } catch {}
      } catch (err) {
        console.warn('Translation notice:', err);
      } finally {
        if (activeRunIdRef.current === currentRunId) {
          setIsTranslating(false);
        }
      }
    },
    [fetchBatchTranslations]
  );

  // Trigger translation on language change, route change, or external DOM mutation
  useEffect(() => {
    translateDOM(lang);

    if (lang === 'vi') return;

    const observer = new MutationObserver((mutations) => {
      // Ignore mutations that were caused solely by our own translator updating text nodes
      let hasExternalMutation = false;
      for (const m of mutations) {
        if (m.type === 'childList' && m.addedNodes.length > 0) {
          hasExternalMutation = true;
          break;
        }
        if (m.type === 'characterData') {
          const targetNode = m.target as Text;
          if (targetNode.nodeValue !== lastAppliedTextRef.current.get(targetNode)) {
            hasExternalMutation = true;
            break;
          }
        }
      }

      if (!hasExternalMutation) return;

      if (translateTimeoutRef.current) clearTimeout(translateTimeoutRef.current);
      translateTimeoutRef.current = setTimeout(() => {
        translateDOM(lang);
      }, 180);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
      if (translateTimeoutRef.current) clearTimeout(translateTimeoutRef.current);
    };
  }, [lang, pathname, translateDOM]);

  const currentLanguage =
    WORLD_LANGUAGES.find((l) => l.code === lang) || WORLD_LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, currentLanguage, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
