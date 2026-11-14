export interface MantraCue {
  text: string;
  atSec: number;
  displayIndex: number;
}

export interface BonTonMantraAudio {
  audioUrl: string;
  durationSec: number;
  sanskritLine: string;
  phoneticLine: string;
  meaningShort: string;
  displayTokens: string[];
  cues: MantraCue[];
}

/**
 * Map explicit measured vocal onset timestamps (1-to-1 per displayed token across 1 or more repetitions)
 * so every highlighted token and floating word matches actual vocal entry rather than uniform guesswork.
 */
function buildMeasuredRepCues(tokens: string[], repTimestamps: number[][]): MantraCue[] {
  const cues: MantraCue[] = [];
  for (const times of repTimestamps) {
    const count = Math.min(tokens.length, times.length);
    for (let idx = 0; idx < count; idx++) {
      cues.push({
        text: tokens[idx],
        atSec: Number(times[idx].toFixed(2)),
        displayIndex: idx,
      });
    }
  }
  return cues;
}

interface DeityMantraSeed {
  id: string;
  durationSec: number;
  sanskritLine: string;
  phoneticLine: string;
  meaningShort: string;
  displayTokens: string[];
  repTimestamps: number[][];
}

function makeMantraEntry(seed: DeityMantraSeed): BonTonMantraAudio {
  return {
    audioUrl: `/audio/mantras/${seed.id}.mp3`,
    durationSec: seed.durationSec,
    sanskritLine: seed.sanskritLine,
    phoneticLine: seed.phoneticLine,
    meaningShort: seed.meaningShort,
    displayTokens: seed.displayTokens,
    cues: buildMeasuredRepCues(seed.displayTokens, seed.repTimestamps),
  };
}

