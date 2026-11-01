import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

const SYSTEM_PROMPT = `Bạn là @phatphap.ai — một trợ lý Phật Pháp thông thái, từ bi và nhẹ nhàng.
Nhiệm vụ: Giải đáp Phật Pháp, hướng dẫn thiền định, chia sẻ kinh kệ, an ủi tâm hồn và gieo duyên lành.
Phong cách: Ấm áp, từ bi, tiếng Việt chuẩn mực, ngắn gọn, súc tích. Mở đầu bằng "Nam Mô A Di Đà Phật 🙏" khi phù hợp.`;

// GET /api/chat — Lấy lịch sử chat cá nhân từ PostgreSQL
export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });

  try {
    const res = await query(
      `SELECT id, role, content, metadata, created_at
       FROM direct_chat_messages
       WHERE user_id = $1
       ORDER BY created_at ASC
       LIMIT 100`,
      [user.id]
    );

    return NextResponse.json({ messages: res.rows });
  } catch (err) {
    console.error('Lỗi lấy tin nhắn:', err);
    return NextResponse.json({ error: 'Lỗi truy vấn cơ sở dữ liệu' }, { status: 500 });
  }
}

// POST /api/chat — Gửi tin nhắn và lưu trữ vào PostgreSQL
export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });

  try {
    const body = await request.json();
    const content = body.content?.trim();

    if (!content) {
      return NextResponse.json({ error: 'Nội dung tin nhắn không được để trống' }, { status: 400 });
    }

    // 1. Lưu tin nhắn của người dùng vào PostgreSQL
    const userMsgRes = await query(
      `INSERT INTO direct_chat_messages (user_id, role, content)
       VALUES ($1, 'user', $2)
       RETURNING id, role, content, created_at`,
      [user.id, content]
    );

    const userMessage = userMsgRes.rows[0];

    // 2. Nếu có GEMINI_API_KEY, tự động sinh câu trả lời AI và lưu vào PostgreSQL
    const apiKey = process.env.GEMINI_API_KEY;
    let assistantMessage = null;

    if (apiKey) {
      try {
        const aiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
              contents: [{ role: 'user', parts: [{ text: content }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 800,
              },
            }),
          }
        );

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const replyText = aiData.candidates?.[0]?.content?.parts?.[0]?.text;

          if (replyText) {
            // Lưu câu trả lời của AI vào PostgreSQL
            const botMsgRes = await query(
              `INSERT INTO direct_chat_messages (user_id, role, content)
               VALUES ($1, 'assistant', $2)
               RETURNING id, role, content, created_at`,
              [user.id, replyText]
            );
            assistantMessage = botMsgRes.rows[0];
          }
        }
      } catch (aiErr) {
        console.error('Lỗi gọi Gemini AI:', aiErr);
      }
    }

    return NextResponse.json({
      userMessage,
      assistantMessage,
      success: true,
    });
  } catch (err) {
    console.error('Lỗi gửi tin nhắn:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ' }, { status: 500 });
  }
}
