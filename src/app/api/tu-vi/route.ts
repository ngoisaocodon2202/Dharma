import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { calculateCanChiAndMenh, GIO_SINH_OPTIONS, FOCUS_AREAS } from '@/lib/tu-vi-calc';

export interface TuViAnalysisResult {
  canChi: string;
  menh: string;
  nguHanh: string;
  cung: string;
  namXemCanChi: string;
  tuoiAm: number;
  tongQuan: string;
  congDanh: string;
  taiLoc: string;
  tinhDuyen: string;
  sucKhoe: string;
  loiKhuyenPhatPhap: {
    nghiepDuyen: string;
    phuongPhapHoaGiai: string;
    kinhChuPhuHop: string;
    hanhThienBoThi: string;
  };
  tuoiHop: string[];
  tuoiKac: string[];
  mauSacMayMan: string[];
  conSoMayMan: number[];
  huongTot: string[];
}

// Fallback high-quality reading engine if AI key is absent or quota limit is hit
function generateIntelligentBuddhistReading(
  fullName: string,
  gender: 'Nam' | 'Nữ',
  birthDate: string,
  canChi: string,
  menh: string,
  nguHanh: string,
  cung: string,
  tuoiAm: number,
  viewYear: number,
  namXemCanChi: string,
  focusAreaLabel: string,
  birthHourLabel: string,
  wishes?: string
): TuViAnalysisResult {
  const wishNote = wishes
    ? ` Đặc biệt với mong muốn "${wishes}", việc giữ tâm bình hòa và kiên trì hành thiện sẽ giúp bạn sớm đạt thành tựu viên mãn.`
    : '';

  return {
    canChi,
    menh,
    nguHanh,
    cung,
    namXemCanChi,
    tuoiAm,
    tongQuan: `Hồ sơ phân tích tham khảo của ${fullName} (${gender} mạng, sinh ngày ${birthDate}, ${birthHourLabel}): Bạn thuộc tuổi ${canChi}, bản mệnh Ngũ hành Nạp âm là ${menh}, cung phi ${cung}. Bước vào năm ${viewYear} (${namXemCanChi} — ${tuoiAm} tuổi âm), dữ liệu ngũ hành cho thấy đây là giai đoạn thuận lợi để củng cố nền tảng nội lực và phát triển chiều sâu tri thức. Theo tinh thần chánh kiến Phật giáo, vận mệnh không phải là định mệnh bất biến mà luôn chuyển dịch theo tâm niệm và hành động thiện lành mỗi ngày.${wishNote}`,
    congDanh: `Về phương diện Công danh & Sự nghiệp (trọng tâm tham khảo: "${focusAreaLabel}"): Bản mệnh ${menh} mang năng lượng của sự kiên trì và trách nhiệm. Trong năm ${viewYear}, bạn phù hợp với lộ trình phát triển bền vững, trau dồi chuyên môn và mở rộng hợp tác chân thành. Khi giữ chữ Tín và thái độ khiêm cung, bạn sẽ tự nhiên thu hút được sự quý mến, hỗ trợ từ đồng nghiệp và quý nhân.`,
    taiLoc: `Về phương diện Tài chính & Phúc lộc: Dòng chảy tài chính trong năm ${viewYear} duy trì sự ổn định nếu bạn ưu tiên quản trị kế hoạch rõ ràng, tránh các quyết định đầu tư vội vàng theo cảm tính. Triết lý Nhân Quả chỉ rõ phúc lộc bền vững luôn khởi nguồn từ lao động chân chính kết hợp với tâm rộng mở sẻ chia, giúp đỡ cộng đồng.`,
    tinhDuyen: `Về phương diện Gia đạo & Nhân duyên: Năng lượng ngũ hành ${nguHanh} nhắc nhở bạn đề cao sự lắng nghe (Ái ngữ và Lắng nghe sâu) trong gia đình cũng như các mối quan hệ xã hội. Sự bao dung, nhường nhịn và thấu cảm sẽ hóa giải mọi hiểu lầm nhỏ nhặt, gìn giữ hòa khí ấm êm trong gia đạo.`,
    sucKhoe: `Về phương diện Sức khỏe Thân tâm: Người mệnh ${nguHanh} cần chú trọng cân bằng giữa nhịp độ làm việc và nghỉ ngơi, hạn chế thức khuya hoặc suy nghĩ quá mức. Dành 15 phút mỗi ngày để tập thở chánh niệm, đi bộ thư giãn hoặc tĩnh tâm sẽ giúp tái tạo năng lượng tích cực rất hiệu quả.`,
    loiKhuyenPhatPhap: {
      nghiepDuyen: `Dữ liệu Can Chi - Ngũ hành trên đây chỉ đóng vai trò tham khảo văn hóa Đông phương để bạn hiểu thêm về xu hướng tính cách và nhịp sinh học của bản thân. Đạo Phật dạy "Tâm dẫn đầu các pháp" — chính suy nghĩ, lời nói và hành động thiện lành ở hiện tại mới là yếu tố quyết định hạnh phúc của bạn.`,
      phuongPhapHoaGiai: `Thực hành "Đức năng thắng số" một cách thiết thực, không mê tín: Sống trung thực, giữ tâm bình tĩnh trước thử thách, hiếu thảo với cha mẹ và thường xuyên làm việc có ích cho xã hội.`,
      kinhChuPhuHop: `Gợi ý thực hành tâm linh thanh tịnh: Đọc Kinh Pháp Cú, Kinh Từ Bi (Metta Sutta) hoặc thực tập Thiền Quán Niệm Hơi Thở để nuôi dưỡng sự sáng suốt, bình an nội tâm.`,
      hanhThienBoThi: `Gieo trồng phước lành qua những việc làm cụ thể hằng ngày: Nói lời hòa ái khích lệ người khác, bảo vệ thiên nhiên và san sẻ giúp đỡ những hoàn cảnh khó khăn.`
    },
    tuoiHop: ['Giáp Dần', 'Kỷ Tỵ', 'Ất Mão', 'Đinh Mùi'],
    tuoiKac: ['Canh Thân', 'Mậu Dần', 'Nhâm Tý'],
    mauSacMayMan: nguHanh === 'Kim' ? ['Trắng', 'Vàng ánh kim', 'Nâu đất'] : nguHanh === 'Thủy' ? ['Xanh biển', 'Đen', 'Trắng'] : nguHanh === 'Mộc' ? ['Xanh lục', 'Xanh nước biển'] : nguHanh === 'Hỏa' ? ['Đỏ', 'Hồng', 'Xanh lá'] : ['Vàng sậm', 'Nâu', 'Đỏ'],
    conSoMayMan: [1, 6, 8, 9],
    huongTot: ['Đông Nam (Sinh Khí)', 'Đông (Thiên Y)', 'Nam (Diên Niên)', 'Bắc (Phục Vị)'],
  };
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    const body = await request.json();

    const {
      fullName,
      gender = 'Nam',
      birthDate, // YYYY-MM-DD
      birthHour = 'KhongRo',
      calendarType = 'solar',
      viewYear = 2026,
      focusArea = 'tong_quan',
      wishes = '',
    } = body;

    if (!fullName || !birthDate) {
      return NextResponse.json(
        { error: 'Vui lòng nhập đầy đủ Họ tên và Ngày tháng năm sinh' },
        { status: 400 }
      );
    }

    const birthYear = parseInt(birthDate.split('-')[0], 10);
    if (isNaN(birthYear) || birthYear < 1920 || birthYear > 2030) {
      return NextResponse.json(
        { error: 'Năm sinh không hợp lệ (hỗ trợ từ 1920 đến 2030)' },
        { status: 400 }
      );
    }

    // 1. Tính toán Can Chi, Ngũ Hành, Cung Phi chuẩn xác
    const canChiData = calculateCanChiAndMenh(birthYear, gender as 'Nam' | 'Nữ', viewYear);
    const birthHourObj = GIO_SINH_OPTIONS.find((g) => g.value === birthHour) || GIO_SINH_OPTIONS[0];
    const focusAreaObj = FOCUS_AREAS.find((f) => f.value === focusArea) || FOCUS_AREAS[0];

    // 2. Chuẩn bị Luận giải
    let result: TuViAnalysisResult;
    const apiKey = process.env.GEMINI_API_KEY;

    // Check if Gemini API is available and valid format
    if (apiKey && apiKey.length > 10) {
      try {
        const prompt = `Bạn là một bậc Cao tăng uyên thâm Phật pháp kết hợp Túc Mạng Trí và Thuật Chiêm Bổn Tử Vi Đông Phương.
Nhiệm vụ của bạn là luận giải lá số tử vi kết hợp triết lý NHÂN QUẢ, DUYÊN KHỞI và ĐỨC NĂNG THẮNG SỐ của đạo Phật cho tín chủ sau:

- Họ và tên: ${fullName}
- Giới tính: ${gender}
- Ngày sinh: ${birthDate} (${calendarType === 'lunar' ? 'Âm lịch' : 'Dương lịch'})
- Giờ sinh: ${birthHourObj.label} (${birthHourObj.description})
- Năm sinh Can Chi: ${canChiData.canChi}
- Bản Mệnh Ngũ Hành: ${canChiData.menh}
- Cung Phi Bát Trạch: ${canChiData.cung}
- Năm xem vận hạn: ${viewYear} (${canChiData.namXemCanChi}), Tuổi mụ: ${canChiData.tuoiAm}
- Trọng tâm cần khai sáng: ${focusAreaObj.label}
${wishes ? `- Lời thỉnh cầu / trăn trở của tín chủ: "${wishes}"` : ''}

YÊU CẦU ĐẶC BIỆT:
- Luận giải sâu sắc, thấu đáo, ngôn từ trang nghiêm, từ bi, hướng thiện, giải tỏa lo âu (không dọa nạt, không mê tín dị đoan buôn thần bán thánh).
- Luôn chỉ ra cách chuyển hóa hung họa thành cát lành thông qua việc tu dưỡng Thân - Khẩu - Ý, trì chú, phóng sinh, tạo phước.
- Trả về DUY NHẤT một chuỗi JSON thuần túy (không kèm markdown \`\`\`json hay text bên ngoài) với định dạng sau:
{
  "tongQuan": "Phân tích vận mệnh tổng quan năm ${viewYear}...",
  "congDanh": "Luận giải sự nghiệp, học vấn, quý nhân...",
  "taiLoc": "Luận giải tài chính, đầu tư, giữ tiền...",
  "tinhDuyen": "Luận giải tình cảm, gia đạo, con cái...",
  "sucKhoe": "Luận giải sức khỏe thân tâm...",
  "loiKhuyenPhatPhap": {
    "nghiepDuyen": "Quán chiếu nghiệp lực quá khứ và hiện tại...",
    "phuongPhapHoaGiai": "Cách tu tập, phóng sinh, hồi hướng giải hạn...",
    "kinhChuPhuHop": "Kinh chú khuyến nghị (ví dụ Chú Dược Sư, Chú Đại Bi...)",
    "hanhThienBoThi": "Hành động thiện lành cụ thể..."
  },
  "tuoiHop": ["Tuổi hợp 1", "Tuổi hợp 2", "Tuổi hợp 3"],
  "tuoiKac": ["Tuổi kỵ 1", "Tuổi kỵ 2"],
  "mauSacMayMan": ["Màu 1", "Màu 2", "Màu 3"],
  "conSoMayMan": [1, 6, 8],
  "huongTot": ["Hướng 1", "Hướng 2"]
}`;

        const aiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.6,
                maxOutputTokens: 2048,
              },
            }),
          }
        );

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          let rawText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
          // Clean possible markdown code fence
          rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(rawText);
          
          result = {
            ...canChiData,
            tongQuan: parsed.tongQuan || '',
            congDanh: parsed.congDanh || '',
            taiLoc: parsed.taiLoc || '',
            tinhDuyen: parsed.tinhDuyen || '',
            sucKhoe: parsed.sucKhoe || '',
            loiKhuyenPhatPhap: parsed.loiKhuyenPhatPhap || {
              nghiepDuyen: '',
              phuongPhapHoaGiai: '',
              kinhChuPhuHop: '',
              hanhThienBoThi: '',
            },
            tuoiHop: parsed.tuoiHop || ['Giáp Dần', 'Kỷ Tỵ', 'Ất Mão'],
            tuoiKac: parsed.tuoiKac || ['Canh Thân', 'Mậu Dần'],
            mauSacMayMan: parsed.mauSacMayMan || ['Vàng', 'Trắng', 'Nâu'],
            conSoMayMan: parsed.conSoMayMan || [6, 8, 9],
            huongTot: parsed.huongTot || ['Đông Nam', 'Chính Đông'],
          };
        } else {
          // Fallback to intelligent Buddhist reading
          result = generateIntelligentBuddhistReading(
            fullName,
            gender as 'Nam' | 'Nữ',
            birthDate,
            canChiData.canChi,
            canChiData.menh,
            canChiData.nguHanh,
            canChiData.cung,
            canChiData.tuoiAm,
            viewYear,
            canChiData.namXemCanChi,
            focusAreaObj.label,
            birthHourObj.label,
            wishes
          );
        }
      } catch (e) {
        console.warn('Lỗi phân tích Gemini, chuyển sang thuật toán luận giải nội tại:', e);
        result = generateIntelligentBuddhistReading(
          fullName,
          gender as 'Nam' | 'Nữ',
          birthDate,
          canChiData.canChi,
          canChiData.menh,
          canChiData.nguHanh,
          canChiData.cung,
          canChiData.tuoiAm,
          viewYear,
          canChiData.namXemCanChi,
          focusAreaObj.label,
          birthHourObj.label,
          wishes
        );
      }
    } else {
      // Offline / Pre-configured AI engine
      result = generateIntelligentBuddhistReading(
        fullName,
        gender as 'Nam' | 'Nữ',
        birthDate,
        canChiData.canChi,
        canChiData.menh,
        canChiData.nguHanh,
        canChiData.cung,
        canChiData.tuoiAm,
        viewYear,
        canChiData.namXemCanChi,
        focusAreaObj.label,
        birthHourObj.label,
        wishes
      );
    }

    // 3. Nếu người dùng đã đăng nhập, tự động lưu vào PostgreSQL bảng tu_vi_history
    let savedId: string | null = null;
    if (user?.id) {
      try {
        const insertRes = await query(
          `INSERT INTO tu_vi_history (
            user_id, full_name, gender, birth_date, birth_hour, 
            calendar_type, view_year, focus_area, can_chi, menh, cung, reading_result
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          RETURNING id`,
          [
            user.id,
            fullName,
            gender,
            birthDate,
            birthHour,
            calendarType,
            viewYear,
            focusArea,
            result.canChi,
            result.menh,
            result.cung,
            JSON.stringify(result),
          ]
        );
        savedId = insertRes.rows[0]?.id || null;
      } catch (err) {
        console.error('Lỗi lưu lịch sử tử vi vào PostgreSQL:', err);
      }
    }

    return NextResponse.json({
      success: true,
      savedId,
      isAuthenticated: !!user?.id,
      data: result,
      input: {
        fullName,
        gender,
        birthDate,
        birthHour: birthHourObj.label,
        calendarType,
        viewYear,
        focusArea: focusAreaObj.label,
      },
    });
  } catch (error) {
    console.error('Lỗi xử lý API Tử Vi:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra trong quá trình luận giải tử vi. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
