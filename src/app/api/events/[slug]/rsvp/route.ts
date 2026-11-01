import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// POST /api/events/[slug]/rsvp — register or cancel attendance
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Vui lòng đăng nhập để đăng ký' }, { status: 401 });
  }

  const { slug } = await params;

  const eventRes = await query(
    'SELECT id, max_attendees FROM events WHERE slug = $1',
    [slug]
  );
  const event = eventRes.rows[0];
  if (!event) {
    return NextResponse.json({ error: 'Sự kiện không tồn tại' }, { status: 404 });
  }

  // Check existing registration
  const existingRes = await query(
    'SELECT id FROM event_registrations WHERE event_id = $1 AND user_id = $2',
    [event.id, user.id]
  );

  if (existingRes.rows[0]) {
    // Cancel registration
    await query('DELETE FROM event_registrations WHERE id = $1', [existingRes.rows[0].id]);
    return NextResponse.json({ registered: false });
  }

  // Check capacity
  if (event.max_attendees) {
    const countRes = await query(
      'SELECT COUNT(*) FROM event_registrations WHERE event_id = $1',
      [event.id]
    );
    const count = parseInt(countRes.rows[0].count, 10);
    if (count >= event.max_attendees) {
      return NextResponse.json({ error: 'Sự kiện đã đủ số lượng đăng ký' }, { status: 409 });
    }
  }

  await query(
    'INSERT INTO event_registrations (event_id, user_id) VALUES ($1, $2)',
    [event.id, user.id]
  );

  return NextResponse.json({ registered: true }, { status: 201 });
}
