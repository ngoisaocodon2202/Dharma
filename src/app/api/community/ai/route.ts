import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

const SYSTEM_PROMPT = `Bạn là @phatphap.ai — một trợ lý Phật Pháp thông thái, từ bi và nhẹ nhàng.

Nhiệm vụ của bạn:
- Giải đáp mọi câu hỏi về Phật giáo, giáo lý, kinh điển, thiền định, nhân quả, nghiệp lực
- Hướng dẫn thực hành: tọa thiền, niệm Phật, trì chú, sám hối
- Giải thích khái niệm: Tứ Diệu Đế, Bát Chánh Đạo, Duyên Khởi, Vô Ngã, Vô Thường
- Chia sẻ trích dẫn kinh điển phù hợp (Kinh Pháp Cú, Kinh A Di Đà, v.v.)
- Khuyến khích tu tập, gieo duyên lành

Phong cách:
- Trả lời bằng tiếng Việt, gần gũi, dễ hiểu
- Ngắn gọn súc tích (3-5 đoạn tối đa)
- Dùng lời lẽ ấm áp, từ bi — không phán xét
- Mở đầu bằng "Nam Mô A Di Đà Phật 🙏" khi phù hợp
- Kết thúc bằng một câu khích lệ tu học

Giới hạn:
- Chỉ trả lời về Phật Pháp và các chủ đề tâm linh liên quan
- Từ chối nhẹ nhàng nếu câu hỏi ngoài phạm vi`;

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI chưa được cấu hình' }, { status: 503 });
  }

  const body = await request.json();
  const { question, groupId } = body;

  if (!question?.trim()) {
    return NextResponse.json({ error: 'Câu hỏi trống' }, { status: 400 });
  }

  // Auto-enroll user if not yet a member
  const member = await query(
    'SELECT id FROM group_memberships WHERE group_id = $1 AND user_id = $2',
    [groupId, user.id]
  );
  if (!member.rows[0]) {
    await query(
      'INSERT INTO group_memberships (group_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [groupId, user.id]
    );
  }

  // 1. Save user's question directly to group_messages in PostgreSQL
  await query(
    `INSERT INTO group_messages (group_id, user_id, content) VALUES ($1, $2, $3)`,
    [groupId, user.id, `@phatphap.ai ${question.trim()}`]
  );

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text: question.trim() }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.error('Gemini error:', err);
      return NextResponse.json({ error: 'AI tạm thời không khả dụng' }, { status: 502 });
    }

    const data = await res.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!answer) {
      return NextResponse.json({ error: 'AI không trả lời được' }, { status: 502 });
    }

    // 2. Save AI response as an official bot message in PostgreSQL
    const BOT_USER_ID = '00000000-0000-0000-0000-000000000099';
    const aiContent = `🤖 **@phatphap.ai** trả lời câu hỏi của ${user.full_name}:\n\n*"${question.trim()}"*\n\n---\n\n${answer}`;

    const msgRes = await query(
      `INSERT INTO group_messages (group_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, content, created_at`,
      [groupId, BOT_USER_ID, aiContent]
    );

    return NextResponse.json({
      answer,
      message: {
        ...msgRes.rows[0],
        user_id: BOT_USER_ID,
        full_name: '🤖 phatphap.ai',
        dharma_name: 'Trí Tuệ Nhân Tạo',
        avatar_url: '/ai-logo.png',
        is_ai: true,
      }
    });
  } catch (err) {
    console.error('AI error:', err);
    return NextResponse.json({ error: 'Lỗi kết nối AI' }, { status: 500 });
  }
}
