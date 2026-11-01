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
  canChi: string,
  menh: string,
  nguHanh: string,
  cung: string,
  tuoiAm: number,
  viewYear: number,
  namXemCanChi: string,
  focusAreaLabel: string,
  birthHourLabel: string
): TuViAnalysisResult {
  const isHopHanh = nguHanh === 'Kim' || nguHanh === 'Thủy';
  
  return {
    canChi,
    menh,
    nguHanh,
    cung,
    namXemCanChi,
    tuoiAm,
    tongQuan: `Quý chủ ${fullName} (${gender}), tuổi ${canChi}, nạp âm ${menh}, bước vào năm ${viewYear} (${namXemCanChi}) ở độ tuổi mụ ${tuoiAm}. Chiêm nghiệm tinh bàn cho thấy đây là một chu kỳ có sự giao thoa mạnh mẽ giữa thiên thời và nhân quả quá khứ. Sinh vào ${birthHourLabel}, bản mệnh mang bản chất kiên định, giàu lòng từ ái nhưng đôi khi chất chứa nhiều suy tư nội tâm. Trong năm ${namXemCanChi}, vận trình chuyển biến từ biến động sang ổn định. Mọi sự cát hung đều do tâm dẫn dắt; khi tâm định và giữ chánh niệm, hung tinh tự khắc hóa lành.`,
    congDanh: `Về đường công danh, đây là thời kỳ thích hợp để tích lũy nội lực, trau dồi chuyên môn hơn là mạo hiểm bứt phá mù quáng. Đối với trọng tâm "${focusAreaLabel}", quý bạn sẽ gặp được quý nhân chỉ dẫn hoặc bạn đồng tu nâng đỡ trong các thời khắc quyết định. Hãy giữ phong thái khiêm cung, minh bạch trong các bản hợp đồng và kiên nhẫn vượt qua các thử thách đầu năm, quý ba và quý bốn sẽ đón nhận quả ngọt xứng đáng.`,
    taiLoc: `Dòng tiền trong năm ${viewYear} có sự luân chuyển đều đặn. Cần cảnh giác với những lời mời gọi đầu tư lướt sóng hoặc các cơ hội sinh lời phi thực tế. Đức Phật dạy "Của phi nghĩa vào cửa trước sẽ ra cửa sau", do đó việc chăm chỉ làm ăn chân chính kết hợp với thói quen trích một phần tài chính làm thiện nguyện, cúng dường Tam Bảo sẽ giúp củng cố kho tài lộc bền vững, tránh nạn hao tài tán của.`,
    tinhDuyen: `Gia đạo và các mối tương quan nhân duyên trong năm có nhiều xúc cảm sâu sắc. Có những nút thắt hoặc hiểu lầm đến từ việc thiếu lắng nghe ái ngữ. Lời khuyên cho bạn là hãy thực tập "Lắng nghe với tâm từ", tránh nóng giận buông lời làm tổn thương người thân thương. Đối với người độc thân, duyên lành sẽ khởi phát khi bạn tham gia vào các hoạt động thiện nguyện, khóa tu hoặc môi trường cộng đồng thanh tịnh.`,
    sucKhoe: `Thể trạng bản mệnh chịu ảnh hưởng của ngũ hành ${nguHanh}. Cần lưu tâm dưỡng khí huyết, hệ tiêu hóa và hạn chế thức khuya âu lo. Tinh thần an lạc là liều thuốc dưỡng sinh tối thượng. Mỗi ngày nên dành ít nhất 15-30 phút ngồi tĩnh tọa, niệm Phật hoặc đi kinh hành để xả bỏ căng thẳng, giữ năng lượng tích cực cho thân tâm an định.`,
    loiKhuyenPhatPhap: {
      nghiepDuyen: `Phật giáo quán chiếu rằng "Tướng do tâm sinh, cảnh tùy tâm chuyển, số do nghiệp tạo". Lá số tử vi phản ánh một phần quả vị của nghiệp nhân nhiều đời, nhưng hoàn toàn có thể cải biến nhờ vào ý chí tu tập và hành thiện trong hiện tại. Vận trình năm nay nhắc nhở bạn cần trả bớt nghiệp cũ bằng sự nhẫn nhịn và gieo thêm nhân lành phước báu mới.`,
      phuongPhapHoaGiai: `Thực hành "Đức năng thắng số": Hàng tháng vào các ngày rằm, mùng một nên ăn chay, hạn chế sát sinh, chủ động phóng sinh các loài thủy sản, chim muông để tích phước thọ mạng và bình an. Mở rộng tâm lượng bố thí, giúp đỡ người cơ nhỡ.`,
      kinhChuPhuHop: `Kinh Dược Sư Lưu Ly Quang Vương Như Lai (cầu bình an, tiêu tai diệt tội), Chú Đại Bi (84 câu, thanh lọc từ trường, giải tỏa chướng duyên), Kinh Phổ Môn (quán chiếu hạnh từ bi của Bồ Tát Quán Thế Âm).`,
      hanhThienBoThi: `Trích 5-10% lợi tức làm công đức hồi hướng gia tiên và chúng sinh; tham gia các khóa tu Bát Quan Trai hoặc thực tập thiền hơi thở tại gia để tâm an vạn sự an.`
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
            canChiData.canChi,
            canChiData.menh,
            canChiData.nguHanh,
            canChiData.cung,
            canChiData.tuoiAm,
            viewYear,
            canChiData.namXemCanChi,
            focusAreaObj.label,
            birthHourObj.label
          );
        }
      } catch (e) {
        console.warn('Lỗi phân tích Gemini, chuyển sang thuật toán luận giải nội tại:', e);
        result = generateIntelligentBuddhistReading(
          fullName,
          gender as 'Nam' | 'Nữ',
          canChiData.canChi,
          canChiData.menh,
          canChiData.nguHanh,
          canChiData.cung,
          canChiData.tuoiAm,
          viewYear,
          canChiData.namXemCanChi,
          focusAreaObj.label,
          birthHourObj.label
        );
      }
    } else {
      // Offline / Pre-configured AI engine
      result = generateIntelligentBuddhistReading(
        fullName,
        gender as 'Nam' | 'Nữ',
        canChiData.canChi,
        canChiData.menh,
        canChiData.nguHanh,
        canChiData.cung,
        canChiData.tuoiAm,
        viewYear,
        canChiData.namXemCanChi,
        focusAreaObj.label,
        birthHourObj.label
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
