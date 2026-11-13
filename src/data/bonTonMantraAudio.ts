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

interface CueSegment {
  start: number;
  end: number;
  tokens: string[];
  displayOffset?: number;
}

function buildSegmentsCues(segments: CueSegment[]): MantraCue[] {
  const cues: MantraCue[] = [];
  for (const seg of segments) {
    const count = seg.tokens.length;
    if (count === 0) continue;
    const span = Math.max(0.2, seg.end - seg.start);
    const offset = seg.displayOffset ?? 0;
    for (let i = 0; i < count; i++) {
      const ratio = count === 1 ? 0 : i / count;
      cues.push({
        text: seg.tokens[i],
        atSec: Number((seg.start + ratio * span).toFixed(2)),
        displayIndex: offset + i,
      });
    }
  }
  return cues;
}

function buildRepeatedCues(
  cycles: Array<[number, number]>,
  tokens: string[]
): MantraCue[] {
  return buildSegmentsCues(
    cycles.map(([start, end]) => ({
      start,
      end,
      tokens,
      displayOffset: 0,
    }))
  );
}

export const BON_TON_MANTRA_CONFIG: Record<string, BonTonMantraAudio> = {
  'duc-phat-duoc-su': {
    audioUrl: '/audio/mantras/duc-phat-duoc-su.mp3',
    durationSec: 16.7,
    sanskritLine: 'Tadyathā: Oṁ Bhaiṣajye Bhaiṣajye Mahābhaiṣajye Rāja Samudgate Svāhā',
    phoneticLine: 'TÊ YA THA · OM BÊ KAN ZÊ · BÊ KAN ZÊ · MA HA BÊ KAN ZÊ · RA DZA SA MÚT GA TÊ SO HA',
    meaningShort:
      'Quy kính Đức Dược Sư Lưu Ly Quang Vương Phật — vị Đại Y Vương chữa lành mọi bệnh khổ thân tâm.',
    displayTokens: [
      'TÊ', 'YA', 'THA', 'OM', 'BÊ', 'KAN', 'ZÊ',
      'BÊ', 'KAN', 'ZÊ', 'MA', 'HA', 'BÊ', 'KAN', 'ZÊ',
      'RA', 'DZA', 'SA', 'MÚT', 'GA', 'TÊ', 'SO', 'HA',
    ],
    cues: buildSegmentsCues([
      {
        start: 0.65,
        end: 9.75,
        tokens: ['TÊ', 'YA', 'THA', 'OM', 'BÊ', 'KAN', 'ZÊ', 'BÊ', 'KAN', 'ZÊ', 'MA', 'HA', 'BÊ', 'KAN', 'ZÊ'],
        displayOffset: 0,
      },
      {
        start: 10.55,
        end: 15.85,
        tokens: ['RA', 'DZA', 'SA', 'MÚT', 'GA', 'TÊ', 'SO', 'HA'],
        displayOffset: 15,
      },
    ]),
  },

  'duc-phat-thich-ca': {
    audioUrl: '/audio/mantras/duc-phat-thich-ca.mp3',
    durationSec: 25.0,
    sanskritLine: 'Oṁ Muni Muni Mahāmuni Śākyamunaye Svāhā',
    phoneticLine: 'OM · MU NI · MU NI · MA HA MU NI · SHA KYA MU NA YE · SVA HA',
    meaningShort:
      'Đảnh lễ Bổn Sư Thích Ca Mâu Ni — bậc Đại Giác Ngộ khai mở trí tuệ thanh tịnh giữa thế gian.',
    displayTokens: [
      'OM', 'MU', 'NI', 'MU', 'NI', 'MA', 'HA', 'MU', 'NI', 'SHA', 'KYA', 'MU', 'NA', 'YE', 'SVA', 'HA',
    ],
    cues: buildRepeatedCues(
      [
        [1.1, 10.9],
        [12.6, 22.8],
      ],
      ['OM', 'MU', 'NI', 'MU', 'NI', 'MA', 'HA', 'MU', 'NI', 'SHA', 'KYA', 'MU', 'NA', 'YE', 'SVA', 'HA']
    ),
  },

  'duc-phat-a-di-da': {
    audioUrl: '/audio/mantras/duc-phat-a-di-da.mp3',
    durationSec: 30.6,
    sanskritLine: 'Namo Amitābhāya Tathāgatāya · Tadyathā Amṛtodbhave ... Svāhā',
    phoneticLine:
      'Nam mô A Di Đa Bà Dạ, Đa Tha Già Đa Dạ, Đa Địa Dạ Tha: A di rị đô bà tỳ, A di rị đa tất đam bà tỳ, A di rị đa tì ca lan đế, A di rị đa tì ca lan đa, Già di nị già già na chỉ đa ca lệ Ta Bà Ha',
    meaningShort:
      'Chân ngôn Vãng Sinh Tịnh Độ — nhiếp tâm thanh tịnh, tiêu trừ nghiệp chướng, nương ánh sáng vô lượng của Đức Phật A Di Đà.',
    displayTokens: [
      'NAM', 'MÔ', 'A', 'DI', 'ĐA', 'BÀ', 'DẠ',
      'ĐA', 'THA', 'GIÀ', 'ĐA', 'DẠ',
      'ĐA', 'ĐỊA', 'DẠ', 'THA',
      'A', 'DI', 'RỊ', 'ĐÔ', 'BÀ', 'TỲ',
      'TẤT', 'ĐAM', 'BÀ', 'TỲ',
      'TÌ', 'CA', 'LAN', 'ĐẾ',
      'TÌ', 'CA', 'LAN', 'ĐA',
      'GIÀ', 'DI', 'NỊ', 'CHỈ', 'ĐA', 'CA', 'LỆ', 'TA', 'BÀ', 'HA',
    ],
    cues: buildSegmentsCues([
      {
        start: 0.25,
        end: 9.2,
        tokens: ['NAM', 'MÔ', 'A', 'DI', 'ĐA', 'BÀ', 'DẠ', 'ĐA', 'THA', 'GIÀ', 'ĐA', 'DẠ', 'ĐA', 'ĐỊA', 'DẠ', 'THA'],
        displayOffset: 0,
      },
      {
        start: 9.5,
        end: 20.6,
        tokens: ['A', 'DI', 'RỊ', 'ĐÔ', 'BÀ', 'TỲ', 'TẤT', 'ĐAM', 'BÀ', 'TỲ', 'TÌ', 'CA', 'LAN', 'ĐẾ'],
        displayOffset: 16,
      },
      {
        start: 20.9,
        end: 29.8,
        tokens: ['TÌ', 'CA', 'LAN', 'ĐA', 'GIÀ', 'DI', 'NỊ', 'CHỈ', 'ĐA', 'CA', 'LỆ', 'TA', 'BÀ', 'HA'],
        displayOffset: 30,
      },
    ]),
  },

  'quan-the-am-nghin-mat-nghin-tay': {
    audioUrl: '/audio/mantras/quan-the-am-nghin-mat-nghin-tay.mp3',
    durationSec: 26.8,
    sanskritLine: 'Namo Ratna Trayāya · Namo Ārya Jñāna Sāgara Vairocana ...',
    phoneticLine:
      'NA MO RAT NA TRA YA YA · NA MO AR YA JÑA NA SA GA RA VAI RO CA NA BYU HA RA JA YA · TA THA GA TA YA AR HA TE SAM YAK SAM BUD DHA YA',
    meaningShort:
      'Thủ quy y Tam Bảo và Tôn giả Quán Thế Âm Đại Bi — phát khởi lòng từ bi vô lượng, hộ trì chúng sanh thoát khổ nạn.',
    displayTokens: [
      'NA', 'MO', 'RAT', 'NA', 'TRA', 'YA', 'YA',
      'NA', 'MO', 'AR', 'YA', 'JÑA', 'NA', 'SA', 'GA', 'RA',
      'VAI', 'RO', 'CA', 'NA', 'RA', 'JA', 'YA',
      'TA', 'THA', 'GA', 'TA', 'YA', 'AR', 'HA', 'TE',
      'SAM', 'YAK', 'SAM', 'BUD', 'DHA', 'YA',
    ],
    cues: buildSegmentsCues([
      {
        start: 0.25,
        end: 13.8,
        tokens: [
          'NA', 'MO', 'RAT', 'NA', 'TRA', 'YA', 'YA',
          'NA', 'MO', 'AR', 'YA', 'JÑA', 'NA', 'SA', 'GA', 'RA',
          'VAI', 'RO', 'CA', 'NA', 'RA', 'JA', 'YA',
        ],
        displayOffset: 0,
      },
      {
        start: 14.2,
        end: 25.8,
        tokens: [
          'TA', 'THA', 'GA', 'TA', 'YA', 'AR', 'HA', 'TE',
          'SAM', 'YAK', 'SAM', 'BUD', 'DHA', 'YA',
        ],
        displayOffset: 23,
      },
    ]),
  },

  'phat-di-lac': {
    audioUrl: '/audio/mantras/phat-di-lac.mp3',
    durationSec: 29.2,
    sanskritLine: 'Namo Maitreya Bodhisattvāya (Nam Mô Di Lặc Bồ Tát)',
    phoneticLine: 'NA MÔ · DI LẶC · BỒ TÁT (Hán Việt cổ xướng: Na Mô Mi Lặc Bồ Tát)',
    meaningShort:
      'Xưng niệm thánh hiệu Đức Phật Di Lặc — trưởng dưỡng tâm từ hòa hỷ xả, đón nhận nguồn năng lượng hoan hỷ an lạc.',
    displayTokens: ['NA', 'MÔ', 'MI', 'LẶC', 'BỒ', 'TÁT'],
    cues: buildRepeatedCues(
      [
        [0.15, 5.6],
        [6.1, 11.8],
        [18.9, 23.6],
        [24.0, 28.5],
      ],
      ['NA', 'MÔ', 'MI', 'LẶC', 'BỒ', 'TÁT']
    ),
  },

  'quan-the-am-bo-tat': {
    audioUrl: '/audio/mantras/quan-the-am-bo-tat.mp3',
    durationSec: 24.3,
    sanskritLine: 'Oṁ Maṇi Padme Hūṁ',
    phoneticLine: 'OM · MA · NI · PAD · ME · HUM',
    meaningShort:
      'Lục Tự Đại Minh Chân Ngôn — viên ngọc báu giữa hoa sen thanh tịnh, tịnh hóa sáu cõi phiền não.',
    displayTokens: ['OM', 'MA', 'NI', 'PAD', 'ME', 'HUM'],
    cues: buildRepeatedCues(
      [
        [0.2, 3.8],
        [4.1, 7.9],
        [8.4, 12.1],
        [12.5, 16.2],
        [16.6, 20.3],
        [20.6, 23.9],
      ],
      ['OM', 'MA', 'NI', 'PAD', 'ME', 'HUM']
    ),
  },

  'dia-tang-vuong-bo-tat': {
    audioUrl: '/audio/mantras/dia-tang-vuong-bo-tat.mp3',
    durationSec: 20.5,
    sanskritLine: 'Oṁ Karadeya Svāhā (Phá Địa Ngục Chân Ngôn)',
    phoneticLine: 'ÁN · GIÀ RA ĐẾ · DẠ · TA BÀ HA',
    meaningShort:
      'Chân ngôn đại bi nguyện lực của Đức Địa Tạng Vương — chiếu ánh sáng từ bi phá tan u tối, giải thoát khổ ách cho hết thảy chúng sanh.',
    displayTokens: ['ÁN', 'GIÀ', 'RA', 'ĐẾ', 'DẠ', 'TA', 'BÀ', 'HA'],
    cues: buildRepeatedCues(
      [
        [1.1, 4.1],
        [4.2, 7.2],
        [7.3, 10.3],
        [10.4, 13.4],
        [13.5, 16.5],
        [16.6, 19.9],
      ],
      ['ÁN', 'GIÀ', 'RA', 'ĐẾ', 'DẠ', 'TA', 'BÀ', 'HA']
    ),
  },

  'van-thu-su-loi-bo-tat': {
    audioUrl: '/audio/mantras/van-thu-su-loi-bo-tat.mp3',
    durationSec: 18.8,
    sanskritLine: 'Oṁ A Ra Pa Ca Na Dhīḥ',
    phoneticLine: 'OM · A · RA · PA · TSA · NA · DHI',
    meaningShort:
      'Ngũ Tự Tâm Chú Đức Văn Thù Sư Lợi — khai mở Bát Nhã trí tuệ sáng suốt, tiêu trừ ngu si ám chướng.',
    displayTokens: ['OM', 'A', 'RA', 'PA', 'TSA', 'NA', 'DHI'],
    cues: buildRepeatedCues(
      [
        [0.45, 3.55],
        [5.25, 8.4],
        [9.75, 13.0],
        [14.0, 17.05],
      ],
      ['OM', 'A', 'RA', 'PA', 'TSA', 'NA', 'DHI']
    ),
  },

  'pho-hien-bo-tat': {
    audioUrl: '/audio/mantras/pho-hien-bo-tat.mp3',
    durationSec: 25.5,
    sanskritLine: 'Lokāḥ Samastāḥ Sukhino Bhavantu',
    phoneticLine: 'LO KAH · SA MAS TAH · SU KHI NO · BHA VAN TU',
    meaningShort:
      'Đại nguyện Phổ Hiền hạnh nguyện — cầu chúc muôn loài trong khắp pháp giới đều được an lạc và tự tại.',
    displayTokens: ['LO', 'KAH', 'SA', 'MAS', 'TAH', 'SU', 'KHI', 'NO', 'BHA', 'VAN', 'TU'],
    cues: buildRepeatedCues(
      [
        [0.3, 8.3],
        [8.7, 16.7],
        [17.1, 24.7],
      ],
      ['LO', 'KAH', 'SA', 'MAS', 'TAH', 'SU', 'KHI', 'NO', 'BHA', 'VAN', 'TU']
    ),
  },

  'dai-the-chi-bo-tat': {
    audioUrl: '/audio/mantras/dai-the-chi-bo-tat.mp3',
    durationSec: 22.8,
    sanskritLine: 'Namo Mahāsthāmaprāpta Bodhisattvāya',
    phoneticLine: 'NAM MÔ · ĐẠI THẾ CHÍ · BỒ TÁT',
    meaningShort:
      'Thâu nhiếp sáu căn, tịnh niệm nối tiếp nhau — ánh sáng trí tuệ Đại Thế Chí chiếu soi khiến tâm trí sáng tỏ định tĩnh.',
    displayTokens: ['NAM', 'MÔ', 'ĐẠI', 'THẾ', 'CHÍ', 'BỒ', 'TÁT'],
    cues: buildRepeatedCues(
      [
        [0.2, 3.3],
        [4.05, 7.6],
        [8.0, 11.6],
        [12.0, 15.7],
        [16.05, 19.4],
        [19.7, 22.2],
      ],
      ['NAM', 'MÔ', 'ĐẠI', 'THẾ', 'CHÍ', 'BỒ', 'TÁT']
    ),
  },

  'chuan-de-bo-tat': {
    audioUrl: '/audio/mantras/chuan-de-bo-tat.mp3',
    durationSec: 27.0,
    sanskritLine: 'Namaḥ Saptānāṁ Samyaksaṁbuddha Koṭīnāṁ · Tadyathā: Oṁ Cale Cule Cundi Svāhā',
    phoneticLine:
      'NA MAH · SAP TA NAM · SAM YAK SAM BUD DHA · KO TI NAM · TAD YA THA · OM · CA LE · CU LE · CUN DI · SVA HA',
    meaningShort:
      'Phật Mẫu Chuẩn Đề Thần Chú — thanh tịnh thân khẩu ý, tăng trưởng phước báu và tiêu trừ mọi chướng duyên.',
    displayTokens: [
      'NA', 'MAH', 'SAP', 'TA', 'NAM',
      'SAM', 'YAK', 'SAM', 'BUD', 'DHA',
      'KO', 'TI', 'NAM', 'TAD', 'YA', 'THA',
      'OM', 'CA', 'LE', 'CU', 'LE', 'CUN', 'DI', 'SVA', 'HA',
    ],
    cues: buildSegmentsCues([
      {
        start: 0.35,
        end: 13.6,
        tokens: [
          'NA', 'MAH', 'SAP', 'TA', 'NAM',
          'SAM', 'YAK', 'SAM', 'BUD', 'DHA',
          'KO', 'TI', 'NAM', 'TAD', 'YA', 'THA',
        ],
        displayOffset: 0,
      },
      {
        start: 14.4,
        end: 25.8,
        tokens: ['OM', 'CA', 'LE', 'CU', 'LE', 'CUN', 'DI', 'SVA', 'HA'],
        displayOffset: 16,
      },
    ]),
  },

  'dai-nhat-nhu-lai': {
    audioUrl: '/audio/mantras/dai-nhat-nhu-lai.mp3',
    durationSec: 32.3,
    sanskritLine:
      'Oṁ Namo Bhagavate Sarva Durgati Pariśodhana Rājāya ... Tadyathā Oṁ Śodhane Śodhane Sarva Pāpaṁ Viśuddhe Svāhā',
    phoneticLine:
      'OM NA MO BHA GA VA TE SAR VA DUR GA TI PA RI SHO DHA NA RA JA YA TA THA GA TA YA · TAD YA THA OM SHO DHA NE SAR VA PA PAM VI SHUD DHE SAR VA KAR MA SVA HA',
    meaningShort:
      'Chân ngôn Đại Nhật Như Lai (Tỳ Lô Giá Na) — ánh sáng trí tuệ pháp thân chiếu soi tịnh hóa tận gốc mọi nghiệp chướng.',
    displayTokens: [
      'OM', 'NA', 'MO', 'BHA', 'GA', 'VA', 'TE',
      'SAR', 'VA', 'DUR', 'GA', 'TI',
      'PA', 'RI', 'SHO', 'DHA', 'NA',
      'RA', 'JA', 'YA', 'TA', 'THA', 'GA', 'TA', 'YA',
      'TAD', 'YA', 'THA', 'OM',
      'SHO', 'DHA', 'NE', 'SAR', 'VA', 'PA', 'PAM',
      'VI', 'SHUD', 'DHE', 'SAR', 'VA', 'KAR', 'MA', 'SVA', 'HA',
    ],
    cues: buildSegmentsCues([
      {
        start: 0.25,
        end: 14.3,
        tokens: [
          'OM', 'NA', 'MO', 'BHA', 'GA', 'VA', 'TE',
          'SAR', 'VA', 'DUR', 'GA', 'TI',
          'PA', 'RI', 'SHO', 'DHA', 'NA',
          'RA', 'JA', 'YA', 'TA', 'THA', 'GA', 'TA', 'YA',
        ],
        displayOffset: 0,
      },
      {
        start: 14.8,
        end: 31.6,
        tokens: [
          'TAD', 'YA', 'THA', 'OM',
          'SHO', 'DHA', 'NE', 'SAR', 'VA', 'PA', 'PAM',
          'VI', 'SHUD', 'DHE', 'SAR', 'VA', 'KAR', 'MA', 'SVA', 'HA',
        ],
        displayOffset: 25,
      },
    ]),
  },

  'ton-gia-ma-ha-ca-diep': {
    audioUrl: '/audio/mantras/ton-gia-ma-ha-ca-diep.mp3',
    durationSec: 31.1,
    sanskritLine: 'Bojjhaṅgo Satisaṅkhāto Dhammānaṁ Vicayo Tathā (Pāli Paritta)',
    phoneticLine:
      'BOJ JHAN GO SA TI SAN KHA TO DHAM MA NAM VI CA YO TA THA · VI RI YAM PI TI PAS SAD DHI BOJ JHAN GA CA TA THA PA RE · MU NI NA SAM MA DAK KHA TA',
    meaningShort:
      'Kinh Thất Giác Chi bằng cổ ngữ Pāli — bài kinh Phật từng tuyên thuyết cho Tôn giả Ma Ha Ca Diếp để trưởng dưỡng niệm, trạch pháp, tinh tấn, hỷ, khinh an, định và xả.',
    displayTokens: [
      'BOJ', 'JHAN', 'GO', 'SA', 'TI', 'SAN', 'KHA', 'TO',
      'DHAM', 'MA', 'NAM', 'VI', 'CA', 'YO', 'TA', 'THA',
      'VI', 'RI', 'YAM', 'PI', 'TI', 'PAS', 'SAD', 'DHI',
      'BOJ', 'JHAN', 'GA', 'CA', 'TA', 'THA', 'PA', 'RE',
      'SA', 'MA', 'DHU', 'PEK', 'KHA', 'SAT', 'TE', 'TE',
      'MU', 'NI', 'NA', 'SAM', 'MA', 'DAK', 'KHA', 'TA',
    ],
    cues: buildSegmentsCues([
      {
        start: 0.3,
        end: 7.7,
        tokens: ['BOJ', 'JHAN', 'GO', 'SA', 'TI', 'SAN', 'KHA', 'TO', 'DHAM', 'MA', 'NAM', 'VI', 'CA', 'YO', 'TA', 'THA'],
        displayOffset: 0,
      },
      {
        start: 8.1,
        end: 15.6,
        tokens: ['VI', 'RI', 'YAM', 'PI', 'TI', 'PAS', 'SAD', 'DHI', 'BOJ', 'JHAN', 'GA', 'CA', 'TA', 'THA', 'PA', 'RE'],
        displayOffset: 16,
      },
      {
        start: 16.0,
        end: 22.3,
        tokens: ['SA', 'MA', 'DHU', 'PEK', 'KHA', 'SAT', 'TE', 'TE'],
        displayOffset: 32,
      },
      {
        start: 23.0,
        end: 30.4,
        tokens: ['MU', 'NI', 'NA', 'SAM', 'MA', 'DAK', 'KHA', 'TA'],
        displayOffset: 40,
      },
    ]),
  },

  'ton-gia-a-nan-da': {
    audioUrl: '/audio/mantras/ton-gia-a-nan-da.mp3',
    durationSec: 22.6,
    sanskritLine: 'Namo Śākyamunaye · Śūraṅgama Stotra (Kệ Tán Thán Lăng Nghiêm)',
    phoneticLine:
      'Diệu trạm tổng trì bất động tôn · Thủ Lăng Nghiêm Vương thế hy hữu · Tiêu ngã ức kiếp điên đảo tưởng · Bất lịch tăng kỳ hoạch pháp thân',
    meaningShort:
      'Bài kệ chứng ngộ của Tôn giả A Nan trong Kinh Thủ Lăng Nghiêm — phát nguyện giữ gìn chánh định kiên cố, dứt sạch vọng tưởng đảo điên.',
    displayTokens: [
      'DIỆU', 'TRẠM', 'TỔNG', 'TRÌ', 'BẤT', 'ĐỘNG', 'TÔN',
      'THỦ', 'LĂNG', 'NGHIÊM', 'VƯƠNG', 'THẾ', 'HY', 'HỮU',
      'TIÊU', 'NGÃ', 'ỨC', 'KIẾP', 'ĐIÊN', 'ĐẢO', 'TƯỞNG',
      'BẤT', 'LỊCH', 'TĂNG', 'KỲ', 'HOẠCH', 'PHÁP', 'THÂN',
    ],
    cues: buildSegmentsCues([
      { start: 0.45, end: 5.5, tokens: ['DIỆU', 'TRẠM', 'TỔNG', 'TRÌ', 'BẤT', 'ĐỘNG', 'TÔN'], displayOffset: 0 },
      { start: 5.9, end: 11.1, tokens: ['THỦ', 'LĂNG', 'NGHIÊM', 'VƯƠNG', 'THẾ', 'HY', 'HỮU'], displayOffset: 7 },
      { start: 11.5, end: 16.8, tokens: ['TIÊU', 'NGÃ', 'ỨC', 'KIẾP', 'ĐIÊN', 'ĐẢO', 'TƯỞNG'], displayOffset: 14 },
      { start: 17.2, end: 22.1, tokens: ['BẤT', 'LỊCH', 'TĂNG', 'KỲ', 'HOẠCH', 'PHÁP', 'THÂN'], displayOffset: 21 },
    ]),
  },

  'to-su-bo-de-dat-ma': {
    audioUrl: '/audio/mantras/to-su-bo-de-dat-ma.mp3',
    durationSec: 25.5,
    sanskritLine: 'Gate Gate Pāragate Pārasaṁgate Bodhi Svāhā (Hannya Shingyō Mantra)',
    phoneticLine:
      'HAN NYA HA RA MI TA SHU · GYA TE · GYA TE · HA RA GYA TE · HA RA SO GYA TE · BO JI · SO WA KA',
    meaningShort:
      'Tâm ấn Bát Nhã Ba La Mật của Thiền Tông — vượt qua bờ mê sang bờ giác, trực chỉ tâm chân như thanh tịnh như Tổ sư Đạt Ma truyền trao.',
    displayTokens: [
      'HAN', 'NYA', 'HA', 'RA', 'MI', 'TA', 'SHU',
      'GYA', 'TE', 'GYA', 'TE', 'HA', 'RA', 'GYA', 'TE',
      'HA', 'RA', 'SO', 'GYA', 'TE', 'BO', 'JI', 'SO', 'WA', 'KA',
      'HAN', 'NYA', 'SHIN', 'GYO',
    ],
    cues: buildSegmentsCues([
      { start: 0.2, end: 6.4, tokens: ['HAN', 'NYA', 'HA', 'RA', 'MI', 'TA', 'SHU'], displayOffset: 0 },
      {
        start: 7.4,
        end: 20.8,
        tokens: ['GYA', 'TE', 'GYA', 'TE', 'HA', 'RA', 'GYA', 'TE', 'HA', 'RA', 'SO', 'GYA', 'TE', 'BO', 'JI', 'SO', 'WA', 'KA'],
        displayOffset: 7,
      },
      { start: 21.8, end: 25.0, tokens: ['HAN', 'NYA', 'SHIN', 'GYO'], displayOffset: 25 },
    ]),
  },

  'vi-da-ton-thien-bo-tat': {
    audioUrl: '/audio/mantras/vi-da-ton-thien-bo-tat.mp3',
    durationSec: 28.5,
    sanskritLine: 'Namo Skanda Dharmapāla Bodhisattvāya (Vi Đà Thiên Tướng Tán)',
    phoneticLine: 'VI ĐÀ THIÊN TƯỚNG · BỒ TÁT HÓA THÂN · ỦNG HỘ PHẬT PHÁP THỆ HOẰNG THÂM',
    meaningShort:
      'Lời tán thán Bồ Tát Vi Đà Hộ Pháp — phát đại thệ nguyện giữ gìn chánh pháp, che chở đạo tràng thanh tịnh an ổn.',
    displayTokens: [
      'VI', 'ĐÀ', 'THIÊN', 'TƯỚNG',
      'BỒ', 'TÁT', 'HÓA', 'THÂN',
      'ỦNG', 'HỘ', 'PHẬT', 'PHÁP',
      'THỆ', 'HOẰNG', 'THÂM',
    ],
    cues: buildSegmentsCues([
      { start: 0.4, end: 13.5, tokens: ['VI', 'ĐÀ', 'THIÊN', 'TƯỚNG', 'BỒ', 'TÁT', 'HÓA', 'THÂN'], displayOffset: 0 },
      { start: 14.0, end: 27.8, tokens: ['ỦNG', 'HỘ', 'PHẬT', 'PHÁP', 'THỆ', 'HOẰNG', 'THÂM'], displayOffset: 8 },
    ]),
  },

  'kim-cang-thu-bo-tat': {
    audioUrl: '/audio/mantras/kim-cang-thu-bo-tat.mp3',
    durationSec: 20.1,
    sanskritLine: 'Oṁ Vajrapāṇi Hūṁ',
    phoneticLine: 'OM · VAJ · RA · PA · NI · HUM',
    meaningShort:
      'Tâm chú Kim Cang Thủ Bồ Tát — hiển hiện oai đức kim cang bất hoại, phá tan chướng ma, hộ trì hành giả kiên cố trên đường tu.',
    displayTokens: ['OM', 'VAJ', 'RA', 'PA', 'NI', 'HUM'],
    cues: buildRepeatedCues(
      [
        [0.45, 2.75],
        [5.25, 7.15],
        [10.7, 13.1],
        [16.0, 18.6],
      ],
      ['OM', 'VAJ', 'RA', 'PA', 'NI', 'HUM']
    ),
  },

  'duc-tara-da-la-bo-tat': {
    audioUrl: '/audio/mantras/duc-tara-da-la-bo-tat.mp3',
    durationSec: 23.6,
    sanskritLine: 'Oṁ Tāre Tuttāre Ture Svāhā',
    phoneticLine: 'OM · TA RE · TUT TA RE · TU RE · SVA HA',
    meaningShort:
      'Tâm chú Đức Lục Độ Mẫu Tara — xua tan tám nỗi sợ hãi lớn, nhanh chóng gia hộ từ bi và bình an vô úy.',
    displayTokens: ['OM', 'TA', 'RE', 'TUT', 'TA', 'RE', 'TU', 'RE', 'SVA', 'HA'],
    cues: buildRepeatedCues(
      [
        [0.2, 5.8],
        [6.1, 11.6],
        [11.9, 17.4],
        [17.7, 23.1],
      ],
      ['OM', 'TA', 'RE', 'TUT', 'TA', 'RE', 'TU', 'RE', 'SVA', 'HA']
    ),
  },
};

