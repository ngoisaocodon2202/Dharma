import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Bạn là Trợ lý Phật Pháp AI (@phatphap.ai) — người bạn đồng hành thông thái, từ bi và nhẹ nhàng.
Nhiệm vụ:
- Giải đáp tường tận mọi câu hỏi về Phật giáo, giáo lý (Tứ Diệu Đế, Bát Chánh Đạo, Nhân Quả, Duyên Khởi, Vô Thường, Vô Ngã).
- Hướng dẫn thực hành: tọa thiền, niệm Phật, trì chú, sám hối, ăn chay, giữ giới, nghi thức cúng giỗ gia tiên đúng Chánh pháp.
- Lắng nghe, an ủi và tháo gỡ những nỗi khổ niềm đau trong cuộc sống (áp lực công việc, gia đình, sân giận, lo âu).
Phong cách:
- Mở đầu bằng "Nam Mô Bổn Sư Thích Ca Mâu Ni Phật 🙏" hoặc "Nam Mô A Di Đà Phật 🙏".
- Ngôn từ ấm áp, từ bi, dễ hiểu, chia ý rõ ràng, kết thúc bằng lời chúc an lành.`;

/**
 * Kho Tri Thức Phật Pháp Nội Bộ (Đảm bảo trả lời sâu sắc ngay cả khi chưa cấu hình API Key trên đám mây)
 */
function generateBuiltInDharmaAnswer(question: string, dharmaName?: string): string {
  const q = question.toLowerCase();
  const greeting = dharmaName
    ? `Nam Mô A Di Đà Phật 🙏 Mến chào đạo hữu **${dharmaName}**!`
    : `Nam Mô Bổn Sư Thích Ca Mâu Ni Phật 🙏 Mến chào quý đạo hữu!`;

  if (q.includes('tứ diệu đế') || q.includes('khổ')) {
    return `${greeting}

Về **Tứ Diệu Đế (Bốn Sự Thật Cao Quý)** và sự chuyển hóa khổ đau, Đức Phật dạy rằng:

1. **Khổ Đế (Dukkha):** Nhận diện chân thật những bất như ý trong đời sống (sinh, lão, bệnh, tử, cầu bất đắc, ái biệt ly). Nhìn thẳng vào khổ đau mà không trốn chạy đã là bước đầu của trí tuệ.
2. **Tập Đế (Samudaya):** Gốc rễ của khổ đau bắt nguồn từ **Tham ái, Sân hận và Vô minh** (bám chấp vào cái tôi vị kỷ).
3. **Diệt Đế (Nirodha):** Khi buông xả tham chấp và thấu hiểu quy luật vô thường, tâm đạt đến trạng thái tịch tịnh, an nhiên ngay giữa đời thường.
4. **Đạo Đế (Magga):** Con đường thực hành **Bát Chánh Đạo** (Chánh kiến, Chánh tư duy, Chánh ngữ, Chánh nghiệp, Chánh mạng, Chánh tinh tấn, Chánh niệm, Chánh định) để chấm dứt khổ đau.

> *"Chỉ khi thấy rõ bóng tối là bóng tối, ánh sáng trí tuệ mới bắt đầu hiển lộ."*
Nguyện chúc đạo hữu thân tâm thường an lạc! 🪷`;
  }

  if (q.includes('thiền') || q.includes('hơi thở') || q.includes('tĩnh tâm') || q.includes('lo âu') || q.includes('mất ngủ')) {
    return `${greeting}

Để **thực hành Thiền định và làm lắng dịu tâm lo âu**, đạo hữu có thể bắt đầu ngay với pháp môn **Quán Niệm Hơi Thở (Anapanasati)** rất giản dị sau đây:

1. **Tư thế vững chãi:** Ngồi thẳng lưng nhẹ nhàng trên bồ đoàn hoặc ghế, thả lỏng hai vai và khuôn mặt nở nụ cười hàm tiếu.
2. **Theo dõi hơi thở:**
   - Khi hít vào, tâm biết rõ: *"Thở vào, tôi biết tôi đang thở vào (tâm tĩnh lặng)"*.
   - Khi thở ra, tâm biết rõ: *"Thở ra, tôi mỉm cười và buông xả mọi căng thẳng"*.
3. **Không xua đuổi suy nghĩ:** Nếu có suy nghĩ khởi lên, chỉ nhẹ nhàng nhận diện rồi quay về với hơi thở như người mẹ hiền ôm ấp đứa con.