const THICH_CA_TOKENS = [
  'OṀ', 'MU', 'NI', 'MU', 'NI', 'MA', 'HĀ', 'MU', 'NI',
  'ŚĀ', 'KYA', 'MU', 'NA', 'YE', 'SVĀ', 'HĀ',
];
const DUOC_SU_TOKENS = [
  'TÊ', 'YA', 'THĀ', 'ÔM', 'BÊ', 'KHĂN', 'DZÊ', 'BÊ', 'KHĂN', 'DZÊ',
  'MA', 'HĀ', 'BÊ', 'KHĂN', 'DZÊ', 'RA', 'DZA', 'SA', 'MÔ', 'GA', 'TÊ', 'SÔ', 'HĀ',
];
const A_DI_DA_TOKENS = [
  'NAM MÔ', 'A DI ĐÀ', 'BÀ DẠ', 'ĐA THÁ', 'GIÀ ĐA', 'DẠ ĐA', 'ĐIỆT DẠ', 'THA',
  'A DI', 'RỊ ĐÔ', 'BÀ TỲ', 'A DI RỊ ĐA', 'TẤT ĐAM', 'BÀ TỲ',
  'A DI RỊ ĐA', 'TỲ CA', 'LAN ĐẾ', 'A DI RỊ ĐA', 'TỲ CA', 'LAN ĐA',
  'DÀ DI NỊ', 'DÀ DÀ NA', 'CHỈ ĐA', 'CA LỆ', 'TA BÀ HA',
];
const THIEN_THU_TOKENS = [
  'NAMO', 'RATNA', 'TRAYĀYA', 'NAMO', 'ĀRYA', 'JÑĀNA', 'SĀGARA',
  'VAIROCANA', 'VYŪHA', 'RĀJĀYA', 'TATHĀGATĀYA', 'ARHATE',
  'SAMYAK', 'SAṀBUDDHĀYA', 'NAMO', 'SARVA', 'TATHĀGATEBHYAḤ', 'ARHATEBHYAḤ',
];
const DI_LAC_TOKENS = ['NĀ', 'MÓ', 'MÍ', 'LÈ', 'PÚ', 'SÀ'];
const QUAN_AM_TOKENS = ['ÔM', 'MA', 'NI', 'BÊ', 'MÊ', 'HÔNG'];
const DIA_TANG_TOKENS = ['ÁN', 'GIÀ', 'RA', 'ĐẾ', 'DA', 'TA', 'BÀ', 'HA'];
const VAN_THU_TOKENS = ['OṀ', 'A', 'RA', 'PA', 'TSA', 'NA', 'DHI'];
const PHO_HIEN_TOKENS = ['LO', 'KĀḤ', 'SA', 'MAS', 'TĀḤ', 'SU', 'KHI', 'NO', 'BHA', 'VAN', 'TU'];
const DAI_THE_CHI_TOKENS = ['NAM', 'MÔ', 'ĐẠI', 'THẾ', 'CHÍ', 'BỒ', 'TÁT'];
const CHUAN_DE_TOKENS = [
  'NA', 'MAḤ', 'SAP', 'TA', 'NĀM', 'SAM', 'YAK', 'SAM', 'BUD', 'DHA',
  'KO', 'ṬĪ', 'NĀM', 'TA', 'DYA', 'THĀ', 'ÔM',
];
const DAI_NHAT_TOKENS = [
  'NAMO', 'BHAGAVATE', 'SARVA', 'DURGATI', 'PARIŚODHANA', 'RĀJĀYA',
  'TATHĀGATĀYA', 'ARHATE', 'SAMYAK', 'SAṀBUDDHĀYA', 'TADYATHĀ', 'OṀ',
  'ŚODHANE', 'ŚODHANE', 'SARVA', 'PĀPAṀ', 'VIŚUDDHE',
];
const CA_DIEP_TOKENS = [
  'DHAMMĀNAṀ', 'VICAYO', 'TATHĀ', 'VĪRIYAṀ', 'PĪTI', 'PASSADDHI',
  'BOJJHAṄGĀ', 'CA', 'TATHĀ', 'PARE', 'SAMĀDHUPEKKHĀ', 'BOJJHAṄGĀ',
  'SATTETE', 'SABBADASSINĀ', 'MUNINĀ', 'SAMMADAKKHĀTĀ', 'BHĀVITĀ', 'BAHULĪKATĀ',
];
const A_NAN_DA_TOKENS = [
  'DIỆU TRẠM', 'TỔNG TRÌ', 'BẤT ĐỘNG', 'TÔN',
  'THỦ LĂNG', 'NGHIÊM VƯƠNG', 'THẾ HY', 'HỮU',
  'TIÊU NGÃ', 'ỨC KIẾP', 'ĐIÊN ĐẢO', 'TƯỞNG',
  'BẤT LỊCH', 'TĂNG KỲ', 'HOẠCH', 'PHÁP THÂN',
];
const DAT_MA_TOKENS = [
  'BUSSETSU', 'HANNYA', 'HARAMITTA', 'SHINGYŌ',
  'HANNYA', 'SHINGYŌ', 'GYATE', 'GYATE',
  'HARA', 'GYATE', 'HARASŌ', 'GYATE',
  'BOJI', 'SOWAKA', 'HANNYA', 'SHINGYŌ',
];
const VI_DA_TOKENS = ['Ô... CHẾ...', 'NAM...', 'CHƯ...'];
const KIM_CANG_TOKENS = ['OṀ', 'VAJRA', 'PĀ', 'ṆI', 'HŪṀ'];
const TARA_TOKENS = ['OṀ', 'TĀ', 'RE', 'TUT', 'TĀ', 'RE', 'TU', 'RE', 'SVĀ', 'HĀ'];

