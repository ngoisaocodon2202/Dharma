import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// POST /api/meditation/sessions — save a completed meditation session
export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  // Guest sessions are silently ignored (no error)
  if (!user) {
    return NextResponse.json({ saved: false });
  }

  const body = await req.json();
  const durationSeconds: number = body.duration_seconds;
  const soundType: string = body.sound_type || 'BELL';

  if (!durationSeconds || durationSeconds < 60) {
    return NextResponse.json({ error: 'Phiên thiền quá ngắn' }, { status: 400 });
  }

  await query(
    'INSERT INTO meditation_sessions (user_id, duration_seconds, sound_type) VALUES ($1, $2, $3)',
    [user.id, durationSeconds, soundType]
  );

  return NextResponse.json({ saved: true }, { status: 201 });
}

// GET /api/meditation/sessions — get user's meditation history summary
export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ totalSessions: 0, totalMinutes: 0, recentSessions: [] });
  }

  const [summaryRes, recentRes] = await Promise.all([
    query(
      `SELECT COUNT(*) as total_sessions, COALESCE(SUM(duration_seconds), 0) as total_seconds
       FROM meditation_sessions WHERE user_id = $1`,
      [user.id]
    ),
    query(
      `SELECT duration_seconds, sound_type, completed_at
       FROM meditation_sessions WHERE user_id = $1
       ORDER BY completed_at DESC LIMIT 7`,
      [user.id]
    ),
  ]);

  const summary = summaryRes.rows[0];
  return NextResponse.json({
    totalSessions: parseInt(summary.total_sessions, 10),
    totalMinutes: Math.round(parseInt(summary.total_seconds, 10) / 60),
    recentSessions: recentRes.rows,
  });
}