Chỉ cần thực hành đều đặn **10–15 phút mỗi sáng và tối** (có thể kết hợp tiếng chuông trong mục **Phòng Thiền** của website), tâm trí sẽ dần trong sáng như mặt hồ phẳng lặng. ☸`;
  }

  if (q.includes('giỗ') || q.includes('cầu siêu') || q.includes('gia tiên') || q.includes('báo hiếu') || q.includes('vu lan')) {
    return `${greeting}

Trong đạo Phật, **cúng giỗ gia tiên và báo hiếu ông bà cha mẹ** mang ý nghĩa tâm linh và đạo đức vô cùng cao đẹp:

1. **Cúng chay thanh tịnh (Khuyên dùng nhất):** Thay vì sát sinh hại vật làm tăng thêm nghiệp chướng cho người đã khuất, gia đình nên chuẩn bị **mâm cơm chay thanh khiết**, hoa tươi, trái cây và nước sạch dâng cúng.
2. **Tụng kinh & Niệm Phật hồi hướng:** Trong ngày giỗ, con cháu cùng nhau tụng một thời **Kinh Địa Tạng**, **Kinh A Di Đà** hoặc **Kinh Vu Lan Báo Hiếu**, rồi đem công đức ấy hồi hướng cho hương linh gia tiên được siêu sinh Tịnh Độ.
3. **Làm việc phước thiện:** Phóng sinh, bố thí, giúp đỡ người nghèo khó nhân ngày giỗ của ông bà — theo Kinh Địa Tạng, người mất sẽ nhận được một phần bảy công đức và người còn sống hưởng trọn sáu phần bảy phước lành.

*(Đạo hữu có thể lưu lại ngày giỗ Âm lịch trong mục **Lịch Vạn Niên & Nhắc Nhở** để hệ thống tự động nhắc hằng năm).* 🙏`;
  }

  if (q.includes('ăn chay') || q.includes('ngũ giới') || q.includes('giới luật') || q.includes('phóng sinh')) {
    return `${greeting}

Về **Ăn chay (Trai giới) và nuôi dưỡng lòng Từ bi**:

- **Ý nghĩa của ăn chay:** Ăn chay trong đạo Phật không phải là ép xác, mà là nuôi dưỡng hạt giống **Từ Bi**, tôn trọng sự sống của muôn loài và giúp thân nhẹ nhàng, tâm thanh tịnh, ít sân hận.
- **Lịch ăn chay phổ biến:**
  - **Nhị trai (2 ngày/tháng):** Mùng 1 và Rằm (15 Âm lịch).
  - **Tứ trai (4 ngày/tháng):** Mùng 1, 14, 15 và 30 (hoặc 29 tháng thiếu).
  - **Thập trai (10 ngày/tháng):** Mùng 1, 8, 14, 15, 18, 23, 24, 28, 29, 30 Âm lịch.
- **Điều cốt lõi:** Ăn chay nơi miệng cần đi đôi với **"Tâm chay"** — nói lời ái ngữ, buông bỏ tham lam, hận thù.

Nguyện chúc đạo hữu tinh tấn trên con đường nuôi dưỡng thiện tâm! 🪷`;
  }

  if (q.includes('nhân quả') || q.includes('nghiệp') || q.includes('số phận') || q.includes('màu') || q.includes('ngày tốt')) {
    return `${greeting}

Dưới ánh sáng Chánh kiến của Đạo Phật về **Luật Nhân Quả, Nghiệp Báo và Ngày Lành**:

1. **Con người là chủ nhân của Nghiệp:** Đức Phật dạy không có thần linh nào ban phước hay giáng họa; mọi hạnh phúc hay khổ đau đều do chính **Thân – Khẩu – Ý** của ta tạo tác.
2. **Đức năng thắng số:** Việc tham khảo **Màu chủ đạo bản mệnh** hay **Ngày Hoàng Đạo** giúp ta có thêm sự hài hòa về mặt tâm lý và ngũ hành, nhưng yếu tố quyết định thành bại chính là **Phước đức và Chánh niệm**.
3. **Chuyển hóa vận mệnh:**
   - Muốn cầu tài lộc bền vững -> Hãy chăm chỉ làm việc chân chính và thực hành **Bố thí, Sẻ chia**.
   - Muốn cầu sức khỏe trường thọ -> Hãy **Bảo vệ sự sống, ăn chay, phóng sinh**.
   - Muốn cầu trí tuệ sáng suốt -> Hãy **Học hỏi Chánh pháp, lắng nghe và quán chiếu**.