export const BON_TON_MANTRA_CONFIG: Record<string, BonTonMantraAudio> = {
  // 1. Đức Phật Thích Ca Mâu Ni (0.0–9.0s flute + guitar intro; Om at 9.05s)
  'duc-phat-thich-ca': makeMantraEntry({
    id: 'duc-phat-thich-ca',
    durationSec: 25.0,
    sanskritLine: 'Oṁ Muni Muni Mahāmuni Śākyamunaye Svāhā',
    phoneticLine: 'Ôm Mu-ni Mu-ni Ma-ha-mu-ni Sa-kya-mu-na-yê Sva-ha',
    meaningShort:
      'Tâm chú Bổn Sư Thích Ca Mâu Ni — tán thán Bậc Đại Giác Ngộ khai mở trí tuệ thanh tịnh giữa thế gian.',
    displayTokens: THICH_CA_TOKENS,
    repTimestamps: [
      [9.05, 13.65, 13.95, 14.45, 14.70, 14.95, 15.15, 15.35, 15.55, 15.72, 16.00, 16.25, 16.50, 16.75, 17.75, 18.55],
      [22.25, 24.30, 24.65],
    ],
  }),

  // 2. Đức Phật Dược Sư (voice enters at 0.55s)
  'duc-phat-duoc-su': makeMantraEntry({
    id: 'duc-phat-duoc-su',
    durationSec: 16.7,
    sanskritLine: 'Tadyathā Oṁ Bhaiṣajye Bhaiṣajye Mahābhaiṣajye Rāja Samudgate Svāhā',
    phoneticLine: 'Tê-ya-tha Ôm Bê-khăn-dzê Bê-khăn-dzê Ma-ha Bê-khăn-dzê Ra-dza Sa-mô-ga-tê Sô-ha',
    meaningShort:
      'Dược Sư Quán Đảnh Chân Ngôn — ánh sáng lưu ly chữa lành thân tâm, tiêu trừ bệnh khổ và chướng duyên.',
    displayTokens: DUOC_SU_TOKENS,
    repTimestamps: [
      [
        0.55, 0.80, 1.00, 2.50, 3.50, 3.85, 4.15, 5.10, 5.45, 6.20,
        7.45, 7.90, 8.40, 8.90, 9.25, 10.30, 10.80, 11.30, 11.75, 12.25, 12.75, 13.35, 14.15,
      ],
    ],
  }),

  // 3. Đức Phật A Di Đà (0.0–3.2s drum & strings intro)
  'duc-phat-a-di-da': makeMantraEntry({
    id: 'duc-phat-a-di-da',
    durationSec: 30.6,
    sanskritLine:
      'Namo Amitābhāya Tathāgatāya Tadyathā Amṛtodbhave Amṛtasiddhambhave Amṛtavikrānte Amṛtavikrānta Gāmine Gagana Kīrtikare Svāhā',
    phoneticLine:
      'Nam Mô A Di Đà Bà Dạ Đa Thá Già Đa Dạ Đa Điệt Dạ Tha • A Di Rị Đô Bà Tỳ • A Di Rị Đa Tất Đam Bà Tỳ • A Di Rị Đa Tỳ Ca Lan Đế • A Di Rị Đa Tỳ Ca Lan Đa • Dà Di Nị Dà Dà Na • Chỉ Đa Ca Lệ Ta Bà Ha',
    meaningShort:
      'Vãng Sanh Tịnh Độ Thần Chú — nhiếp tâm quy hướng cõi Tây Phương Cực Lạc thanh tịnh an vui.',
    displayTokens: A_DI_DA_TOKENS,
    repTimestamps: [
      [
        3.25, 3.85, 5.10, 5.70, 6.30, 6.85, 7.65, 9.25,
        9.65, 10.65, 11.75, 13.45, 14.70, 15.50,
        17.20, 18.55, 19.75, 21.40, 22.65, 23.40,
        24.75, 26.00, 27.25, 28.05, 28.85,
      ],
    ],
  }),

  // 4. Quán Thế Âm Nghìn Mắt Nghìn Tay (0.0–2.6s orchestral gong intro)
  'quan-the-am-nghin-mat-nghin-tay': makeMantraEntry({
    id: 'quan-the-am-nghin-mat-nghin-tay',
    durationSec: 26.8,
    sanskritLine:
      'Namo Ratna Trayāya Namo Ārya Jñāna Sāgara Vairocana Vyūha Rājāya Tathāgatāya Arhate Samyaksaṁbuddhāya Namo Sarva Tathāgatebhyaḥ Arhatebhyaḥ',
    phoneticLine:
      'Na-mo Rát-na Tra-ya-ya • Na-mo A-rya Giơ-na-na Sa-ga-ra Vây-rô-cha-na Vyu-ha Ra-gia-ya Ta-tha-ga-ta-ya • A-ha-tê Sam-yắc-sam-bút-đa-ya • Na-mo Sa-va Ta-tha-ga-tê-bya A-ha-tê-bya',
    meaningShort:
      'Đoạn mở đầu Thánh Quán Tự Tại Đại Bi Tâm Đà La Ni — quy kính Tam Bảo và vô lượng chư Phật ứng hiện từ bi.',
    displayTokens: THIEN_THU_TOKENS,
    repTimestamps: [
      [
        2.65, 3.25, 3.85, 4.85, 5.85, 6.85, 8.45, 9.55, 11.25,
        12.45, 14.05, 15.85, 17.45, 18.55, 20.55, 21.10, 21.85, 24.45,
      ],
    ],
  }),

  // 5. Phật Di Lặc (4 reps of Chinese chant Nā mó Mí lè Pú sà; 12.7–18.8s bell & mõ interlude)
  'phat-di-lac': makeMantraEntry({
    id: 'phat-di-lac',
    durationSec: 29.2,
    sanskritLine: 'Namo Maitreya Bodhisattvāya • Nā mó Mí lè Pú sà',
    phoneticLine: 'Nā mó Mí lè Pú sà (Nam Mô Di Lặc Bồ Tát)',
    meaningShort:
      'Thánh hiệu Đức Phật Di Lặc — vị Phật tương lai tượng trưng cho tâm từ bi rộng mở, hỷ xả và nụ cười an lạc.',
    displayTokens: DI_LAC_TOKENS,
    repTimestamps: [
      [0.35, 1.00, 1.85, 2.20, 2.60, 3.70],
      [5.50, 6.30, 6.90, 7.45, 8.25, 9.45],
      [18.85, 19.65, 20.50, 21.05, 21.85, 23.00],
      [24.45, 25.30, 25.85, 26.55, 27.15, 28.05],
    ],
  }),

  // 6. Quán Thế Âm Bồ Tát (0.0–3.25s bamboo flute intro, 6 reps)
  'quan-the-am-bo-tat': makeMantraEntry({
    id: 'quan-the-am-bo-tat',
    durationSec: 24.3,
    sanskritLine: 'Oṁ Maṇi Padme Hūṁ',
    phoneticLine: 'Ôm Ma-ni Bê-mê Hông',
    meaningShort:
      'Lục Tự Đại Minh Chân Ngôn — trái tim từ bi cứu khổ độ sinh của Đức Quán Thế Âm Bồ Tát.',
    displayTokens: QUAN_AM_TOKENS,
    repTimestamps: [
      [3.30, 3.90, 4.25, 4.55, 4.75, 4.95],
      [5.80, 6.80, 7.05, 7.30, 7.55, 7.80],
      [8.55, 9.45, 9.95, 10.65, 11.05, 11.45],
      [12.55, 13.15, 13.45, 13.75, 14.00, 14.25],
      [15.95, 16.85, 17.65, 18.00, 18.35, 18.95],
      [19.70, 20.55, 21.10, 21.65, 22.25, 22.85],
    ],
  }),

  // 7. Địa Tạng Vương Bồ Tát (0.15–1.10s spoken "Chân ngôn:", then 7 reps of Diệt Định Nghiệp)
  'dia-tang-vuong-bo-tat': makeMantraEntry({
    id: 'dia-tang-vuong-bo-tat',
    durationSec: 20.5,
    sanskritLine: 'Oṁ Ha Ha Ha Vismaye Svāhā • Án Già Ra Đế Da Ta Bà Ha',
    phoneticLine: 'Chân ngôn: Án Già Ra Đế Da Ta Bà Ha (Diệt Định Nghiệp Chân Ngôn)',
    meaningShort:
      'Diệt Định Nghiệp Chân Ngôn của Đức Địa Tạng Vương — tiêu trừ nghiệp chướng sâu dày, tăng trưởng hiếu hạnh và an lành.',
    displayTokens: DIA_TANG_TOKENS,
    repTimestamps: [
      [1.15, 1.45, 1.85, 2.25, 2.55, 2.85, 3.15, 3.45],
      [3.85, 4.15, 4.45, 4.80, 5.15, 5.45, 5.75, 6.05],
      [6.50, 6.80, 7.15, 7.50, 7.85, 8.20, 8.55, 8.85],
      [9.25, 9.65, 10.00, 10.35, 10.70, 11.00, 11.30, 11.60],
      [11.95, 12.25, 12.60, 12.95, 13.30, 13.65, 14.00, 14.30],
      [14.65, 14.95, 15.30, 15.65, 16.00, 16.35, 16.70, 17.00],
      [17.35, 17.70, 18.05, 18.40, 18.75, 19.10, 19.40, 19.70],
    ],
  }),

  // 8. Văn Thù Sư Lợi Bồ Tát (4 clear silent-separated solo repetitions)
  'van-thu-su-loi-bo-tat': makeMantraEntry({
    id: 'van-thu-su-loi-bo-tat',
    durationSec: 18.8,
    sanskritLine: 'Oṁ A Ra Pa Tsa Na Dhi',
    phoneticLine: 'Ôm A-ra Pa-tsa Na-đi',
    meaningShort:
      'Ngũ Tự Văn Thù Chân Ngôn — khai mở trí tuệ Bát Nhã, thanh tịnh tâm ý và tăng trưởng biện tài.',
    displayTokens: VAN_THU_TOKENS,
    repTimestamps: [
      [0.35, 0.85, 1.45, 1.85, 2.15, 2.80, 3.05],
      [5.10, 5.50, 6.20, 6.70, 6.90, 7.50, 7.90],
      [9.60, 10.15, 10.45, 10.85, 11.25, 11.65, 12.00],
      [13.90, 14.20, 14.50, 14.90, 15.30, 15.65, 16.10],
    ],
  }),

  // 9. Phổ Hiền Bồ Tát (0.0–2.6s synth & chime intro, 3 reps)
  'pho-hien-bo-tat': makeMantraEntry({
    id: 'pho-hien-bo-tat',
    durationSec: 25.5,
    sanskritLine: 'Lokāḥ Samastāḥ Sukhino Bhavantu',
    phoneticLine: 'Lô-ka Sa-mát-ta Su-khi-nô Bha-văn-tu',
    meaningShort:
      'Đại nguyện Phổ Hiền ban rải tâm từ ái: Nguyện khắp muôn loài trong mọi thế giới đều được an vui, tự tại.',
    displayTokens: PHO_HIEN_TOKENS,
    repTimestamps: [
      [2.65, 3.15, 3.85, 4.20, 4.75, 5.15, 5.65, 6.15, 6.75, 7.35, 8.05],
      [9.15, 9.75, 10.50, 11.20, 11.85, 13.20, 13.75, 14.10, 14.70, 15.35, 15.85],
      [17.25, 17.85, 18.20, 18.75, 19.35, 21.25, 21.95, 22.35, 22.85, 23.35, 23.75],
    ],
  }),

  // 10. Đại Thế Chí Bồ Tát (0.0–3.25s chime & xylophone intro, 6 reps)
  'dai-the-chi-bo-tat': makeMantraEntry({
    id: 'dai-the-chi-bo-tat',
    durationSec: 22.8,
    sanskritLine: 'Namo Mahāsthāmaprāpta Bodhisattvāya',
    phoneticLine: 'Nam Mô Đại Thế Chí Bồ Tát',
    meaningShort:
      'Niệm Thánh hiệu Đức Đại Thế Chí — thu nhiếp lục căn, tịnh niệm tương kế, hiển lộ ánh sáng trí tuệ.',
    displayTokens: DAI_THE_CHI_TOKENS,
    repTimestamps: [
      [3.35, 3.65, 3.95, 4.45, 4.80, 5.15, 5.55],
      [6.15, 6.55, 6.95, 7.45, 7.75, 8.10, 8.45],
      [8.75, 9.25, 9.75, 10.20, 10.65, 11.20, 11.95],
      [13.25, 13.65, 14.20, 14.65, 15.20, 15.60, 15.95],
      [16.35, 16.85, 17.40, 17.75, 18.20, 18.45, 18.70],
      [19.25, 19.65, 20.05, 20.55, 21.05, 21.45, 21.85],
    ],
  }),

  // 11. Chuẩn Đề Bồ Tát (0.0–1.7s piano/harp intro; sings Namaḥ Saptānāṁ... Tadyathā Oṁ)
  'chuan-de-bo-tat': makeMantraEntry({
    id: 'chuan-de-bo-tat',
    durationSec: 27.0,
    sanskritLine: 'Namaḥ Saptānāṁ Samyaksaṁbuddha Koṭīnāṁ Tadyathā Oṁ...',
    phoneticLine: 'Na-ma Sáp-ta-nam Sam-yắc-sam-bút-đa Cô-ti-nam Ta-dya-tha Ôm...',
    meaningShort:
      'Đoạn mở đầu Chuẩn Đề Thần Chú — quy kính bảy mươi ức chư Phật Chánh Đẳng Chánh Giác, thanh tịnh thân tâm.',
    displayTokens: CHUAN_DE_TOKENS,
    repTimestamps: [
      [
        1.75, 2.10, 2.55, 3.05, 3.70,
        6.15, 6.95, 7.75, 8.50, 9.20,
        12.15, 13.00, 13.85,
        16.75, 17.60, 18.35, 24.20,
      ],
    ],
  }),

  // 12. Đại Nhật Như Lai (Tỳ Lô Giá Na)
  'dai-nhat-nhu-lai': makeMantraEntry({
    id: 'dai-nhat-nhu-lai',
    durationSec: 32.3,
    sanskritLine:
      'Namo Bhagavate Sarva Durgati Pariśodhana Rājāya Tathāgatāya Arhate Samyaksaṁbuddhāya Tadyathā Oṁ Śodhane Śodhane Sarva Pāpaṁ Viśuddhe',
    phoneticLine:
      'Na-mo Bha-ga-va-tê Sa-va Đu-ga-ti Pa-ri-sô-đa-na Ra-gia-ya Ta-tha-ga-ta-ya • A-ha-tê Sam-yắc-sam-bút-đa-ya • Ta-dya-tha Ôm Sô-đa-nê Sô-đa-nê Sa-va Pa-pam Vi-sút-đê',
    meaningShort:
      'Tỳ Lô Giá Na Quán Đảnh Chân Ngôn — thanh tịnh hóa nghiệp chướng ác đạo, hiển lộ Pháp Thân thanh tịnh.',
    displayTokens: DAI_NHAT_TOKENS,
    repTimestamps: [
      [
        0.15, 0.85, 2.05, 2.65, 5.20, 8.35, 10.55, 13.35,
        16.25, 17.85, 21.95, 23.10, 24.85, 26.25, 27.75, 28.45, 29.25,
      ],
    ],
  }),

  // 13. Tôn Giả Ma Ha Ca Diếp (Bojjhaṅga Paritta Pali verse)
  'ton-gia-ma-ha-ca-diep': makeMantraEntry({
    id: 'ton-gia-ma-ha-ca-diep',
    durationSec: 31.1,
    sanskritLine:
      'Dhammānaṁ Vicayo Tathā Vīriyaṁ Pīti Passaddhi Bojjhaṅgā Ca Tathā Pare Samādhupekkhā Bojjhaṅgā Sattete Sabbadassinā Muninā Sammadakkhātā Bhāvitā Bahulīkatā',
    phoneticLine:
      'Đăm-ma-năng Vi-cha-yô Ta-tha • Vi-ri-yăng Pi-ti Pát-sát-đi Bốt-giăng-ga Cha Ta-tha Pa-rê • Sa-ma-đu-pếc-kha Bốt-giăng-ga Sát-tê-tê Sáp-ba-đát-si-na • Mu-ni-na Sam-ma-đắc-kha-ta Bha-vi-ta Ba-hu-li-ca-ta',
    meaningShort:
      'Thất Giác Chi Kinh (Bojjhaṅga Paritta) tiếng Pali — quán niệm tinh tấn, hỷ, khinh an, định và xả đưa đến giác ngộ.',
    displayTokens: CA_DIEP_TOKENS,
    repTimestamps: [
      [
        0.30, 2.20, 3.70, 4.85, 6.25, 8.05, 10.35, 12.15, 12.50, 13.60,
        14.95, 17.10, 18.75, 20.05, 22.70, 24.20, 27.40, 28.85,
      ],
    ],
  }),

  // 14. Tôn Giả A Nan Đà (15.0–17.3s bell solo before line 4)
  'ton-gia-a-nan-da': makeMantraEntry({
    id: 'ton-gia-a-nan-da',
    durationSec: 22.6,
    sanskritLine:
      'Diệu Trạm Tổng Trì Bất Động Tôn • Thủ Lăng Nghiêm Vương Thế Hy Hữu • Tiêu Ngã Ức Kiếp Điên Đảo Tưởng • Bất Lịch Tăng Kỳ Hoạch Pháp Thân',
    phoneticLine:
      'Diệu Trạm Tổng Trì Bất Động Tôn • Thủ Lăng Nghiêm Vương Thế Hy Hữu • Tiêu Ngã Ức Kiếp Điên Đảo Tưởng • Bất Lịch Tăng Kỳ Hoạch Pháp Thân',
    meaningShort:
      'Bài kệ phát nguyện kinh Thủ Lăng Nghiêm của Tôn giả A Nan Đà — dứt sạch vọng tưởng điên đảo, chứng đắc Pháp Thân.',
    displayTokens: A_NAN_DA_TOKENS,
    repTimestamps: [
      [
        0.15, 1.00, 2.45, 3.70,
        5.10, 5.80, 7.75, 9.05,
        9.95, 10.85, 12.25, 13.95,
        17.45, 18.40, 19.50, 20.15,
      ],
    ],
  }),

  // 15. Tổ Sư Bồ Đề Đạt Ma (Japanese Hannya Shingyō recitation)
  'to-su-bo-de-dat-ma': makeMantraEntry({
    id: 'to-su-bo-de-dat-ma',
    durationSec: 25.5,
    sanskritLine:
      'Bussetsu Hannya Haramitta Shingyō • Gyate Gyate Haragyate Harasōgyate Boji Sowaka',
    phoneticLine:
      'Bút-sết-sư Hăn-nha Ha-ra-mít-ta Sin-gyô • Gya-tê Gya-tê Ha-ra Gya-tê Ha-ra-sô Gya-tê Bô-ji Sô-wa-ka',
    meaningShort:
      'Bát Nhã Tâm Kinh chú tiếng Nhật (Hannya Shingyō) — vượt sang bờ kia giác ngộ, thấu suốt tánh Không.',
    displayTokens: DAT_MA_TOKENS,
    repTimestamps: [
      [
        0.25, 1.15, 2.15, 3.00,
        4.40, 5.25, 7.30, 8.50,
        10.50, 12.10, 14.50, 15.80,
        18.30, 20.20, 22.20, 23.10,
      ],
    ],
  }),

  // 16. Vi Đà Tôn Thiên Bồ Tát (ultra-slow 2-chord choral meditation; 9–14s drone swell)
  'vi-da-ton-thien-bo-tat': makeMantraEntry({
    id: 'vi-da-ton-thien-bo-tat',
    durationSec: 28.5,
    sanskritLine: 'Namo Supratiṣṭhita Mahāprajñā Vidyā Rājāya • Hòa Âm Thiền Định Hộ Pháp',
    phoneticLine: 'Ô... chế... • Nam... chư... (Thiền âm hộ trì chánh pháp)',
    meaningShort:
      'Khúc thiền âm hộ pháp trầm hùng kính dâng Đức Vi Đà Tôn Thiên — an định đạo tràng, hộ trì người tu học.',
    displayTokens: VI_DA_TOKENS,
    repTimestamps: [[0.35, 14.35, 16.85]],
  }),

  // 17. Kim Cang Thủ Bồ Tát (4 deep solo reps with quiet pauses)
  'kim-cang-thu-bo-tat': makeMantraEntry({
    id: 'kim-cang-thu-bo-tat',
    durationSec: 20.1,
    sanskritLine: 'Oṁ Vajrapāṇi Hūṁ',
    phoneticLine: 'Ôm Va-dơ-ra-pa-ni Hung',
    meaningShort:
      'Tâm chú Đức Kim Cang Thủ Bồ Tát — hiển bày dũng lực giác ngộ bất hoại, phá tan phiền não và chướng ngại.',
    displayTokens: KIM_CANG_TOKENS,
    repTimestamps: [
      [0.35, 0.90, 1.45, 1.75, 2.05],
      [5.60, 5.90, 6.25, 6.45, 6.65],
      [10.65, 11.10, 11.55, 11.95, 12.20],
      [15.85, 16.30, 16.70, 16.95, 17.25],
    ],
  }),

  // 18. Đức Tara Đa La Bồ Tát (0.0–5.9s instrumental intro, 4 crisp reps)
  'duc-tara-da-la-bo-tat': makeMantraEntry({
    id: 'duc-tara-da-la-bo-tat',
    durationSec: 23.6,
    sanskritLine: 'Oṁ Tāre Tuttāre Ture Svāhā',
    phoneticLine: 'Ôm Ta-rê Tút-ta-rê Tu-rê Sva-ha',
    meaningShort:
      'Lục Độ Mẫu Tara Chân Ngôn — năng lượng từ bi mau chóng giải thoát sợ hãi, bảo hộ và đưa hành giả qua mọi khổ nạn.',
    displayTokens: TARA_TOKENS,
    repTimestamps: [
      [6.00, 6.45, 6.75, 7.20, 7.55, 7.85, 8.35, 8.85, 9.30, 9.65],
      [10.50, 10.95, 11.35, 11.70, 12.10, 12.50, 13.20, 13.55, 13.85, 14.15],
      [14.80, 15.30, 15.65, 16.00, 16.35, 16.75, 17.50, 17.85, 18.15, 18.45],
      [19.05, 19.60, 20.00, 20.30, 20.65, 21.10, 21.55, 21.95, 22.25, 22.55],
    ],
  }),
};
