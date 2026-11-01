import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/practice/history — list completed practice IDs for current user
export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ completedIds: [] });
  }

  const res = await query(
    `SELECT practice_id FROM user_practice_history WHERE user_id = $1 ORDER BY completed_at DESC`,
    [user.id]
  );

  return NextResponse.json({
    completedIds: res.rows.map((r: any) => r.practice_id),
  });
}

// POST /api/practice/history — toggle practice completion
export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Vui lòng đăng nhập' }, { status: 401 });
  }

  const body = await req.json();
  const practiceId: string = body.practice_id;
  if (!practiceId) {
    return NextResponse.json({ error: 'Thiếu practice_id' }, { status: 400 });
  }

  // Verify practice exists
  const practiceRes = await query('SELECT id FROM daily_practices WHERE id = $1', [practiceId]);
  if (!practiceRes.rows[0]) {
    return NextResponse.json({ error: 'Không tìm thấy bài thực hành' }, { status: 404 });
  }

  const existing = await query(
    'SELECT id FROM user_practice_history WHERE user_id = $1 AND practice_id = $2',
    [user.id, practiceId]
  );

  if (existing.rows[0]) {
    await query('DELETE FROM user_practice_history WHERE id = $1', [existing.rows[0].id]);
    return NextResponse.json({ completed: false });
  } else {
    await query(
      'INSERT INTO user_practice_history (user_id, practice_id) VALUES ($1, $2)',
      [user.id, practiceId]
    );
    return NextResponse.json({ completed: true }, { status: 201 });
  }
}