> *"Tâm bình thế giới bình — Ngày nào giữ trọn ba nghiệp thiện lành thì ngày đó chính là Ngày Hoàng Đạo tối thắng!"* ☸`;
  }

  if (q.includes('lịch sử') || q.includes('thích ca') || q.includes('xuất xứ') || q.includes('phật giáo')) {
    return `${greeting}

Về **Lịch sử và Xuất xứ của Phật giáo**:

- **Khởi nguyên:** Phật giáo ra đời vào thế kỷ thứ VI TCN tại Ấn Độ cổ đại, do **Thái tử Tất-đạt-đa Cồ-đàm (Siddhartha Gautama)** sáng lập. Ngài đản sinh tại vườn Lâm-tỳ-ni (624 TCN), xuất gia năm 29 tuổi, thành đạo dưới cội Bồ-đề tại Bodh Gaya năm 35 tuổi hiệu là **Đức Phật Thích Ca Mâu Ni**, và hoằng pháp suốt 45 năm trước khi nhập Niết-bàn tại Câu-thi-na (544 TCN).
- **Tại Việt Nam:** Phật giáo du nhập trực tiếp từ Ấn Độ qua đường biển vào trung tâm **Luy Lâu (Bắc Ninh)** ngay từ thế kỷ I – II đầu Công nguyên, phát triển rực rỡ qua các triều đại Lý – Trần với đỉnh cao là **Thiền phái Trúc Lâm Yên Tử** do Phật hoàng Trần Nhân Tông sáng lập.

Đạo hữu có thể xem trọn bộ dòng thời gian 2.600 năm tại mục **Lịch Sử Phật Giáo** trên thanh menu! 🙏`;
  }

  return `${greeting}

Cảm ơn đạo hữu đã gửi câu hỏi: *"${question}"*.

Theo lời Đức Phật dạy trong Kinh Pháp Cú:
> *"Ý dẫn đầu các pháp, Ý làm chủ, ý tạo. Nếu với ý thanh tịnh, nói lên hay hành động, an lạc bước theo sau, như bóng không rời hình."*

Để ứng dụng Phật pháp vào vấn đề đạo hữu đang quan tâm, hãy thực hành **3 nguyên tắc cốt lõi (Giới - Định - Tuệ)**:
1. **Giữ tâm bình tĩnh và chánh niệm:** Dừng lại 3 hơi thở sâu trước mọi quyết định để tâm không bị cuốn theo cảm xúc nóng vội.
2. **Quán xét theo lý Nhân – Duyên – Quả:** Mọi việc đến đi đều do đủ duyên; hãy gieo nhân lành bằng lời nói ái ngữ, lòng bao dung và hành động chân thật.
3. **Thường xuyên tụng kinh, niệm Phật hoặc nghe pháp thoại:** Dành 15 phút mỗi ngày lắng nghe lời giảng của chư Tôn đức Tăng Ni để nuôi dưỡng năng lượng bình an từ bên trong.

Nếu đạo hữu muốn hỏi sâu hơn về **Giáo lý, Thiền định, Lịch sử Phật giáo, Ngày giỗ hay Màu chủ đạo**, xin cứ chia sẻ cùng Trợ lý Phật Pháp nhé! Nam Mô A Di Đà Phật 🪷`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const content = (body.content || body.question || '').trim();
    const dharmaName = body.dharmaName || '';
    const lang = body.lang || 'vi';

    if (!content) {
      return NextResponse.json({ error: 'Nội dung câu hỏi không được để trống' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let replyText = '';

    if (apiKey && !apiKey.includes('YOUR_')) {
      try {
        const langInstruction =
          lang !== 'vi'
            ? `\nHãy trả lời bằng ngôn ngữ có mã "${lang}" một cách trang trọng, giữ nguyên các danh từ riêng Phật giáo.`
            : '';

        const aiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: SYSTEM_PROMPT + langInstruction }] },
              contents: [{ role: 'user', parts: [{ text: content }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 900,
              },
            }),
          }
        );

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          replyText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
      } catch (aiErr) {
        console.warn('Gemini fallback to built-in Dharma wisdom:', aiErr);
      }
    }

    if (!replyText) {
      replyText = generateBuiltInDharmaAnswer(content, dharmaName);
    }

    const now = new Date().toISOString();
    return NextResponse.json({
      userMessage: {
        id: `usr-${Date.now()}`,
        role: 'user',
        content,
        created_at: now,
      },
      assistantMessage: {
        id: `bot-${Date.now() + 1}`,
        role: 'assistant',
        content: replyText,
        created_at: now,
      },
      answer: replyText,
      success: true,
    });
  } catch (err) {
    console.error('Lỗi xử lý AI Phật pháp:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ messages: [] });
}
